import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import C_Dropdwn from '../../Components/C_Dropdown';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const AddBusiness = props => {
  const navigation = useNavigation();

  const [certificate, setCertificate] = useState(null);
  const [guarantor, setGuarantor] = useState(null);
  const [jobReferences, setJobReferences] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [selectedExperience, setSelectedExperience] = useState('year of experience');
  const [load, setLoad] = useState(false);
  const [items, setItems] = useState([]);

  const experienceOptions = [
    { id: 1, select_bussiness: 'year of experience' },
    { id: 2, select_bussiness: '0-1' },
    { id: 3, select_bussiness: '1-2' },
    { id: 4, select_bussiness: '2-3' },
    { id: 5, select_bussiness: '3-4' },
    { id: 6, select_bussiness: '4-5' },
    { id: 7, select_bussiness: '6-7' },
  ];

  const handleFilePick = async value => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        if (value === 'Guarantor') setGuarantor(pickedFile);
        if (value === 'Job References') setJobReferences(pickedFile);
        if (value === 'Certificates') setCertificate(pickedFile);
      }
    } catch (error) {
      console.log('File picker error:', error);
    }
  };

  const handleBusinessSelect = selectedValue => {
    setSelectedBusiness(selectedValue);
  };

  const handleExperienceSelect = selectedValue => {
    setSelectedExperience(selectedValue);
  };

  const addBusiness = async () => {
    if (
        selectedBusiness === 'Select Business' ||
        selectedExperience === 'year of experience' ||
        !certificate ||
        !guarantor ||
        !jobReferences
    ) {
      showToast('Please fill the required fields');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('select_bussiness', selectedBusiness);
      formdata.append('working_experience', selectedExperience);

      formdata.append('certificates', {
        uri: certificate.uri,
        name: certificate.name || 'certificate',
        type: certificate.mimeType || 'application/octet-stream',
      });

      formdata.append('job_references', {
        uri: jobReferences.uri,
        name: jobReferences.name || 'job_references',
        type: jobReferences.mimeType || 'application/octet-stream',
      });

      formdata.append('gurantor', {
        uri: guarantor.uri,
        name: guarantor.name || 'guarantor',
        type: guarantor.mimeType || 'application/octet-stream',
      });

      formdata.append('provider_id', global.id);

      const response = await fetch(`${BASIC_URL}add_business.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result?.status) {
        navigation.navigate('AddBank');
      } else if (result?.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      setLoad(false);
      Alert.alert('Error', 'Failed to add business. Please try again.');
    }
  };

  const getOverallServices = useCallback(async () => {
    try {
      const response = await fetch(`${BASIC_URL}get_services.php`, {
        method: 'POST',
      });
      const result = await response.json();
      if (result && result.add_skills) {
        setItems(result.add_skills);
      } else if (result?.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  }, []);

  useEffect(() => {
    getOverallServices();
  }, [getOverallServices]);

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
        </View>

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
          <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.formContainer}>

            <View style={styles.badgeRow}>
              <View style={styles.badgeCircle}>
                <Icons.Ionicons
                    name="briefcase-outline"
                    size={34}
                    color={color.defalt}
                />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Business Profile</Text>
            <Text style={styles.welcomeSubtitle}>
              Specify your trade expertise and upload the verification documents
            </Text>

            <View style={styles.cardWrapper}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Select Service / Category</Text>
                <C_Dropdwn
                    selectedValue={selectedBusiness}
                    options={items}
                    onValueChange={handleBusinessSelect}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Years of Experience</Text>
                <C_Dropdwn
                    selectedValue={selectedExperience}
                    options={experienceOptions}
                    onValueChange={handleExperienceSelect}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Professional Certificates</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleFilePick('Certificates')}>
                  <UploadfilwIcon
                      placeholder="Upload Certificates"
                      icon="upload"
                      title={certificate ? certificate.name : ''}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Job References</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleFilePick('Job References')}>
                  <UploadfilwIcon
                      placeholder="Upload Job References"
                      icon="upload"
                      title={jobReferences ? jobReferences.name : ''}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Guarantor Form / Document</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleFilePick('Guarantor')}>
                  <UploadfilwIcon
                      placeholder="Upload Guarantor Document"
                      icon="upload"
                      title={guarantor ? guarantor.name : ''}
                  />
                </TouchableOpacity>
              </View>

              <BotonComp
                  BtnStyle={styles.submitBtn}
                  btnText={
                    load ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        'Continue'
                    )
                  }
                  onPressFunc={addBusiness}
              />
            </View>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
  );
};

export default AddBusiness;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
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
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  submitBtn: {
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