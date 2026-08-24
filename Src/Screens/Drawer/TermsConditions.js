import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const TermCondition = props => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.containerStyle}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Terms & Conditions</Text>
          <Text style={styles.welcomeSubtitle}>
            Please read these terms carefully before using the Skilledman platform.
          </Text>

          <View style={styles.cardWrapper}>
            <Text style={styles.lastUpdated}>Last Updated: April 22, 2025</Text>

            <Text style={styles.subTitle}>1. Use of the Platform</Text>
            <Text style={styles.bodyText}>
              Skilledman App provides a digital platform for connecting skilled
              service providers (“Providers”) with service users (“Users”). Users
              must be at least 18 years old and provide accurate personal
              information when registering. Providers must supply valid
              documentation including certifications, guarantor references, and
              verifiable contact details.
            </Text>

            <Text style={styles.subTitle}>2. Registration and Verification</Text>
            <Text style={styles.bodyText}>
              All Providers are subject to verification of credentials, work
              experience, and identity. Users agree to provide accurate service
              location details and be available at the appointed time.
            </Text>

            <Text style={styles.subTitle}>3. Payments</Text>
            <Text style={styles.bodyText}>
              Users agree to pay service charges via the provided payment gateway.
              Skilledman App will deduct a service fee and remit the balance to
              Providers’ registered bank accounts. All payment transactions are
              handled securely via our payment processor.
            </Text>

            <Text style={styles.subTitle}>4. Service Responsibility</Text>
            <Text style={styles.bodyText}>
              Skilledman App acts as a facilitator and is not responsible for the
              quality or outcome of services rendered. Disputes between Users and
              Providers must be resolved amicably; however, Skilledman App may
              assist in mediation.
            </Text>

            <Text style={styles.subTitle}>5. Alerts and Notifications</Text>
            <Text style={styles.bodyText}>
              Users and Providers agree to receive service notifications via SMS
              and email. It is the responsibility of both parties to keep contact
              information up to date.
            </Text>

            <Text style={styles.subTitle}>6. Termination</Text>
            <Text style={styles.bodyText}>
              Skilledman App reserves the right to suspend or terminate any
              account for violations of these terms.
            </Text>

            <Text style={styles.subTitle}>7. Liability</Text>
            <Text style={styles.bodyText}>
              Skilledman App shall not be liable for any indirect, incidental, or
              consequential damages arising from service use.
            </Text>

            <Text style={styles.subTitle}>8. Changes</Text>
            <Text style={styles.bodyText}>
              These Terms may be updated from time to time. Continued use of the
              platform indicates acceptance of any revised terms.
            </Text>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermCondition;

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
    padding: 20,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
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