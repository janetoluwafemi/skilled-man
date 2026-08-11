import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

// Safe platform guard for react-native-simple-toast
let SimpleToast;
if (Platform.OS !== 'web') {
    SimpleToast = require('react-native-simple-toast').default;
}

const showToast = msg => {
    if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.alert) {
            window.alert(msg);
        }
    } else if (SimpleToast) {
        SimpleToast.show(msg, SimpleToast.SHORT);
    }
};

const FrgtPaswrd = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [load, setLoad] = useState(false);

    const validateEmail = text => {
        const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        return re.test(String(text).toLowerCase());
    };

    const handleNext = async () => {
        if (!email.trim()) {
            setEmailError('Please enter your email address.');
            showToast('Please enter your email address.');
            return;
        }

        if (!validateEmail(email.trim())) {
            setEmailError('Please enter a valid email address.');
            showToast('Please enter a valid email address.');
            return;
        }

        try {
            setLoad(true);
            const formdata = new FormData();
            formdata.append('email', email.trim());

            const response = await fetch(`${BASIC_URL}resend_otp.php`, {
                method: 'POST',
                body: formdata,
            });

            const result = await response.json();
            setLoad(false);

            if (result) {
                global.forgetemail = email.trim();
                if (result.otp) {
                    global.forgetotp = result.otp;
                }
                showToast('OTP sent successfully.');
                navigation.navigate('ForgetpasswordOtpScreen', { Email: email.trim() });
            } else {
                showToast(result.error || 'Failed to send OTP.');
            }
        } catch (error) {
            setLoad(false);
            showToast('Network error. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.headerBar}>
                <CstmHeaderIcon
                    onPress={() => navigation.goBack()}
                    headerIconStyle={styles.headerBackIcon}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    style={styles.formContainer}>

                    <View style={styles.logoRow}>
                        <Image
                            source={require('../../Assets/Images/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.welcomeTitle}>Reset Password</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Enter your registered email address to receive an OTP code to reset your account password.
                    </Text>

                    {/* Form Input Card */}
                    <View style={styles.formCard}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Email Address</Text>
                            <C_TxtInput
                                placeholder="e.g. name@example.com"
                                value={email}
                                onChangeText={val => {
                                    setEmail(val);
                                    if (emailError) setEmailError('');
                                }}
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
                                load ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    'Send Verification Code'
                                )
                            }
                            onPressFunc={handleNext}
                        />
                    </View>

                    {/* Footer Back Link */}
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Remembered your password? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FrgtPaswrd;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerBar: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 12 : 6,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    headerBackIcon: {
        color: '#0F172A',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginLeft: 12,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    logoRow: {
        alignItems: 'center',
        marginBottom: 12,
    },
    logoImage: {
        width: 80,
        height: 80,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 4,
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
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
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 2,
    },
    submitBtn: {
        width: '100%',
        backgroundColor: color.defalt,
        borderRadius: 12,
        paddingVertical: 14,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        color: '#64748B',
        fontSize: 14,
    },
    footerLink: {
        color: color.defalt,
        fontSize: 14,
        fontWeight: '700',
    },
});