import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

import { Icons } from '../../Components/Icons';

const PrivacyPolicy = props => {
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
      </View>

      <ScrollView
        style={styles.containerStyle}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Privacy Policy</Text>
          <Text style={styles.welcomeSubtitle}>
            Learn how we collect, handle, and safeguard your personal information.
          </Text>

          <View style={styles.cardWrapper}>
            <Text style={styles.lastUpdated}>Last Updated: April 22, 2025</Text>

            <Text style={styles.subTitle}>1. Information Collected</Text>
            <Text style={styles.bodyText}>
              For Providers: Name, business details, location, contact
              information, certifications, experience, guarantor details, bank
              information, and tax ID. For Users: Name, contact details, service
              request information, and location where the service is required.
            </Text>

            <Text style={styles.subTitle}>2. Use of Information</Text>
            <Text style={styles.bodyText}>
              To match Users with suitable Providers. To process payments and
              maintain records. To send alerts and notifications related to the
              services requested or provided.
            </Text>

            <Text style={styles.subTitle}>3. Data Sharing</Text>
            <Text style={styles.bodyText}>
              Personal data is shared only as needed to facilitate services (e.g.,
              showing provider details to users and vice versa). We do not sell or
              rent personal data to third parties.
            </Text>

            <Text style={styles.subTitle}>4. Security</Text>
            <Text style={styles.bodyText}>
              We implement appropriate technical and organizational measures to
              protect your data. All payment data is processed securely by our
              payment partners.
            </Text>

            <Text style={styles.subTitle}>5. Your Rights</Text>
            <Text style={styles.bodyText}>
              You have the right to access, update, or delete your personal data.
              You can opt-out of non-essential communications at any time.
            </Text>

            <Text style={styles.subTitle}>6. Cookies and Tracking</Text>
            <Text style={styles.bodyText}>
              We may use cookies to improve your user experience. You may disable
              cookies in your browser settings.
            </Text>

            <Text style={styles.subTitle}>7. Changes to This Policy</Text>
            <Text style={styles.bodyText}>
              We may update this Privacy Policy. You will be notified of
              significant changes through the platform.
            </Text>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

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
  containerStyle: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
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
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subTitle: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  bodyText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
});