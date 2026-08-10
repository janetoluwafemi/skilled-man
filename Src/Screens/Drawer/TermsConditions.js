import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';

const Term_Condition = props => {
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CstmHeader
        title="Terms & Conditions"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView
        style={styles.containerStyle}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headCont}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Term_Condition;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStyle: {
    backgroundColor: color.wite,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
  },
  headCont: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  lastUpdated: {
    fontSize: 13,
    fontWeight: '600',
    color: color.gry,
    marginBottom: 12,
  },
  subTitle: {
    color: color.gry,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
  },
  bodyText: {
    color: color.gry,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 10,
  },
});