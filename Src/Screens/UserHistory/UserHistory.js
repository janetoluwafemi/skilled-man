import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    FlatList,
    Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BookingCrd from '../../Components/BookingCard';
import DrarTitlProfilHeader from '../../Components/DrawerTitleProfileHeader';
import CstmHeader from '../../Components/CustomHeader';
import Toast from 'react-native-simple-toast';
import FltLstCrd from '../../Components/FlatListCard';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;
const isLargeDevice = height >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const UsrHstry = props => {
    const navigation = useNavigation();
    const focus = useIsFocused();
    const insets = useSafeAreaInsets();
    const [Book_Data, setBook_Data] = useState([]);
    useEffect(() => {
        BokngData();
    }, [focus])
    const BokngData = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=2d0j4je2t3mdtg29p1ncvpab0b");

            var formdata = new FormData();
            formdata.append("user_id", global.id);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            // fetch("https://fisdemoprojects.com/skilledman/api/user/request_booking_service.php", requestOptions)
            //     .then(response => response.json())

            fetch(`${BASIC_URL}user/request_booking_service.php`, requestOptions)
                .then(response => response.json())

                .then(result => {
                    console.log(result, '1234')
                    if (result.booking_request) {
                        setBook_Data(result.booking_request)
                    }
                    if (result.error) {
                        Toast.show(result.error);
                    }
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            Alert.alert('Error', error?.message || String(error) || 'An error occurred');
        }
    }

    const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

    return (
        <SafeAreaView style={{flex: 1}} edges={['top']}>
            <CstmHeader
                title="History"
                onPressBack={() => props.navigation.goBack()}
            />
            <FlatList
                data={Book_Data}
                keyExtractor={(item, index) => item.booking_id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <BookingCrd
                        cardTitle={item.name}
                        bookingId={`Booking ID - ${item.booking_id}`}
                        expertise={item.service}
                        status={item.status}
                        paidTitle={item.service_date}
                        dateCont={styles.dateCont}
                        filepress={item.file}
                    />
                )}
                contentContainerStyle={[
                    styles.cardContainer,
                    {paddingBottom: bottomPadding}
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No booking history found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default UsrHstry;

const styles = StyleSheet.create({
    cardStyle: {
        paddingTop: 0,
    },
    linearGradientStyle: {
        elevation: 0,
        borderRadius: 6,
        height: '100%',
    },
    scrollView: {
        paddingHorizontal: 15,
        paddingVertical: 6,
    },
    vegetableTitle: {
        fontSize: getResponsiveSize(16, 17, 18),
        fontWeight: '800',
        color: color.blak,
    },
    inputCont: {
        marginVertical: 10,
        width: '100%',
    },

    iconCont: {
        width: '38%',
    },
    iconStyle: {
        fontSize: 30,
        color: color.drkGren,
        position: 'absolute',
        right: -180,
        top: 10,
    },

    pendAppr: {
        fontWeight: 'bold',
        fontSize: getResponsiveSize(15, 16, 17),
        color: color.blak,
        paddingVertical: getResponsiveSpacing(4, 5, 6),
    },
    cardContainer: {
        paddingHorizontal: getResponsiveSpacing(12, 15, 18),
        paddingTop: getResponsiveSpacing(8, 10, 12),
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: getResponsiveSize(14, 16, 18),
        color: color.gry,
        fontWeight: '500',
    },
    modalHeader: {
        backgroundColor: color.defalt,
        alignItems: 'flex-end',
        paddingVertical: 17,
        paddingHorizontal: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    logoImg: {
        width: width / 4,
        height: height / 8,
        marginTop: -55,
        borderRadius: 10,
    },
    bookingStyle: {
        fontSize: getResponsiveSize(12, 13, 14),
        color: color.gry,
        fontWeight: '400',
        textAlign: 'left',
    },
    openingStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '93%',
        marginBottom: 15,
    },
    dateTimeCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 6,
    },
    dateStyle: {
        fontSize: getResponsiveSize(12, 13, 14),
        color: color.ylow,
        fontWeight: '400',
        textAlign: 'left',
    },

    btnTextStyle: {
        fontSize: getResponsiveSize(11, 12, 13),
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
    dateCont: {
        fontWeight: '400',
        color: color.gry,
    },
});