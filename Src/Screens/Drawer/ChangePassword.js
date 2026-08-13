import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const ChangPaswrd = props => {
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CstmHeader
        title="Change Password"
        onPressBack={() => props.navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Update Password</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your current password and choose a new password to keep your account secure.
          </Text>

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
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangPaswrd;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
    lineHeight: 20,
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
  submitBtn: {
    width: '100%',
    marginTop: 10,
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 14,
  },
});