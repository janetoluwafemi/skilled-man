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

const FAQ_DATA_ARTISAN = [
  {
    q: '1. What is Skilledman and what does it do?',
    a: 'Skilledman is a platform that connects skilled artisans (such as electricians, plumbers, tailors, carpenters, etc.) with individuals or businesses in need of their services quickly and conveniently.',
  },
  {
    q: '2. How do I register as an artisan?',
    a: 'Download the app, select "Register as Artisan," and complete the registration form. Once your details are verified, you\'ll be listed as an available service provider.',
  },
  {
    q: '3. How do I get started as an artisan on Skilled Man?',
    a: 'Simply download the Skilled Man app, register as an artisan, complete your profile with your skills, experience, and certifications (if any), and start receiving job requests from nearby customers.',
  },
  {
    q: '4. Is there a service fee?',
    a: 'Skilledman charges a small service fee for each completed booking to maintain the platform and ensure quality service delivery. Fees will be transparently displayed during the booking process.',
  },
  {
    q: '5. Do I need to pay to use the platform as an artisan?',
    a: 'Creating a profile is free. However, a small service fee or commission may apply for completed jobs. Full pricing details are available in your dashboard.',
  },
  {
    q: '6. How are artisans verified?',
    a: 'All artisans undergo a verification process that includes ID checks, experience confirmation, and customer reviews to ensure trust and safety.',
  },
  {
    q: '7. What if I have a complaint or issue?',
    a: 'You can reach out to our customer support team directly through the app or email us at support@skilledman.com. We\'ll do our best to resolve the issue promptly.',
  },
  {
    q: '8. Can I set my own working hours and availability?',
    a: 'Yes! You have full control over your schedule. Update your availability anytime so customers can book you when you\'re free.',
  },
  {
    q: '9. How will I get paid for my services?',
    a: 'Payments are processed securely through the app. Once the job is completed and confirmed by the customer, your earnings will be transferred directly to your registered bank account or wallet.',
  },
  {
    q: '10. What if a customer cancels a job last minute?',
    a: 'We understand your time is valuable. In case of last-minute cancellations, a cancellation fee may apply based on the app’s policy, which will be credited to you if applicable.',
  },
  {
    q: '11. How do I get verified as a skilled artisan?',
    a: 'After signing up, complete your profile and upload valid identification and samples of your work. Our team will review and verify your account within 48 hours.',
  },
  {
    q: '12. Can I set my own rates for services?',
    a: 'Yes! Skilled Man gives you full control over your pricing. Be transparent and fair to attract more customers.',
  },
  {
    q: '13. How do I get more job requests?',
    a: 'Keep your profile updated with reviews, photos, and completed projects. Active and highly rated artisans receive greater visibility.',
  },
  {
    q: '14. Is there a fee to use the app as an artisan?',
    a: 'Signing up is free. A small service fee is deducted from completed job payments to maintain the platform.',
  },
];

const FAQ_DATA_USER = [
  {
    q: '1. What is Skilledman and what does it do?',
    a: 'Skilledman is a platform that connects skilled artisans (such as electricians, plumbers, tailors, carpenters, etc.) with individuals or businesses in need of their services quickly and conveniently.',
  },
  {
    q: '2. How do I find an artisan on Skilledman?',
    a: 'Download the app, create an account, and search for artisans by category or location. You can view profiles, reviews, and ratings to choose the best artisan for your needs.',
  },
  {
    q: '3. How do I book an artisan?',
    a: 'Select an artisan, check their availability, and send a booking request. Once the artisan accepts, you\'ll receive a confirmation.',
  },
  {
    q: '4. Is there a service fee?',
    a: 'Skilledman charges a small service fee for each completed booking to maintain the platform and ensure quality service delivery. Fees will be transparently displayed during the booking process.',
  },
  {
    q: '5. How do I pay for services?',
    a: 'Payments are processed securely through the app. You can pay using your preferred payment method, and the funds will be released to the artisan after the job is completed.',
  },
  {
    q: '6. What if I have a complaint or issue?',
    a: 'You can reach out to our customer support team directly through the app or email us at support@skilledman.com. We\'ll do our best to resolve the issue promptly.',
  },
  {
    q: '7. Can I cancel a booking?',
    a: 'Yes, you can cancel a booking. However, cancellation fees may apply based on the app’s policy.',
  },
  {
    q: '8. How do I leave a review for an artisan?',
    a: 'After the job is completed, you\'ll have the option to leave a review and rating for the artisan. Your feedback helps improve the platform and assists other users in making informed decisions.',
  },
];

const AboutUs = props => {
  const insets = useSafeAreaInsets();
  const isArtisan = global.role === 0 || global.role === '0';
  const faqList = isArtisan ? FAQ_DATA_ARTISAN : FAQ_DATA_USER;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 24;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={500}>
          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Feather
                name="help-circle"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Frequently Asked Questions</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions about using the Skilledman platform.
          </Text>

          <View style={styles.faqList}>
            {faqList.map((item, index) => (
              <View key={index} style={styles.faqCard}>
                <View style={styles.faqHeaderRow}>
                  <Icons.Feather
                    name="info"
                    size={16}
                    color={color.defalt}
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                </View>
                <Text style={styles.faqAnswer}>{item.a}</Text>
              </View>
            ))}
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 8,
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
    paddingHorizontal: 20,
    paddingTop: 10,
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
    fontSize: 24,
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
  faqList: {
    width: '100%',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    paddingLeft: 24,
  },
});