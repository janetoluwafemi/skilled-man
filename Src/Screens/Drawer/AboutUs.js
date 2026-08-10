import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';

const AbutUs = props => {
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CstmHeader
        title="Help"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        style={styles.containerStyle}
        showsVerticalScrollIndicator={false}>
        {global.role === 0 || global.role === '0' ? (
          <View>
            <Text style={styles.headStyle}>
              1. What is Skilledman and what does it do?
            </Text>
            <Text style={styles.headCont}>
              Skilledman is a platform that connects skilled artisans (such as
              electricians, plumbers, tailors, carpenters, etc.) with
              individuals or businesses in need of their services, quickly and
              conveniently.
            </Text>
            <Text style={styles.headStyle}>
              2. How do I register as an artisan?
            </Text>
            <Text style={styles.headCont}>
              Download the app, select "Register as Artisan," and complete the
              registration form. Once your details are verified, you'll be
              listed as an available service provider.
            </Text>
            <Text style={styles.headStyle}>
              3. How do I get started as an artisan on Skilled Man?
            </Text>
            <Text style={styles.headCont}>
              Simply download the Skilled Man app, register as an artisan,
              complete your profile with your skills, experience, and
              certifications (if any), and start receiving job requests from
              nearby customers.
            </Text>
            <Text style={styles.headStyle}>4. Is there a service fee?</Text>
            <Text style={styles.headCont}>
              Skilledman charges a small service fee for each completed booking
              to maintain the platform and ensure quality service delivery. Fees
              will be transparently displayed during the booking process.
            </Text>
            <Text style={styles.headStyle}>
              5. Do I need to pay to use the platform as an artisan?
            </Text>
            <Text style={styles.headCont}>
              Creating a profile is free. However, a small service fee or
              commission may apply for completed jobs. Full pricing details are
              available in your dashboard.
            </Text>
            <Text style={styles.headStyle}>6. How are artisans verified?</Text>
            <Text style={styles.headCont}>
              All artisans undergo a verification process that includes ID
              checks, experience confirmation, and sometimes customer reviews,
              to ensure trust and safety.
            </Text>
            <Text style={styles.headStyle}>
              7. What if I have a complaint or issue?
            </Text>
            <Text style={styles.headCont}>
              You can reach out to our customer support team directly through
              the app or email us at support@skilledman.com. We'll do our best to
              resolve the issue promptly.
            </Text>
            <Text style={styles.headStyle}>
              8. Can I set my own working hours and availability?
            </Text>
            <Text style={styles.headCont}>
              Yes! You have full control over your schedule. Update your
              availability anytime so customers can book you when you're free.
            </Text>
            <Text style={styles.headStyle}>
              9. How will I get paid for my services?
            </Text>
            <Text style={styles.headCont}>
              Payments are processed securely through the app. Once the job is
              completed and confirmed by the customer, your earnings will be
              transferred directly to your registered bank or wallet.
            </Text>
            <Text style={styles.headStyle}>
              10. What if a customer cancels a job last minute?
            </Text>
            <Text style={styles.headCont}>
              We understand your time is valuable. In case of last-minute
              cancellations, a cancellation fee may apply based on the app’s
              policy, which will be credited to you if applicable.
            </Text>
            <Text style={styles.headStyle}>
              11. How do I get verified as a skilled artisan on the Skilled Man
              app?
            </Text>
            <Text style={styles.headCont}>
              After signing up, complete your profile and upload valid
              identification and samples of your work. Our team will review and
              verify your account within 48 hours.
            </Text>
            <Text style={styles.headStyle}>
              12. Can I set my own rates for services?
            </Text>
            <Text style={styles.headCont}>
              Yes! Skilled Man gives you full control over your pricing. Be
              transparent and fair to attract more customers.
            </Text>
            <Text style={styles.headStyle}>
              13. How do I get more job requests?
            </Text>
            <Text style={styles.headCont}>
              Keep your profile updated with reviews, photos, and completed
              projects. Active and highly rated artisans get more visibility.
            </Text>
            <Text style={styles.headStyle}>
              14. Is there a fee to use the Skilled Man app as an artisan?
            </Text>
            <Text style={styles.headCont1}>
              Signing up is free. A small service fee is deducted from completed
              job payments to maintain the platform.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.headStyle}>
              1. What is Skilledman and what does it do?
            </Text>
            <Text style={styles.headCont}>
              Skilledman is a platform that connects skilled artisans (such as
              electricians, plumbers, tailors, carpenters, etc.) with
              individuals or businesses in need of their services, quickly and
              conveniently.
            </Text>
            <Text style={styles.headStyle}>
              2. How do I find an artisan on Skilledman?
            </Text>
            <Text style={styles.headCont}>
              Download the app, create an account, and search for artisans by
              category or location. You can view profiles, reviews, and ratings
              to choose the best artisan for your needs.
            </Text>
            <Text style={styles.headStyle}>3. How do I book an artisan?</Text>
            <Text style={styles.headCont}>
              Select an artisan, check their availability, and send a booking
              request. Once the artisan accepts, you'll receive a confirmation.
            </Text>
            <Text style={styles.headStyle}>4. Is there a service fee?</Text>
            <Text style={styles.headCont}>
              Skilledman charges a small service fee for each completed booking
              to maintain the platform and ensure quality service delivery. Fees
              will be transparently displayed during the booking process.
            </Text>
            <Text style={styles.headStyle}>5. How do I pay for services?</Text>
            <Text style={styles.headCont}>
              Payments are processed securely through the app. You can pay using
              your preferred payment method, and the funds will be released to
              the artisan after the job is completed.
            </Text>
            <Text style={styles.headStyle}>
              6. What if I have a complaint or issue?
            </Text>
            <Text style={styles.headCont}>
              You can reach out to our customer support team directly through
              the app or email us at support@skilledman.com. We'll do our best to
              resolve the issue promptly.
            </Text>
            <Text style={styles.headStyle}>7. Can I cancel a booking?</Text>
            <Text style={styles.headCont}>
              Yes, you can cancel a booking. However, cancellation fees may
              apply based on the app’s policy.
            </Text>
            <Text style={styles.headStyle}>
              8. How do I leave a review for an artisan?
            </Text>
            <Text style={styles.headCont}>
              After the job is completed, you'll have the option to leave a
              review and rating for the artisan. Your feedback helps improve the
              platform and assists other users in making informed decisions.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AbutUs;

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
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  headStyle: {
    color: color.gry,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
    lineHeight: 24,
  },
  headCont: {
    color: color.gry,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 10,
  },
  headCont1: {
    marginBottom: 35,
    fontSize: 14,
    lineHeight: 21,
    color: color.gry,
  },
});