import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { Country, State } from 'country-state-city';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import HomStakwithoutsarch from '../../Components/HomeStackwithoutsearch';
import Two_Crd from '../../Components/Two_Card';
import { Icons } from '../../Components/Icons';
import { useAuth } from '../../context/AuthProvider';
import BotonComp from '../../Components/BtnComp';
import C_Dropdwn from '../../Components/C_Dropdown';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const Dshbord = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const { state } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [signinmodal, setsigninmodal] = useState(false);

    const [certficate, setCertficate] = useState(null);
    const [guarantor, setGuarantor] = useState(null);
    const [jobReferences, setJobReferences] = useState(null);

    const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
    const [selectedExperience, setSelectedExperience] = useState('year of experience');

    const [load, setLoad] = useState(false);
    const [items, setItems] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');

    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [association, setAssociation] = useState('');

    const pickerRef = useRef();

    const experienceOptions = [
        { id: 1, select_bussiness: 'Year of experience' },
        { id: 2, select_bussiness: '0-1' },
        { id: 3, select_bussiness: '1-2' },
        { id: 4, select_bussiness: '2-3' },
        { id: 5, select_bussiness: '3-4' },
        { id: 6, select_bussiness: '4-5' },
    ];

    const getOverallServices = useCallback(async () => {
        try {
            const response = await fetch(`${BASIC_URL}get_services.php`, {
                method: 'POST',
            });
            const result = await response.json();
            if (result && result.add_skills) {
                setItems(result.add_skills);
            }
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    }, []);

    useEffect(() => {
        getOverallServices();
    }, [getOverallServices]);

    useEffect(() => {
        if (isFocused) {
            const countriesData = Country.getAllCountries();
            setCountries(countriesData);
        }
    }, [isFocused]);

    useEffect(() => {
        if (state.isAuth === true) {
            setModalVisible(true);
        }
    }, [state.isAuth]);

    useEffect(() => {
        const fetchUserDataAndCheckModal = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    const parsedUserData = JSON.parse(storedUserData);
                    if (parsedUserData?.working_experience && state.isAuth === true) {
                        setsigninmodal(true);
                    }
                }
            } catch (error) {
                console.log('AsyncStorage fetch error:', error);
            }
        };

        fetchUserDataAndCheckModal();
    }, [state.isAuth]);

    const onCountryChange = countryCode => {
        setSelectedCountry(countryCode);
        setSelectedState('');
        const countryStates = State.getStatesOfCountry(countryCode);
        setStates(countryStates);
    };

    // ✅ FIX: Updated to use Expo DocumentPicker API
    const handlFilPik = async value => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Pick all file types
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const pickedFile = result.assets[0];
                if (value === 'Guarantor') setGuarantor(pickedFile);
                if (value === 'Job References') setJobReferences(pickedFile);
                if (value === 'Certificates') setCertficate(pickedFile);
            }
        } catch (error) {
            console.log('Document picking error:', error);
        }
    };

    const handlADdetail = async () => {
        if (
            selectedBusiness === 'Select Business' ||
            selectedExperience === 'Year of experience' ||
            !certficate ||
            !guarantor ||
            !jobReferences
        ) {
            Toast.showWithGravity(
                'Please fill the required fields',
                Toast.LONG,
                Toast.CENTER
            );
            return;
        }

        try {
            setLoad(true);
            const formdata = new FormData();
            formdata.append('provider_id', global.id);
            formdata.append('phone_number', number);
            formdata.append('country', selectedCountry);
            formdata.append('address', address);
            formdata.append('association', association);
            formdata.append('select_bussiness', selectedBusiness);
            formdata.append('working_experience', selectedExperience);

            // Extract file objects directly from Expo DocumentPicker response
            formdata.append('certificates', {
                uri: certficate.uri,
                name: certficate.name || 'certificate',
                type: certficate.mimeType || 'application/octet-stream',
            });

            formdata.append('job_references', {
                uri: jobReferences.uri,
                name: jobReferences.name || 'reference',
                type: jobReferences.mimeType || 'application/octet-stream',
            });

            formdata.append('gurantor', {
                uri: guarantor.uri,
                name: guarantor.name || 'guarantor',
                type: guarantor.mimeType || 'application/octet-stream',
            });

            formdata.append('type', global.role || '1');

            await fetch(`${BASIC_URL}add_users_detail.php`, {
                method: 'POST',
                body: formdata,
            });

            setLoad(false);
            setsigninmodal(false);
            navigation.navigate('AddBank');
        } catch (error) {
            setLoad(false);
            console.log('Error submitting details:', error);
        }
    };

    const bottomPadding =
        height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

    return (
        <View style={styles.safeContainer}>
            <HomStakwithoutsarch
                onPress={() => navigation.openDrawer()}
                onPressnotification={() => navigation.navigate('edit_profile')}
            />

            <ScrollView
                style={styles.scrollStyle}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: bottomPadding },
                ]}
                showsVerticalScrollIndicator={false}>
                <Two_Crd />

                <View style={styles.chartContainer}>
                    <View style={styles.filterCont}>
                        <Text style={styles.incomeStyle}>Income</Text>
                        <Icons.FontAwesome name="filter" size={20} color={color.defalt} />
                    </View>

                    <BarChart
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            datasets: [{ data: [0, 16, 33, 50, 66, 83, 100] }],
                        }}
                        width={width - 30}
                        height={280}
                        chartConfig={{
                            backgroundGradientFrom: color.wite,
                            backgroundGradientTo: color.gry,
                            decimalPlaces: 0,
                            barPercentage: 0.4,
                            verticalLabelRotation: 0,
                            backgroundGradientToOpacity: 0,
                            showBarTops: false,
                            strokeWidth: 32,
                            color: () => color.ylow,
                            labelColor: () => color.blak,
                        }}
                        style={styles.chartStyle}
                    />
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Disclaimer Notice</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.disclaimerText}>
                                    The following disclaimer outlines the terms of use for the
                                    Skilledman App, a platform designed to connect artisans and
                                    users. By accessing or using the Skilledman application, you
                                    agree to comply with the terms and conditions outlined below.
                                    {'\n\n'}
                                    The app serves as a medium for facilitating communication and
                                    transactions between artisans and users. We do not take
                                    responsibility for the quality, guarantee, pricing, delivery,
                                    or any other aspect of the products or services offered by
                                    artisans.{'\n\n'}
                                    Users are responsible for conducting their own due diligence
                                    before engaging in any business transactions. By using the
                                    Skilledman App, you acknowledge that you have read and
                                    understood this disclaimer.
                                </Text>
                            </ScrollView>

                            <View style={styles.btnWrapper}>
                                <BotonComp
                                    BtnStyle={styles.fullWidthBtn}
                                    btnText="Agree"
                                    onPressFunc={() => setModalVisible(false)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={signinmodal}
                onRequestClose={() => setsigninmodal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.formModalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Complete Provider Details</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.dropdownContainer}>
                                    <C_Dropdwn
                                        selectedValue={selectedBusiness}
                                        options={items}
                                        onValueChange={setSelectedBusiness}
                                    />
                                </View>

                                <View style={styles.dropdownContainer}>
                                    <C_Dropdwn
                                        selectedValue={selectedExperience}
                                        options={experienceOptions}
                                        onValueChange={setSelectedExperience}
                                    />
                                </View>

                                <TouchableOpacity onPress={() => handlFilPik('Certificates')}>
                                    <View style={styles.inputContainer}>
                                        <UploadfilwIcon
                                            placeholder="Certificates"
                                            icon="upload"
                                            title={certficate ? certficate.name : ''}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handlFilPik('Job References')}>
                                    <View style={styles.inputContainer}>
                                        <UploadfilwIcon
                                            placeholder="Job References"
                                            icon="upload"
                                            title={jobReferences ? jobReferences.name : ''}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handlFilPik('Guarantor')}>
                                    <View style={styles.inputContainer}>
                                        <UploadfilwIcon
                                            placeholder="Guarantor"
                                            icon="upload"
                                            title={guarantor ? guarantor.name : ''}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.inputContainer}>
                                    <C_TxtInput
                                        placeholder="Phone Number"
                                        placeholderTextColor={color.defalt}
                                        onChangeText={setNumber}
                                        value={number}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <C_TxtInput
                                        placeholder="Address"
                                        placeholderTextColor={color.defalt}
                                        onChangeText={setAddress}
                                        value={address}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <View style={styles.dropDownContainer}>
                                        <Picker
                                            ref={pickerRef}
                                            selectedValue={selectedCountry}
                                            onValueChange={itemValue => onCountryChange(itemValue)}
                                            mode="dialog"
                                            dropdownIconColor={color.defalt}>
                                            <Picker.Item
                                                label="Select Country"
                                                value=""
                                                color={color.defalt}
                                            />
                                            {countries.map(country => (
                                                <Picker.Item
                                                    key={country.isoCode}
                                                    label={country.name}
                                                    value={country.isoCode}
                                                    color={color.defalt}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <C_TxtInput
                                        placeholder="Association"
                                        placeholderTextColor={color.defalt}
                                        onChangeText={setAssociation}
                                        value={association}
                                    />
                                </View>
                            </ScrollView>

                            <View style={styles.doubleBtnRow}>
                                <BotonComp
                                    BtnStyle={styles.halfBtn}
                                    btnText={
                                        load ? <ActivityIndicator size="small" color="#fff" /> : 'OK'
                                    }
                                    onPressFunc={handlADdetail}
                                />
                                <BotonComp
                                    BtnStyle={styles.halfBtn}
                                    btnText="Add Bank"
                                    onPressFunc={() => {
                                        setsigninmodal(false);
                                        navigation.navigate('PublicRoutes', {
                                            screen: 'AddBankGoogle',
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Dshbord;

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollStyle: {
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    scrollContent: {
        flexGrow: 1,
    },
    chartContainer: {
        backgroundColor: color.wite,
        marginTop: 20,
        borderRadius: 12,
        elevation: 2,
        paddingBottom: 10,
    },
    filterCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    incomeStyle: {
        fontSize: 17,
        color: color.blak,
        fontWeight: '600',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        borderRadius: 12,
        width: '100%',
        maxHeight: '70%',
        backgroundColor: color.wite,
        overflow: 'hidden',
        elevation: 5,
    },
    formModalCard: {
        borderRadius: 12,
        width: '100%',
        maxHeight: '85%',
        backgroundColor: color.wite,
        overflow: 'hidden',
        elevation: 5,
    },
    modalHeader: {
        backgroundColor: color.defalt,
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 15,
    },
    modalTitle: {
        fontSize: 18,
        color: color.wite,
        fontWeight: '700',
    },
    modalBody: {
        padding: 16,
        flex: 1,
    },
    disclaimerText: {
        color: '#334155',
        textAlign: 'justify',
        lineHeight: 22,
        fontSize: 13,
    },
    btnWrapper: {
        marginTop: 15,
        width: '100%',
    },
    fullWidthBtn: {
        width: '100%',
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: 12,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 12,
    },
    dropDownContainer: {
        borderColor: color.defalt,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
    },
    doubleBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    halfBtn: {
        width: '48%',
    },
});