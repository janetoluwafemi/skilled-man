import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    FlatList,
    Linking,
    Platform,
    Modal,
    StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';
import color from '../../Assets/colors/colors';
import HomeStakWSearch from '../../Components/HomeStackWithSearch';
import { Icons } from '../../Components/Icons';
import FltLstCrd from '../../Components/FlatListCard';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const RequestScreen = () => {
    const navigation = useNavigation();
    const focused = useIsFocused();
    const insets = useSafeAreaInsets();

    const [modalVisible, setModalVisible] = useState(false);
    const [booklist, setBooklist] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const bottomPadding =
        height * 0.085 +
        Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
        20;

    const toggleModal = (item) => {
        if (item.status !== 'progress') {
            setCurrentItem(item);
            setModalVisible(true);
        } else {
            showToast('This request is already in progress and cannot be modified.');
        }
    };

    const getBookingRequests = useCallback(async () => {
        try {
            const formdata = new FormData();
            formdata.append('provider_id', global.id);

            if (searchTerm.trim() !== '') {
                formdata.append('searchTerm', searchTerm.trim());
            }
            const response = await fetch(`${BASIC_URL}provider_status.php`, {
                method: 'POST',
                body: formdata,
            });
            const result = await response.json();
            if (result?.booking_request) {
                setBooklist(result.booking_request);
            } else if (result?.error) {
                showToast(result.error);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (focused) {
            getBookingRequests();
        }
    }, [focused, getBookingRequests]);

    const changeStatus = async (statusValue) => {
        try {
            const formdata = new FormData();
            formdata.append('id', currentItem.booking_id);
            formdata.append('status', statusValue);

            const response = await fetch(`${BASIC_URL}status_update.php`, {
                method: 'POST',
                body: formdata,
            });

            const result = await response.json();

            if (result?.success) {
                showToast(result.success);
                setModalVisible(false);
                setCurrentItem(null);
                getBookingRequests();
            } else if (result?.error) {
                showToast(result.error);
            }
        } catch (error) {
            Alert.alert('Error', error?.message || 'An error occurred');
        }
    };

    const openFile = () => {
        if (!currentItem?.file) return;

        const fileURL = `${BASIC_URL}uploads/${currentItem.file}`;

        Linking.openURL(fileURL).catch(err =>
            console.error(`Error opening file: ${err}`)
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <HomeStakWSearch
                onPress={() => navigation.openDrawer()}
                onPressnotification={() => navigation.navigate('edit_profile')}
                onChangeText={val => setSearchTerm(val)}
                value={searchTerm}
            />

            <FlatList
                data={booklist}
                keyExtractor={(item, index) =>
                    item.booking_id?.toString() || index.toString()
                }
                renderItem={({ item, index }) => (
                    <FltLstCrd
                        index={index}
                        cardTitle={item.name}
                        bookingId={`Booking ID - ${item.booking_id}`}
                        date={item.service_date}
                        time={item.service_time}
                        status={item.status}
                        onPressShowProfile={() => toggleModal(item)}
                        iconName="ellipsis-v"
                        filepress={item.file}
                    />
                )}
                contentContainerStyle={StyleSheet.flatten([
                    styles.cardContainer,
                    { paddingBottom: bottomPadding },
                ])}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icons.Feather name="inbox" size={48} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No Booking Requests</Text>
                        <Text style={styles.emptySubtitle}>
                            New customer service requests will appear here.
                        </Text>
                    </View>
                }
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <Animatable.View animation="zoomIn" duration={300} style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitleText}>Request Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icons.Ionicons
                                    name="close-circle"
                                    color="#94A3B8"
                                    size={24}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.successmodalBody}>
                            <Image
                                style={styles.logoImg}
                                resizeMode="cover"
                                source={
                                    currentItem?.profile
                                        ? {
                                            uri: `${BASIC_URL}uploads/${currentItem.profile}`,
                                        }
                                        : require('../../Assets/Images/user.jpg')
                                }
                            />

                            <Text style={styles.pendAppr}>{currentItem?.name}</Text>

                            <Text style={styles.bookingStyle}>
                                Booking ID - {currentItem?.booking_id}
                            </Text>

                            <View style={styles.dateTimeCont}>
                                <Icons.Feather
                                    name="calendar"
                                    size={14}
                                    color={color.defalt}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.dateStyle}>
                                    {currentItem?.service_date}
                                </Text>

                                {currentItem?.service_time ? (
                                    <Text style={styles.bookingStyle}>
                                        {' '}({currentItem.service_time})
                                    </Text>
                                ) : null}
                            </View>

                            {currentItem?.file ? (
                                <View style={styles.fileRowCont}>
                                    <TouchableOpacity
                                        onPress={openFile}
                                        style={styles.fileBtn}>
                                        <Icons.Feather
                                            name="paperclip"
                                            size={15}
                                            color={color.defalt}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text style={styles.fileBtnText}>
                                            View Service Attachment
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            <TouchableOpacity activeOpacity={0.7} style={styles.getDirBtn}>
                                <Icons.Feather
                                    name="navigation"
                                    size={14}
                                    color={color.defalt}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.getDir}>Get Direction</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.acceptBtn}
                                onPress={() => changeStatus('progress')}>
                                <Text style={styles.acceptBtnText}>Accept</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.rejectBtn}
                                onPress={() => changeStatus('reject')}>
                                <Text style={styles.rejectBtnText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default RequestScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    cardContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 14,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalView: {
        borderRadius: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    modalHeader: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitleText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    successmodalBody: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 18,
    },
    logoImg: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 3,
        borderColor: '#F8FAFC',
        backgroundColor: '#E2E8F0',
        marginBottom: 8,
    },
    pendAppr: {
        fontWeight: '800',
        fontSize: 18,
        color: '#0F172A',
        marginTop: 4,
    },
    bookingStyle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
        marginTop: 2,
    },
    dateTimeCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
        marginTop: 4,
    },
    dateStyle: {
        fontSize: 13,
        color: '#0F172A',
        fontWeight: '700',
    },
    fileRowCont: {
        marginVertical: 6,
    },
    fileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    fileBtnText: {
        fontSize: 12,
        color: color.defalt,
        fontWeight: '700',
    },
    getDirBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingVertical: 4,
    },
    getDir: {
        color: color.defalt,
        fontWeight: '700',
        fontSize: 13,
    },
    btnContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
        flexDirection: 'row',
        paddingHorizontal: 18,
    },
    acceptBtn: {
        width: '48%',
        backgroundColor: color.defalt,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    acceptBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    rejectBtn: {
        width: '48%',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectBtnText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 14,
    },
});