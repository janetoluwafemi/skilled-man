import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import InputEditProfile from '../../Components/InputEditProfile';
import { BASIC_URL } from '../Signin/Signin';

const EditUserProfile = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [profileImageVersion, setProfileImageVersion] = useState(0);
  const [load, setLoad] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const getAddressFromCoords = useCallback(async (lat, lon) => {
    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        { headers: { 'User-Agent': 'SkilledManApp' } }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.log('Geocoding Error:', error);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const getProfileData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const userId = global.id || userObj?.id || '255';

      const response = await fetch(`${BASIC_URL}user/get_profile.php?id=${userId}`, {
        method: 'GET',
      });
      const result = await response.json();

      if (result) {
        setName(result?.name || '');
        setEmail(result?.email || '');
        setPhone(result?.phone_number || '');
        setAddress(result?.address || '');
        if (result?.profile) setProfileImgUrl(result.profile);

        if (!global.lat && result?.latitude) {
          setLatitude(String(result?.latitude));
          setLongitude(String(result?.longitude || ''));
        }
      }

      return result;
    } catch (error) {
      console.log('Fetch error in EditUserProfile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getProfileData();
    }
  }, [focus, getProfileData]);

  useEffect(() => {
    if (focus && global.lat && global.long) {
      const latStr = parseFloat(global.lat).toFixed(6).toString();
      const longStr = parseFloat(global.long).toFixed(6).toString();

      setLatitude(latStr);
      setLongitude(longStr);
      getAddressFromCoords(latStr, longStr);
    }
  }, [focus, getAddressFromCoords]);

  const onGalry = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          showToast('Permission to access photos is required');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0]);
      }
    } catch (e) {
      console.log('Image picker error:', e);
    }
  };

  const handleUpdate = async () => {
    setLoad(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const userId = global.id || userObj?.id || '255';

      const profileFormData = new FormData();
      profileFormData.append('id', String(userId));
      profileFormData.append('name', name);
      profileFormData.append('email', email);
      profileFormData.append('phone_number', phone);
      profileFormData.append('address', address);
      profileFormData.append('latitude', latitude || '0');
      profileFormData.append('longitude', longitude || '0');

      if (image?.uri) {
        const mimeType = image.mimeType || 'image/jpeg';
        const extension = mimeType.split('/')[1]?.split(';')[0] || 'jpg';
        const fileName = `profile_${Date.now()}.${extension}`;

        if (Platform.OS === 'web') {
          const fileResponse = await fetch(image.uri);
          if (!fileResponse.ok) {
            throw new Error('Could not read the selected profile image');
          }
          const fileBlob = await fileResponse.blob();
          profileFormData.append('profile', fileBlob, fileName);
        } else {
          profileFormData.append('profile', {
            uri: image.uri,
            name: fileName,
            type: mimeType,
          });
        }
      }

      const response = await fetch(`${BASIC_URL}user/profile.php`, {
        method: 'POST',
        body: profileFormData,
      });

      if (!response.ok) {
        throw new Error(`Profile update failed with status ${response.status}`);
      }

      const result = await response.json();

      const updateSucceeded =
        Boolean(result?.success) ||
        result?.status === 'success' ||
        result?.status === true;

      if (updateSucceeded) {
        const updatedProfile = await getProfileData();
        const updatedImage = updatedProfile?.profile || result?.profile;
        const profileToStore = updatedProfile
          ? { ...updatedProfile, ...(updatedImage ? { profile: updatedImage } : {}) }
          : null;

        if (profileToStore) {
          await AsyncStorage.setItem('user', JSON.stringify(profileToStore));
          global.id = profileToStore.id || userId;
          global.name = profileToStore.name || '';
          global.email = profileToStore.email || '';
          global.phone_number = profileToStore.phone_number || '';
          global.address = profileToStore.address || '';
          global.lat = profileToStore.latitude || '';
          global.long = profileToStore.longitude || '';
          global.profile = updatedImage || '';
        }

        if (updatedImage) {
          setProfileImgUrl(updatedImage);
          setProfileImageVersion(Date.now());
        }

        showToast('Profile Updated Successfully');
        navigation.goBack();
      } else {
        showToast(result?.error || 'Update failed');
      }
    } catch (error) {
      console.log('Update Error:', error);
      showToast('Update failed. Check network connection.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={500} style={styles.formContainer}>

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  image?.uri
                    ? { uri: image.uri }
                    : profileImgUrl
                      ? {
                          uri: `${BASIC_URL}uploads/${profileImgUrl}?v=${profileImageVersion}`,
                        }
                      : require('../../Assets/Images/user.jpg')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity activeOpacity={0.85} onPress={onGalry} style={styles.cameraButton}>
                <Icons.Feather name="camera" color="#FFFFFF" size={14} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userNameHeader}>{name || 'User Profile'}</Text>
            <Text style={styles.userEmailHeader}>{email || 'Manage Account'}</Text>
          </View>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <InputEditProfile
                value={name}
                placeholder="Your full name"
                placeholderTextColor="#94A3B8"
                onChangeText={setName}
                icon="user"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <InputEditProfile
                value={email}
                placeholder="Email address"
                placeholderTextColor="#94A3B8"
                editable={false}
                icon="mail"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <InputEditProfile
                value={phone}
                placeholder="Phone number"
                placeholderTextColor="#94A3B8"
                onChangeText={setPhone}
                keyboardType="numeric"
                icon="phone"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Home / Delivery Address</Text>
              <View style={styles.relativeBox}>
                <InputEditProfile
                  value={address}
                  placeholder="Street address or landmark"
                  placeholderTextColor="#94A3B8"
                  onChangeText={setAddress}
                  icon="map-pin"
                  multiline={true}
                />
                {addressLoading && (
                  <ActivityIndicator
                    size="small"
                    color={color.defalt}
                    style={styles.addressLoader}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.mapBtnStyle}
              onPress={() => navigation.navigate('Maplatln')}>
              <Icons.Feather name="map-pin" size={16} color={color.defalt} style={{ marginRight: 8 }} />
              <Text style={styles.mapBtnText}>Pin Address from Map</Text>
            </TouchableOpacity>

            <BotonComp
              BtnStyle={styles.submitBtn}
              onPressFunc={handleUpdate}
              btnText={
                load ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  'Save Changes'
                )
              }
            />
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)' },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)' },
    }),
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: color.defalt,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
  },
  userNameHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    letterSpacing: -0.2,
  },
  userEmailHeader: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' },
    }),
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  relativeBox: {
    position: 'relative',
  },
  addressLoader: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  mapBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 4,
    marginBottom: 16,
    width: '100%',
  },
  mapBtnText: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 15,
    ...Platform.select({
      ios: {
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 14px rgba(186, 104, 56, 0.25)' },
    }),
  },
});
