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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';
import color from '../../Assets/colors/colors';
import HomStakWSarch from '../../Components/HomeStackWithSearch';
import { Icons } from '../../Components/Icons';
import FltLstCrd from '../../Components/FlatListCard';
import BotonComp from '../../Components/BtnComp';
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
            <HomStakWSarch
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
                contentContainerStyle={[
                    styles.cardContainer,
                    { paddingBottom: bottomPadding },
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No requests found</Text>
                    </View>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icons.FontAwesome5
                                    name="times"
                                    color={color.wite}
                                    size={20}
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
                                <View style={styles.dateTimeCont}>
                                    <TouchableOpacity
                                        onPress={openFile}
                                        style={styles.fileBtn}>
                                        <Icons.FontAwesome
                                            name="file-text"
                                            size={20}
                                            color={color.drkGry}
                                        />

                                        <Text style={styles.bookingStyle}>
                                            {' '}Service Detail
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            <TouchableOpacity>
                                <Text style={styles.getDir}>Get Direction</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.btnContainer}>
                            <BotonComp
                                BtnStyle={styles.acceptStyle}
                                btnTextStyle={styles.btnTextStyle}
                                btnText="Accept"
                                onPressFunc={() => changeStatus('progress')}
                            />

                            <BotonComp
                                BtnStyle={styles.rejectStyle}
                                btnTextStyle={styles.btnTextStyle}
                                btnText="Reject"
                                onPressFunc={() => changeStatus('reject')}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default RequestScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardContainer: {
        paddingHorizontal: 15,
        paddingTop: 40,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: color.gry,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        borderRadius: 12,
        width: '85%',
        backgroundColor: color.wite,
        overflow: 'hidden',
        elevation: 5,
    },
    modalHeader: {
        backgroundColor: color.defalt,
        alignItems: 'flex-end',
        paddingVertical: 14,
        paddingHorizontal: 15,
    },
    successmodalBody: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    logoImg: {
        width: width / 4,
        height: width / 4,
        marginTop: -40,
        borderRadius: (width / 4) / 2,
        borderWidth: 2,
        borderColor: color.wite,
    },
    pendAppr: {
        fontWeight: 'bold',
        fontSize: 17,
        color: color.blak,
        paddingVertical: 5,
    },
    bookingStyle: {
        fontSize: 14,
        color: color.gry,
        fontWeight: '400',
    },
    dateTimeCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
    },
    dateStyle: {
        fontSize: 14,
        color: color.ylow,
        fontWeight: '400',
    },
    fileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    btnTextStyle: {
        fontSize: 13,
    },
    acceptStyle: {
        width: '47%',
    },
    rejectStyle: {
        backgroundColor: color.rd,
        borderColor: color.rd,
        borderWidth: 2,
        width: '47%',
    },
    getDir: {
        color: color.defalt,
        fontWeight: '700',
        paddingTop: 5,
    },
});