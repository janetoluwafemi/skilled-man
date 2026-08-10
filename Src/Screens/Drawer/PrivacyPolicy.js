import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';

const PrivcyPlcy = props => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Privacy Policy"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivcyPlcy;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
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