import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import NavigationService from '../../MainNavigation/NavigationService';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const FAQ_DATA_ARTISAN = [
  {
    q: 'What is Skilledman and what does it do?',
    a: 'Skilledman is a platform that connects skilled artisans (such as electricians, plumbers, tailors, carpenters, etc.) with individuals or businesses in need of their services quickly and conveniently.',
  },
  {
    q: 'How do I register as an artisan?',
    a: 'Download the app, select "Register as Artisan," and complete the registration form. Once your details are verified, you\'ll be listed as an available service provider.',
  },
  {
    q: 'How do I get started as an artisan on Skilled Man?',
    a: 'Simply download the Skilled Man app, register as an artisan, complete your profile with your skills, experience, and certifications (if any), and start receiving job requests from nearby customers.',
  },
  {
    q: 'Is there a service fee?',
    a: 'Skilledman charges a small service fee for each completed booking to maintain the platform and ensure quality service delivery. Fees will be transparently displayed during the booking process.',
  },
  {
    q: 'How are artisans verified?',
    a: 'All artisans undergo a verification process that includes ID checks, experience confirmation, and customer reviews to ensure trust and safety.',
  },
  {
    q: 'Can I set my own working hours and availability?',
    a: 'Yes! You have full control over your schedule. Update your availability anytime so customers can book you when you\'re free.',
  },
  {
    q: 'How will I get paid for my services?',
    a: 'Payments are processed securely through the app. Once the job is completed and confirmed by the customer, your earnings will be transferred directly to your registered bank account or wallet.',
  },
  {
    q: 'What if a customer cancels a job last minute?',
    a: 'In case of last-minute cancellations, a cancellation fee may apply based on the app’s policy, which will be credited to you if applicable.',
  },
  {
    q: 'How do I get more job requests?',
    a: 'Keep your profile updated with reviews, photos, and completed projects. Active and highly rated artisans receive greater visibility.',
  },
];

const FAQ_DATA_USER = [
  {
    q: 'What is Skilledman and what does it do?',
    a: 'Skilledman is a platform that connects skilled artisans (such as electricians, plumbers, tailors, carpenters, etc.) with individuals or businesses in need of their services quickly and conveniently.',
  },
  {
    q: 'How do I find an artisan on Skilledman?',
    a: 'Download the app, create an account, and search for artisans by category or location. You can view profiles, reviews, and ratings to choose the best artisan for your needs.',
  },
  {
    q: 'How do I book an artisan?',
    a: 'Select an artisan, check their availability, and send a booking request. Once the artisan accepts, you\'ll receive a confirmation.',
  },
  {
    q: 'Is there a service fee?',
    a: 'Skilledman charges a small service fee for each completed booking to maintain the platform and ensure quality service delivery.',
  },
  {
    q: 'How do I pay for services?',
    a: 'Payments are processed securely through the app. You can pay using your preferred payment method, and the funds will be released to the artisan after the job is completed.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes, you can cancel a booking. However, cancellation fees may apply based on the app’s policy.',
  },
  {
    q: 'How do I leave a review for an artisan?',
    a: 'After the job is completed, you\'ll have the option to leave a review and rating for the artisan to help others make informed decisions.',
  },
];

const AboutUs = props => {
  const insets = useSafeAreaInsets();
  const isArtisan = global.role === 0 || global.role === '0';
  const faqList = isArtisan ? FAQ_DATA_ARTISAN : FAQ_DATA_USER;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 24;

  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleAccordion = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => NavigationService.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Help & Support</Text>
          <Text style={styles.welcomeSubtitle}>
            Have questions? Browse our FAQ or reach out to our team directly.
          </Text>

          <View style={styles.supportCard}>
            <View style={styles.supportHeader}>
              <View style={styles.supportIconWrap}>
                <Icons.Feather name="headphones" size={20} color={color.defalt} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.supportTitle}>Need Direct Assistance?</Text>
                <Text style={styles.supportSubText}>Our support team is active 24/7</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.contactBtn}
              onPress={() => NavigationService.navigate('ContactUs')}>
              <Icons.Feather name="mail" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.contactBtnText}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqList.map((item, index) => {
              const isOpen = expandedIndex === index;
              return (
                <View key={index} style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleAccordion(index)}
                    style={styles.faqHeaderRow}>
                    <View style={styles.faqIndexWrap}>
                      <Text style={[styles.faqIndexText, isOpen && { color: color.defalt }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={[styles.faqQuestion, isOpen && { color: color.defalt }]}>
                      {item.q}
                    </Text>
                    <Icons.Feather
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={isOpen ? color.defalt : '#94A3B8'}
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.faqBody}>
                      <View style={styles.faqDivider} />
                      <Text style={styles.faqAnswer}>{item.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
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
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  supportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FAF4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  supportSubText: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 12,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginLeft: 2,
  },
  faqList: {
    width: '100%',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  faqCardOpen: {
    borderColor: color.defalt,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIndexWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  faqIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
    lineHeight: 19,
  },
  faqBody: {
    marginTop: 10,
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
});

