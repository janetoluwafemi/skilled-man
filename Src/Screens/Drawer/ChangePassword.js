import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const ChangePassword = props => {
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hideCurrent, setHideCurrent] = useState(true);
  const [hideNew, setHideNew] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [load, setLoad] = useState(false);

  const handleUpdate = async () => {
    if (!password.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showToast('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.');
      return;
    }

    try {
      setLoad(true);

      const formdata = new FormData();
      formdata.append('id', global.id);
      formdata.append('password', confirmPassword);
      formdata.append('old_password', password);

      const response = await fetch(`${BASIC_URL}user/resetpassword.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result.success === 'Password updated successfully.') {
        showToast('Password updated successfully.');
        navigation.navigate('account_setting');
      } else {
        showToast(result.error || 'Password Update Failed.');
      }
    } catch (error) {
      setLoad(false);
      showToast('Network Error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Feather
                name="lock"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Update Password</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your current password and choose a new password to keep your account secure.
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Current Password</Text>
              <C_InputScurEntry
                placeholder="Enter current password"
                placeholderTextColor={color.litGry}
                secureTextEntry={hideCurrent}
                icon="eye-off"
                onChangeText={setPassword}
                value={password}
                onPress={() => setHideCurrent(!hideCurrent)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <C_InputScurEntry
                placeholder="Enter new password"
                placeholderTextColor={color.litGry}
                secureTextEntry={hideNew}
                icon="eye-off"
                onChangeText={setNewPassword}
                value={newPassword}
                onPress={() => setHideNew(!hideNew)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              <C_InputScurEntry
                placeholder="Confirm new password"
                placeholderTextColor={color.litGry}
                secureTextEntry={hideConfirm}
                icon="eye-off"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                onPress={() => setHideConfirm(!hideConfirm)}
              />
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText={
                load ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  'Update Password'
                )
              }
              onPressFunc={handleUpdate}
            />
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});