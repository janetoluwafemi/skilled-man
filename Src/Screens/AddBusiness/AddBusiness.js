import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import C_Dropdwn from '../../Components/C_Dropdown';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import { BASIC_URL } from '../Signin/Signin';

const { width, height } = Dimensions.get('window');

const AdBusines = props => {
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

  // ✅ FIX: Updated to Expo DocumentPicker API
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
      Toast.showWithGravity(
        'Please fill the required fields',
        Toast.LONG,
        Toast.CENTER
      );
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('select_bussiness', selectedBusiness);
      formdata.append('working_experience', selectedExperience);

      // ✅ FIX: Expo DocumentPicker uses mimeType instead of type
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
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIcon={styles.headerIcon}
        />

        <View style={styles.container}>
          <Text style={styles.accountVer}>Add Business</Text>

          <View style={styles.dropdownContainer}>
            <C_Dropdwn
              selectedValue={selectedBusiness}
              options={items}
              onValueChange={handleBusinessSelect}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <C_Dropdwn
              selectedValue={selectedExperience}
              options={experienceOptions}
              onValueChange={handleExperienceSelect}
            />
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => handleFilePick('Certificates')}>
            <UploadfilwIcon
              placeholder="Certificates"
              icon="upload"
              title={certificate ? certificate.name : ''}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => handleFilePick('Job References')}>
            <UploadfilwIcon
              placeholder="Job References"
              icon="upload"
              title={jobReferences ? jobReferences.name : ''}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => handleFilePick('Guarantor')}>
            <UploadfilwIcon
              placeholder="Guarantor"
              icon="upload"
              title={guarantor ? guarantor.name : ''}
            />
          </TouchableOpacity>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText={
              load ? <ActivityIndicator size="small" color="#f8f8ff" /> : 'Next'
            }
            onPressFunc={addBusiness}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AdBusines;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.85,
  },
  headerIcon: {
    paddingLeft: 20,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  BtnStyle: {
    marginTop: 20,
    width: '100%',
  },
});