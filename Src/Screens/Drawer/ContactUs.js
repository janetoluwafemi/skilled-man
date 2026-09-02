import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const ContactUs = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Enter a valid email address');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Subject is required');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Message is required');
      return;
    }

    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append('name', name.trim());
      formdata.append('email', email.trim());
      formdata.append('phone_number', phoneNumber.trim());
      formdata.append('subject', subject.trim());
      formdata.append('message', message.trim());

      const apiUrl = `${BASIC_URL}contact_us.php`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();

      setLoading(false);
      navigation.goBack();
      if (result && (result.status === 'success' || result.success)) {
        Alert.alert(
          'Success',
          result.success || 'Your message has been received. We will get back to you shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                setName('');
                setEmail('');
                setPhoneNumber('');
                setSubject('');
                setMessage('');
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Submission Failed', result?.error || result?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Network Error', error?.message || 'Unable to connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={styles.formContainer}>

            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Icons.Feather name="headphones" size={36} color={color.defalt} />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Get In Touch</Text>
            <Text style={styles.welcomeSubtitle}>
              Have questions or need assistance? Send us a message
            </Text>

            <View style={styles.cardWrapper}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <C_TxtInput
                  placeholder="e.g. John Doe"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <C_TxtInput
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <C_TxtInput
                  placeholder="e.g. 08012345678"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Subject</Text>
                <C_TxtInput
                  placeholder="e.g. Issue with account creation"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Message</Text>
                <TextInput
                  style={styles.textAreaInput}
                  placeholder="Type your message here..."
                  placeholderTextColor="#94A3B8"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <BotonComp
                BtnStyle={styles.submitBtn}
                btnText={
                  loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    'Send Message'
                  )
                }
                onPressFunc={handleSubmit}
              />
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 18,
    marginTop: 4,
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
    marginBottom: 16,
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
  textAreaInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 100,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
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

