import * as React from 'react';
import {Text, View, Dimensions, StyleSheet, Image, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import {ScrollView} from 'native-base';
import CstmHeader from '../../Components/CustomHeader';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const Term_Condition = props => {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <CstmHeader
        title="Terms & Conditions"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView 
        style={styles.containerStyle}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20}
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headCont}>
          {/* <Text style={styles.mainTitle}>SKILLEDMAN.COM - Terms and Conditions and Privacy Policy</Text> */}
          {/* <View style={styles.separatorLine} /> */}
          <Text style={styles.lastUpdated}>Last Updated: April 22, 2025</Text>

          {/* <Text style={styles.sectionTitle}>Terms and Conditions</Text> */}

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
  containerStyle: {
    backgroundColor: color.wite,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: getResponsiveSpacing(15, 18, 20),
  },
  headCont: {
    paddingHorizontal: getResponsiveSpacing(15, 18, 20),
    paddingBottom: getResponsiveSpacing(25, 30, 35),
  },
  mainTitle: {
    fontSize: getResponsiveSize(20, 21, 22),
    fontWeight: '500',
    color: color.gry,
    marginBottom: getResponsiveSpacing(8, 10, 12),
  },
  lastUpdated: {
    fontSize: getResponsiveSize(12, 13, 14),
    fontWeight: '600',
    color: color.gry,
    marginBottom: getResponsiveSpacing(8, 10, 12),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(16, 17, 18),
    fontWeight: 'bold',
    color: color.gry,
    marginTop: getResponsiveSpacing(15, 18, 20),
  },
  subTitle: {
    color: color.gry,
    fontSize: getResponsiveSize(15, 16, 17),
    lineHeight: getResponsiveSize(22, 24, 26),
    fontWeight: '700',
    marginTop: getResponsiveSpacing(12, 15, 18),
    marginBottom: getResponsiveSpacing(6, 8, 10),
  },
  bodyText: {
    color: color.gry,
    fontSize: getResponsiveSize(14, 15, 16),
    lineHeight: getResponsiveSize(20, 21, 22),
    marginBottom: getResponsiveSpacing(8, 10, 12),
    paddingHorizontal: getResponsiveSpacing(0, 2, 4),
  },
});
