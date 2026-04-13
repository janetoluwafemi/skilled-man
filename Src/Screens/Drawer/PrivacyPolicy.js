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

const PrivcyPlcy = props => {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <CstmHeader
        title="Privacy Policy"
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

          {/* <Text style={styles.sectionTitle}>Privacy Policy</Text> */}

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
    color: '#1261A0',
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
