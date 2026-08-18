import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import ProfileInput from '../../Components/ProfileInput';
import MultiLineInput from '../../Components/MultiLineInput';

const ContactUs = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    Alert.alert('Success', 'Thank you for reaching out to us!');
    setName('');
    setEmail('');
    setMessage('');
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
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.formContainer}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Feather
                name="mail"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Get In Touch</Text>
          <Text style={styles.welcomeSubtitle}>
            Have questions or need assistance? Send us a message and our support team will reply promptly.
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Your Name</Text>
              <ProfileInput
                style={styles.inputStyle}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                icon="user-circle"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <ProfileInput
                style={styles.inputStyle}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="envelope"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Message</Text>
              <MultiLineInput
                style={styles.inputStyle}
                placeholder="Type your message here..."
                placeholderTextColor="#94A3B8"
                value={message}
                onChangeText={setMessage}
                numberOfLines={5}
                styles={styles.multiLineExtra}
              />
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.85}
              onPress={handleSubmit}>
              <Text style={styles.btnText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
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
  inputStyle: {
    color: '#0F172A',
  },
  multiLineExtra: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitBtn: {
    borderRadius: 14,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    marginTop: 8,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});