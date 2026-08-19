import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import { BASIC_URL } from '../Signin/Signin';

const EditUserProfile = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
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

      // GET endpoint matching Postman documentation
      const response = await fetch(`${BASIC_URL}user/get_profile.php?id=${userId}`, {
        method: 'GET',
      });
      const result = await response.json();

      if (result) {
        setName(result.name || '');
        setEmail(result.email || '');
        setPhone(result.phone_number || '');
        setAddress(result.address || '');
        if (result.profile) setProfileImgUrl(result.profile);

        if (!global.lat && result.latitude) {
          setLatitude(String(result.latitude));
          setLongitude(String(result.longitude || ''));
        }
      }
    } catch (error) {
      console.log('Fetch error in EditUserProfile:', error);
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

      if (image && image.uri) {
        profileFormData.append('profile', {
          uri: image.uri,
          name: image.fileName || 'profile.jpg',
          type: image.mimeType || 'image/jpeg',
        });
      }

      const response = await fetch(`${BASIC_URL}user/profile.php`, {
        method: 'POST',
        body: profileFormData,
      });

      const result = await response.json();

      if (result && (result.success || !result.error)) {
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
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.cardWrapper}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  image?.uri
                    ? { uri: image.uri }
                    : profileImgUrl
                      ? { uri: `${BASIC_URL}uploads/${profileImgUrl}` }
                      : require('../../Assets/Images/user.jpg')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity activeOpacity={0.8} onPress={onGalry} style={styles.cameraButton}>
                <Icons.Feather name="camera" color="#FFFFFF" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <InputEdtProfil
                value={name}
                placeholder="Name"
                placeholderTextColor="#94A3B8"
                onChangeText={setName}
                icon="user"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <InputEdtProfil
                value={email}
                placeholder="Email"
                placeholderTextColor="#94A3B8"
                editable={false}
                icon="mail"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <InputEdtProfil
                value={phone}
                placeholder="Phone Number"
                placeholderTextColor="#94A3B8"
                onChangeText={setPhone}
                keyboardType="numeric"
                icon="phone"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Address</Text>
              <View style={styles.relativeBox}>
                <InputEdtProfil
                  value={address}
                  placeholder="Address"
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
              activeOpacity={0.8}
              style={styles.mapBtnStyle}
              onPress={() => navigation.navigate('Maplatln')}>
              <Icons.Feather name="map" size={16} color={color.defalt} style={{ marginRight: 8 }} />
              <Text style={styles.mapBtnText}>Select Location from Map</Text>
            </TouchableOpacity>

            <BotonComp
              BtnStyle={styles.BtnStyle}
              onPressFunc={handleUpdate}
              btnText={
                load ? <ActivityIndicator color="#fff" size="small" /> : 'Update Profile'
              }
            />
          </View>
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    alignSelf: 'center',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: color.defalt,
    borderRadius: 18,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  fieldGroup: {
    marginBottom: 12,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  relativeBox: {
    position: 'relative',
  },
  addressLoader: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  mapBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 8,
    width: '100%',
  },
  mapBtnText: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
  },
  BtnStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 12,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});