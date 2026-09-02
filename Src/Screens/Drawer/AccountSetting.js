import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { Icons } from '../../Components/Icons';
import color from '../../Assets/colors/colors';

const AccSetting = props => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const loadNotificationSetting = useCallback(async () => {
    try {
      const savedValue = await AsyncStorage.getItem('notificationsEnabled');
      if (savedValue !== null) {
        setIsSwitchOn(JSON.parse(savedValue));
      }
    } catch (error) {
      console.log('Error loading notification setting:', error);
    }
  }, []);

  useEffect(() => {
    loadNotificationSetting();
  }, [loadNotificationSetting]);

  const toggleSwitch = async () => {
    const newValue = !isSwitchOn;
    setIsSwitchOn(newValue);
    try {
      await AsyncStorage.setItem(
        'notificationsEnabled',
        JSON.stringify(newValue)
      );
    } catch (error) {
      console.log('Error saving notification setting:', error);
    }
  };

  const bottomPadding =
    Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 24;

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
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Feather name="settings" size={34} color={color.defalt} />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Settings</Text>
          <Text style={styles.welcomeSubtitle}>
            Manage your account details and notification preferences.
          </Text>

          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('editUserProfile')}
              activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Icons.Feather name="user" size={18} color={color.defalt} />
                </View>
                <Text style={styles.settingTitle}>Edit Profile</Text>
              </View>
              <Icons.Feather name="chevron-right" color="#94A3B8" size={18} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('ChangePassword')}
              activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Icons.Feather name="lock" size={18} color={color.defalt} />
                </View>
                <Text style={styles.settingTitle}>Change Password</Text>
              </View>
              <Icons.Feather name="chevron-right" color="#94A3B8" size={18} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.cardWrapper}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Icons.Feather name="bell" size={18} color={color.defalt} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>
                    Receive job updates and alerts
                  </Text>
                </View>
              </View>
              <Switch
                color={color.defalt}
                value={isSwitchOn}
                onValueChange={toggleSwitch}
              />
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccSetting;

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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
    marginLeft: 4,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 50,
  },
});

