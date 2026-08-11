import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import C_InputScurEntrylogin from '../../Components/C_InputSecureEntrylogin';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import { useAuth } from '../../context/AuthProvider';
import { getToken } from '../../utilis/notification';
import { Icons } from '../../Components/Icons';

let SimpleToast;
if (Platform.OS !== 'web') {
    SimpleToast = require('react-native-simple-toast').default;
}

let GoogleSignin;
if (Platform.OS !== 'web') {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
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

export const BASIC_URL = 'https://theskilledman.com/api/';

const Signin = props => {
    const { dispatch } = useAuth();
    const navigation = useNavigation();

    const [checked, setChecked] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(true);
    const [load, setLoad] = useState(false);
    const [googleRole, setGoogleRole] = useState(0);

    useEffect(() => {
        if (Platform.OS !== 'web' && GoogleSignin) {
            GoogleSignin.configure({
                webClientId:
                    '336016778121-qiriu75af7hvitlu9g67naf6hqnl7dsi.apps.googleusercontent.com',
            });
        }
    }, []);

    const handleGoogleSignInFlow = async role => {
        if (Platform.OS === 'web' || !GoogleSignin) {
            showToast('Google Sign-In is configured for Mobile devices.');
            return;
        }

        try {
            setLoad(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();
            const token = await getToken();

            const formdata = new FormData();
            formdata.append('identifier', userInfo.user.email);
            formdata.append('google_id', userInfo.user.id);
            formdata.append('google_token', idToken);
            formdata.append('name', userInfo.user.name);
            formdata.append('photo', userInfo.user.photo);
            formdata.append('role', role);
            formdata.append('password', 'googleuser');
            formdata.append('token', token);

            const response = await fetch(`${BASIC_URL}google_login.php`, {
                method: 'POST',
                body: formdata,
            });
            const result = await response.json();

            if (result.success) {
                await AsyncStorage.setItem('user', JSON.stringify(result));
                await AsyncStorage.setItem('role', role.toString());
                dispatch({ type: 'LOGIN', payload: { user: result, role } });
                navigation.navigate('Parent');
            } else {
                showToast(result.error || 'Google Login Failed');
            }
        } catch (error) {
            showToast('Google Sign-In Error');
        } finally {
            setLoad(false);
        }
    };

    const handleSignIn = async () => {
        if (!userName.trim() || !password.trim()) {
            showToast('Please enter all required fields');
            return;
        }

        const token = await getToken();
        try {
            setLoad(true);
            const formdata = new FormData();
            formdata.append('identifier', userName.trim());
            formdata.append('password', password);
            formdata.append('token', token);

            const response = await fetch(`${BASIC_URL}google_login.php`, {
                method: 'POST',
                body: formdata,
            });
            const result = await response.json();

            if (result && !result.error) {
                await AsyncStorage.setItem('user', JSON.stringify(result));
                await AsyncStorage.setItem('role', result.role.toString());
                dispatch({ type: 'LOGIN', payload: { user: result, role: result.role } });
                navigation.navigate('Parent');
            } else {
                showToast('Invalid credentials, please try again');
            }
        } catch (error) {
            showToast('Something went wrong. Check connection.');
        } finally {
            setLoad(false);
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
                showsVerticalScrollIndicator={false}>
                <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
                    <View style={styles.logoRow}>
                        <Image
                            source={require('../../Assets/Images/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSubtitle}>Sign in to continue to your account</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Email or Phone Number</Text>
                        <C_TxtInput
                            placeholder="e.g. name@example.com or phone"
                            onChangeText={setUserName}
                            value={userName}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Password</Text>
                        <C_InputScurEntrylogin
                            placeholder="Enter your password"
                            secureTextEntry={hide}
                            onChangeText={setPassword}
                            value={password}
                            onPress={() => setHide(!hide)}
                        />
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.checkboxWrapper}
                            onPress={() => setChecked(!checked)}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(!checked)}
                                color={color.defalt}
                            />
                            <Text style={styles.checkboxText}>Remember me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotLink}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <BotonComp
                        BtnStyle={styles.submitBtn}
                        btnText={
                            load ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                'Sign In'
                            )
                        }
                        onPressFunc={handleSignIn}
                    />

                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Text style={styles.googleRoleLabel}>Sign in with Google as:</Text>

                    <View style={styles.segmentContainer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => setGoogleRole(0)}
                            style={[styles.segmentBtn, googleRole === 0 && styles.segmentActive]}>
                            <Icons.FontAwesome5
                                name="user"
                                size={14}
                                color={googleRole === 0 ? color.defalt : '#64748B'}
                                style={styles.segmentIcon}
                            />
                            <Text style={[styles.segmentText, googleRole === 0 && styles.segmentTextActive]}>
                                User
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => setGoogleRole(1)}
                            style={[styles.segmentBtn, googleRole === 1 && styles.segmentActive]}>
                            <Icons.FontAwesome5
                                name="briefcase"
                                size={14}
                                color={googleRole === 1 ? color.defalt : '#64748B'}
                                style={styles.segmentIcon}
                            />
                            <Text style={[styles.segmentText, googleRole === 1 && styles.segmentTextActive]}>
                                Provider
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleGoogleSignInFlow(googleRole.toString())}
                        style={styles.googleBtn}>
                        <Icons.FontAwesome name="google" size={20} color="#DB4437" />
                        <Text style={styles.googleBtnText}>
                            Continue with Google ({googleRole === 0 ? 'User' : 'Provider'})
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>New here? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                            <Text style={styles.footerLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Signin;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        fontSize: 22,
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
        paddingTop: 8,
    },
    logoRow: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoImage: {
        width: 90,
        height: 90,
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
    },
    fieldGroup: {
        marginBottom: 16,
        width: '100%',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    optionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 14,
        color: '#475569',
    },
    forgotLink: {
        fontSize: 14,
        fontWeight: '700',
        color: color.defalt,
    },
    submitBtn: {
        width: '100%',
        backgroundColor: color.defalt,
        borderRadius: 12,
        paddingVertical: 14,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        fontSize: 13,
        color: '#94A3B8',
        paddingHorizontal: 12,
    },
    googleRoleLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
    },
    segmentBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    segmentActive: {
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    segmentIcon: {
        marginRight: 6,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    segmentTextActive: {
        color: color.defalt,
        fontWeight: '700',
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    googleBtnText: {
        color: '#0F172A',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
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