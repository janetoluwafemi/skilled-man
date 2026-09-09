import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Animatable from 'react-native-animatable';
import {showToast} from '../../utilis/showToast';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import { BASIC_URL } from '../Signin/Signin';

const EditProfileScreen = props => {
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
        setPhone(result?.phone_number || '');
        setExperience(result?.working_experience || '');
        setProfileImg(result?.profile);

        if (!global.lat) {
          setLatitude(result?.latitude ? String(result?.latitude) : '');
          setLongitude(result?.longitude ? String(result?.longitude) : '');
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600}>

          <View style={styles.cardWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                source={
                  image
                    ? { uri: image?.uri }
                    : profileImg
                      ? { uri: `${BASIC_URL}uploads/${profileImg}` }
                      : require('../../Assets/Images/user.jpg')
                }
                style={styles.profileImgStyle}
              />
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.cameraIcon}>
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
              <Text style={styles.fieldLabel}>Working Experience (Years)</Text>
              <InputEdtProfil
                value={experience}
                placeholder="Experience"
                placeholderTextColor="#94A3B8"
                onChangeText={setExperience}
                keyboardType="numeric"
                icon="star"
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
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mapBtn}
              onPress={() => navigation.navigate('Maplatln')}>
              <Icons.Feather name="map" size={16} color={color.defalt} style={{ marginRight: 8 }} />
              <Text style={styles.mapBtnText}>Select Location from Map</Text>
            </TouchableOpacity>

            <Text style={[styles.fieldLabel, { marginTop: 10, marginBottom: 8 }]}>
              Verification Documents
            </Text>
            <View style={styles.certContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.docUploadCard}
                onPress={() => pickDocument(setCertificate)}>
                <View style={styles.docIconCircle}>
                  <Icons.Feather
                    name="file-text"
                    size={22}
                    color={color.defalt}
                  />
                </View>
                <Text style={styles.certiStyle} numberOfLines={2}>
                  {certificate
                    ? certificate.name
                    : profileData?.certificates
                      ? 'Cert. Attached'
                      : 'Certificate'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.docUploadCard}
                onPress={() => pickDocument(setEvidence)}>
                <View style={styles.docIconCircle}>
                  <Icons.Feather
                    name="award"
                    size={22}
                    color={color.defalt}
                  />
                </View>
                <Text style={styles.certiStyle} numberOfLines={2}>
                  {evidence
                    ? evidence.name
                    : profileData?.job_references
                      ? 'Evid. Attached'
                      : 'Job Evidence'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.docUploadCard}
                onPress={() => pickDocument(setGuarantor)}>
                <View style={styles.docIconCircle}>
                  <Icons.Feather
                    name="shield"
                    size={22}
                    color={color.defalt}
                  />
                </View>
                <Text style={styles.certiStyle} numberOfLines={2}>
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
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  'Save Changes'
                )
              }
            />
          </View>

          {skills.length > 0 && (
            <View style={styles.cardWrapper}>
              <Text style={styles.skillsHeading}>Registered Skills</Text>
              <View style={styles.skillsRow}>
                {skills.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedSkill(item);
                      setModalVisible(true);
                    }}
                    style={styles.skillPill}>
                    <Icons.Feather
                      name="check-circle"
                      size={13}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.skillPillText}>
                      {item.select_bussiness}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addSkillBtn}
            onPress={() => navigation.navigate('AddSkill')}>
            <Icons.Feather
              name="plus-circle"
              size={18}
              color={color.defalt}
              style={styles.plusCont}
            />
            <Text style={styles.addMore}>Add More Skills</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSkill && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.skillTitle}>
                    {selectedSkill.select_bussiness}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icons.Ionicons name="close-circle" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.skillExp}>
                  Experience: {selectedSkill?.working_experience} Years
                </Text>

                {selectedSkill?.certificates ? (
                  <Image
                    source={{
                      uri: `${BASIC_URL}uploads/${selectedSkill?.certificates}`,
                    }}
                    style={styles.certImg}
                    resizeMode="cover"
                  />
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.8}
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

export default EditProfileScreen;

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
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
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    alignSelf: 'center',
  },
  profileImgStyle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  cameraIcon: {
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
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 8,
  },
  mapBtnText: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
  },
  certContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  docUploadCard: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  docIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  certiStyle: {
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
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
  skillsHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.defalt,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillPillText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  addSkillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  plusCont: {
    marginRight: 8,
  },
  addMore: {
    fontWeight: '700',
    color: color.defalt,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  skillExp: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  certImg: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 14,
  },
  modalCloseBtn: {
    backgroundColor: color.defalt,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
