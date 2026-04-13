import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Switch} from 'react-native-paper';
import Icon, {Icons} from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';

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

const AccSetting = props => {
  useEffect(() => {
    const loadNotificationSetting = async () => {
      const savedValue = await AsyncStorage.getItem('notificationsEnabled');

      if (savedValue !== null) {
        setIsSwitchOn(JSON.parse(savedValue));
      }
    };

    loadNotificationSetting();
  }, []);

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const iconSize = getResponsiveSize(26, 28, 30);
  const arrowIconSize = getResponsiveSize(24, 26, 28);
  const bottomPadding =
    Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;
  const toggleSwitch = async () => {
    const newValue = !isSwitchOn;
    setIsSwitchOn(newValue);

    await AsyncStorage.setItem(
      'notificationsEnabled',
      JSON.stringify(newValue),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <CstmHeader
        title="Settings"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: bottomPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.accountContainer}>
          <Icons.FontAwesome
            name="user-circle-o"
            size={iconSize}
            color={color.defalt}
          />
          <Text style={styles.headStyle}>Account</Text>
        </View>
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('editUserProfile')}
            activeOpacity={0.7}>
            <Text style={styles.subTitle}>Edit Profile</Text>
            <Icons.FontAwesome
              name="angle-right"
              color={color.gry}
              size={arrowIconSize}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('ChangePassword')}
            activeOpacity={0.7}>
            <Text style={styles.subTitle}>Change Password</Text>
            <Icons.FontAwesome
              name="angle-right"
              color={color.gry}
              size={arrowIconSize}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.accountContainer, styles.notificationHeader]}>
          <Icons.FontAwesome name="bell" size={iconSize} color={color.defalt} />
          <Text style={styles.headStyle}>Notification</Text>
        </View>
        <View style={[styles.settingButton, styles.notificationSetting]}>
          <Text style={styles.subTitle}>Notification</Text>
          {/* <Switch
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          /> */}
          <Switch
            color="#c07a50"
            value={isSwitchOn}
            onValueChange={toggleSwitch}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  accountContainer: {
    padding: getResponsiveSpacing(15, 18, 20),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: color.gry,
  },
  notificationHeader: {
    marginTop: getResponsiveSpacing(15, 18, 20),
  },
  settingsSection: {
    paddingHorizontal: getResponsiveSpacing(15, 18, 20),
    paddingVertical: getResponsiveSpacing(4, 5, 6),
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getResponsiveSpacing(15, 18, 20),
    paddingVertical: getResponsiveSpacing(8, 10, 12),
  },
  notificationSetting: {
    paddingHorizontal: getResponsiveSpacing(15, 18, 20),
    marginTop: 0,
  },
  headStyle: {
    fontSize: getResponsiveSize(18, 19, 20),
    fontWeight: '600',
    color: color.defalt,
    paddingLeft: getResponsiveSpacing(6, 8, 10),
  },
  subTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '500',
    color: color.drkGry,
  },
});
export default AccSetting;
