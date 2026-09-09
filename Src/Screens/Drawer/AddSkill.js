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
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as Animatable from 'react-native-animatable';
import {showToast} from '../../utilis/showToast';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import C_SkilInput from '../../Components/C_SkillInput';
import C_Dropdwn from '../../Components/C_Dropdown';
import { BASIC_URL } from '../Signin/Signin';

const AddSkill = props => {
  const navigation = useNavigation();
  const [numberOfExp, setNumberOfExp] = useState('');
  const [phoneNumb, setPhoneNumb] = useState('');
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [load, setLoad] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  const handleBusinessSelect = selectedValue => {
    setSelectedBusiness(selectedValue);
  };

  const saveSkill = async () => {
    if (!numberOfExp || !phoneNumb) {
      showToast('Please fill required fields');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('service_name', selectedBusiness);
      formdata.append('number_of_exp', numberOfExp);
      formdata.append('phone', phoneNumb);

      if (file) {
        formdata.append('image', {
          uri: file.uri,
          name: file.name || 'file',
          type: file.type || 'application/octet-stream',
        });
      }

      const response = await fetch(`${BASIC_URL}add_skills.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result.status) {
        showToast(result.status);
        navigation.goBack();
      } else if (result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      setLoad(false);
      Alert.alert('Error', 'Failed to save skill. Please try again.');
    }
  };

  const getServices = useCallback(async () => {
    try {
      const response = await fetch(`${BASIC_URL}get_services.php`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result?.add_skills) {
        setItems(result.add_skills);
      } else if (result?.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  }, []);

  useEffect(() => {
    getServices();
  }, [getServices]);

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
          <Text style={styles.headerTitle}>Add Skill</Text>
          <View style={{ width: 40 }} />
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
                <Icons.Feather
                    name="tool"
                    size={34}
                    color={color.defalt}
                />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Add New Skill</Text>
            <Text style={styles.welcomeSubtitle}>
              Add a service capability to your profile to receive more client jobs
            </Text>

            <View style={styles.cardWrapper}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Select Service / Trade</Text>
                <C_Dropdwn
                    selectedValue={selectedBusiness}
                    options={items}
                    onValueChange={handleBusinessSelect}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Years of Experience</Text>
                <C_SkilInput
                    value={numberOfExp}
                    placeholder="e.g. 3"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setNumberOfExp}
                    keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Direct Phone Number</Text>
                <C_SkilInput
                    value={phoneNumb}
                    placeholder="e.g. 08012345678"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setPhoneNumb}
                    keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Skill Certificate / Evidence</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.uploadBtn}
                    onPress={handleFilePick}>
                  <Icons.Feather
                      name="paperclip"
                      size={20}
                      color={color.defalt}
                      style={styles.plusCont}
                  />
                  <Text style={styles.addMore} numberOfLines={1}>
                    {file ? file.name : 'Choose Document / Photo'}
                  </Text>
                </TouchableOpacity>
              </View>

              <BotonComp
                  BtnStyle={styles.btnStyle}
                  onPressFunc={saveSkill}
                  btnText={
                    load ? <ActivityIndicator size="small" color="#FFFFFF" /> : 'Save Skill'
                  }
              />
            </View>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
  );
};

export default AddSkill;

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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  plusCont: {
    marginRight: 10,
  },
  addMore: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 14,
    flex: 1,
  },
  btnStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
