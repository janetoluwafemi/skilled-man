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
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import { BASIC_URL } from '../Signin/Signin';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EdtUsrProfil = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [profileData, setProfileData] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
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

  const getProfilData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', global.id);
      const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();
      if (result) setProfileData(result);
    } catch (error) {
      console.log('Fetch error:', error);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getProfilData();
    }
  }, [focus, getProfilData]);

  useEffect(() => {
    if (profileData) {
      setPhone(profileData.phone_number || '');
      setAddress(profileData.address || '');
      setEmail(profileData.email || '');
      setName(profileData.name || '');
      if (profileData.latitude) {
        setLatitude(parseFloat(profileData.latitude).toFixed(6).toString());
      }
      if (profileData.longitude) {
        setLongitude(parseFloat(profileData.longitude).toFixed(6).toString());
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (focus) {
      if (global.lat && global.long) {
        const latStr = parseFloat(global.lat).toFixed(6).toString();
        const longStr = parseFloat(global.long).toFixed(6).toString();

        setLatitude(latStr);
        setLongitude(longStr);
        getAddressFromCoords(latStr, longStr);
      }
    }
  }, [focus, getAddressFromCoords]);

  const onGalry = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is needed to select photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Latitude and Longitude are required.');
      return;
    }
    setLoad(true);
    try {
      const profileFormData = new FormData();
      profileFormData.append('id', global.id);
      profileFormData.append('name', name);
      profileFormData.append('email', email);
      profileFormData.append('phone_number', phone);
      profileFormData.append('address', address);
      profileFormData.append('latitude', latitude);
      profileFormData.append('longitude', longitude);
      if (image) {
        profileFormData.append('profile', {
          uri: image.uri,
          name: image.fileName || 'profile.jpg',
          type: image.mimeType || 'image/jpeg',
        });
      }

      await fetch(`${BASIC_URL}user/profile.php`, {
        method: 'POST',
        body: profileFormData,
      });

      const otpFormData = new FormData();
      otpFormData.append('name', name);
      otpFormData.append('phone_number', phone);
      otpFormData.append('address', address);
      otpFormData.append('email', email);
      otpFormData.append('latitude', latitude);
      otpFormData.append('longitude', longitude);
      otpFormData.append('role', global.role || '0');
      otpFormData.append('account', 'Verified');

      await fetch(`${BASIC_URL}otp_register.php`, {
        method: 'POST',
        body: otpFormData,
      });

      setLoad(false);
      showToast('Profile Updated Successfully');
      navigation.navigate('DashBoard');
    } catch (error) {
      setLoad(false);
      showToast('Update failed');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CstmHeader
        title="Edit Profile"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={
                image
                  ? { uri: image.uri }
                  : profileData?.profile
                    ? { uri: `${BASIC_URL}uploads/${profileData.profile}` }
                    : require('../../Assets/Images/user.jpg')
              }
              style={styles.profileImage}
            />
            <TouchableOpacity onPress={onGalry} style={styles.cameraButton}>
              <Icons.FontAwesome name="camera" color={color.wite} size={18} />
            </TouchableOpacity>
          </View>

          <InputEdtProfil
            value={name}
            placeholder="Name"
            onChangeText={setName}
            icon="user"
          />
          <InputEdtProfil
            value={email}
            placeholder="Email"
            editable={false}
            icon="mail"
          />
          <InputEdtProfil
            value={phone}
            placeholder="Phone Number"
            onChangeText={setPhone}
            icon="phone"
          />

          <View style={styles.relativeBox}>
            <InputEdtProfil
              value={address}
              placeholder="Address"
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

          <BotonComp
            BtnStyle={styles.mapBtnStyle}
            onPressFunc={() => navigation.navigate('Maplatln')}
            btnText="Select Location from Map"
          />

          <BotonComp
            BtnStyle={styles.BtnStyle}
            onPressFunc={handleUpdate}
            btnText={
              load ? <ActivityIndicator color="#fff" /> : 'Update Profile'
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EdtUsrProfil;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: color.defalt,
    marginVertical: 15,
  },
  cameraButton: {
    position: 'absolute',
    backgroundColor: color.drkGry,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
    right: SCREEN_WIDTH * 0.35,
  },
  relativeBox: {
    position: 'relative',
  },
  mapBtnStyle: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'orange',
    borderWidth: 0,
  },
  BtnStyle: {
    width: '100%',
    marginTop: 25,
  },
  addressLoader: {
    position: 'absolute',
    right: 15,
    top: 22,
  },
});