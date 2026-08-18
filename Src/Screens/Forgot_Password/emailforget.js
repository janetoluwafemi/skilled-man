import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    Dimensions,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import { BASIC_URL } from '../Signin/Signin';
import { showToast } from '../../utilis/showToast';

const { width, height } = Dimensions.get('window');

const Frgtpasword1 = props => {
    const navigation = useNavigation();

    const [userName, setUserName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = email => {
        const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        return re.test(String(email).toLowerCase());
    };

    const handleSendOtp = async () => {
        if (!userName.trim()) {
            setEmailError('Please enter your email address.');
            showToast('Please enter your email address.');
            return;
        }

        if (!validateEmail(userName.trim())) {
            setEmailError('Please enter a valid email address.');
            showToast('Please enter a valid email address.');
            return;
        }

        try {
            setLoading(true);
            const formdata = new FormData();
            formdata.append('email', userName.trim());

            const response = await fetch(`${BASIC_URL}forget_password.php`, {
                method: 'POST',
                body: formdata,
            });

            const result = await response.json();
            setLoading(false);

            if (result.success || result.status) {
                global.forgetemail = userName.trim();
                if (result.otp) {
                    global.forgetotp = result.otp;
                }
                showToast('OTP sent to your email.');
                navigation.navigate('ForgetpasswordOtpScreen', { Email: userName.trim() });
            } else {
                showToast(result.error || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            showToast('Network error. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ImageBackground
                source={require('../../Assets/Images/bg.png')}
                resizeMode="cover"
                style={styles.backgroundImg}>
                <CstmHeaderIcon
                    onPress={() => props.navigation.goBack()}
                    headerIcon={styles.headerIcon}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        style={styles.formContainer}>
                        <View style={styles.logoStyle}>
                            <Image
                                style={styles.logoImg}
                                resizeMode="contain"
                                source={require('../../Assets/Images/logo.png')}
                            />
                        </View>

                        <Text style={styles.welcomeTitle}>Forgot Password</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Enter your registered email address below to receive an OTP verification code.
                        </Text>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Email Address</Text>
                            <C_TxtInput
                                placeholder="Enter your email"
                                placeholderTextColor={color.litGry}
                                onChangeText={val => {
                                    setUserName(val);
                                    if (emailError) setEmailError('');
                                }}
                                value={userName}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {emailError ? (
                                <Text style={styles.errorText}>{emailError}</Text>
                            ) : null}
                        </View>

                        <BotonComp
                            BtnStyle={styles.submitBtn}
                            btnText={
                                loading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    'Send OTP'
                                )
                            }
                            onPressFunc={handleSendOtp}
                        />
                    </Animatable.View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Frgtpasword1;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    headerIcon: {
        paddingLeft: 20,
        marginTop: 10,
    },
    formContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        width: '100%',
    },
    logoStyle: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    logoImg: {
        width: width / 2,
        height: height / 5,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: color.defalt,
        marginBottom: 6,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 28,
        lineHeight: 20,
        textAlign: 'center',
    },
    fieldGroup: {
        marginBottom: 20,
        width: '100%',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    errorText: {
        color: color.rd,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    submitBtn: {
        width: '100%',
        marginTop: 10,
        backgroundColor: color.defalt,
        borderRadius: 12,
        paddingVertical: 14,
    },
});
