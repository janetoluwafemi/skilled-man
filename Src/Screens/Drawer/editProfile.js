import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import { BASIC_URL } from '../Signin/Signin';

const EdtProfilScren = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();

  const [profileData, setProfileData] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [image, setImage] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [guarantor, setGuarantor] = useState(null);
  const [evidence, setEvidence] = useState(null);

  const [load, setLoad] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

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
      let formdata = new FormData();
      formdata.append('id', global.id);

      const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();

      if (result) {
        setProfileData(result);
        setName(result.name || '');
        setAddress(result.address || '');
        setEmail(result.email || '');
        setPhone(result.phone_number || '');
        setExperience(result.working_experience || '');
        setProfileImg(result.profile);

        if (!global.lat) {
          setLatitude(result.latitude ? String(result.latitude) : '');
          setLongitude(result.longitude ? String(result.longitude) : '');
        }
      }
    } catch (error) {
      console.log('GetProfileData Error:', error);
    }
  }, []);

  const getSkills = useCallback(async () => {
    try {
      const response = await fetch(
        `https://theskilledman.com/api/get_skills.php?user_id=${global.id}`,
        { method: 'POST' }
      );
      const result = await response.json();
      if (result?.business) {
        setSkills(
          Object.values(result.business).filter(
            i => i.select_bussiness && i.select_bussiness !== 'Select Business'
          )
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      if (global.lat && global.long) {
        const latStr = String(global.lat);
        const longStr = String(global.long);

        setLatitude(latStr);
        setLongitude(longStr);
        getAddressFromCoords(latStr, longStr);
      }
    }
  }, [focus, getAddressFromCoords]);

  useEffect(() => {
    getProfileData();
    getSkills();
  }, [getProfileData, getSkills]);

  // Ã¢Å“â€¦ FIX: Expo Image Picker Handler
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Image picking error:', error);
    }
  };

  // Ã¢Å“â€¦ FIX: Expo Document Picker Helper
  const pickDocument = async setFileState => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setFileState(res.assets[0]);
      }
    } catch (err) {
      console.log('Document picker error:', err);
    }
  };

  const updateProfile = async () => {
    setLoad(true);
    try {
      let formdata = new FormData();

      formdata.append('id', global.id);
      formdata.append('name', name);
      formdata.append('email', email);
      formdata.append('phone_number', phone);
      formdata.append('address', address);
      formdata.append('working_experience', experience);
      formdata.append('latitude', String(latitude));
      formdata.append('longitude', String(longitude));

      if (image && image.uri) {
        formdata.append('profile', {
          uri: image.uri,
          name: image.fileName || image.name || 'profile.jpg',
          type: image.mimeType || image.type || 'image/jpeg',
        });
      }

      if (certificate && certificate.uri) {
        formdata.append('certificates', {
          uri: certificate.uri,
          name: certificate.name || 'certificate',
          type: certificate.mimeType || certificate.type || 'application/octet-stream',
        });
      }

      if (evidence && evidence.uri) {
        formdata.append('job_references', {
          uri: evidence.uri,
          name: evidence.name || 'evidence',
          type: evidence.mimeType || evidence.type || 'application/octet-stream',
        });
      }

      if (guarantor && guarantor.uri) {
        formdata.append('gurantor', {
          uri: guarantor.uri,
          name: guarantor.name || 'guarantor',
          type: guarantor.mimeType || guarantor.type || 'application/octet-stream',
        });
      }

      const response = await fetch(`${BASIC_URL}provider_profile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      });

      const textResponse = await response.text();
      const result = JSON.parse(textResponse);

      if (result) {
        showToast('Profile Updated Successfully');
        setImage(null);
        setCertificate(null);
        setEvidence(null);
        setGuarantor(null);
        getProfileData();
      }
    } catch (error) {
      console.log('Update Error:', error);
      showToast('Update failed');
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Edit Profile"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                image
                  ? { uri: image.uri }
                  : profileImg
                    ? { uri: `${BASIC_URL}uploads/${profileImg}` }
                    : require('../../Assets/Images/user.jpg')
              }
              style={styles.profileImgStyle}
            />
            <TouchableOpacity onPress={pickImage} style={styles.cameraIcon}>
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
          <InputEdtProfil
            value={experience}
            placeholder="Experience"
            onChangeText={setExperience}
            icon="star"
          />
          <View style={styles.relativeBox}>
            <InputEdtProfil
              value={address}
              placeholder="Address"
              onChangeText={setAddress}
              multiline={true}
              icon="map-pin"
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
            BtnStyle={styles.mapBtn}
            onPressFunc={() => navigation.navigate('Maplatln')}
            btnText="Select Location from Map"
          />

          <View style={styles.certContainer}>
            <TouchableOpacity onPress={() => pickDocument(setCertificate)}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {certificate
                  ? certificate.name
                  : profileData?.certificates
                    ? 'Cert. Attached'
                    : 'Certificate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => pickDocument(setEvidence)}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {evidence
                  ? evidence.name
                  : profileData?.job_references
                    ? 'Evid. Attached'
                    : 'Evidence'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => pickDocument(setGuarantor)}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {guarantor
                  ? guarantor.name
                  : profileData?.gurantor
                    ? 'Gua. Attached'
                    : 'Guarantor'}
              </Text>
            </TouchableOpacity>
          </View>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            onPressFunc={updateProfile}
            btnText={
              load ? (
                <ActivityIndicator size={24} color="#fff" />
              ) : (
                'Save changes'
              )
            }
          />
        </View>

        {skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsHeading}>All Skills:</Text>
            <View style={styles.skillsRow}>
              {skills.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedSkill(item);
                    setModalVisible(true);
                  }}
                  style={styles.skillPill}>
                  <Text style={styles.skillPillText}>
                    {item.select_bussiness}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.addSkill}
          onPress={() => navigation.navigate('AddSkill')}>
          <Icons.FontAwesome
            name="plus-square"
            size={32}
            color={color.defalt}
            style={styles.plusCont}
          />
          <Text style={styles.addMore}>Add More Skill</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSkill && (
              <>
                <Text style={styles.skillTitle}>
                  {selectedSkill.select_bussiness}
                </Text>

                <Text style={styles.skillExp}>
                  Experience: {selectedSkill.working_experience} years
                </Text>

                {selectedSkill.certificates ? (
                  <Image
                    source={{
                      uri: `${BASIC_URL}uploads/${selectedSkill.certificates}`,
                    }}
                    style={styles.certImg}
                    resizeMode="cover"
                  />
                ) : null}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EdtProfilScren;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  profileImgStyle: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: color.defalt,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: color.drkGry,
    borderRadius: 50,
    padding: 8,
  },
  relativeBox: {
    position: 'relative',
  },
  addressLoader: {
    position: 'absolute',
    right: 15,
    top: 22,
  },
  mapBtn: {
    backgroundColor: 'orange',
    marginVertical: 15,
    borderWidth: 0,
    width: '100%',
  },
  BtnStyle: {
    width: '100%',
    elevation: 1,
    marginTop: 20,
  },
  certContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCont: {
    alignSelf: 'center',
  },
  certiStyle: {
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 5,
    width: 85,
  },
  skillsSection: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  skillsHeading: {
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillPill: {
    backgroundColor: color.defalt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillPillText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  addSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  plusCont: {
    marginRight: 8,
  },
  addMore: {
    fontWeight: '700',
    color: color.defalt,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 10,
  },
  skillExp: {
    marginBottom: 10,
    color: '#000',
  },
  certImg: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalCloseBtn: {
    backgroundColor: color.defalt,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
});