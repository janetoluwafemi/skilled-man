import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import C_SkilInput from '../../Components/C_SkillInput';
import C_Dropdwn from '../../Components/C_Dropdown';
import { BASIC_URL } from '../Signin/Signin';

const AdSkil = props => {
  const navigation = useNavigation();
  const [numberOfExp, setNumberOfExp] = useState('');
  const [phoneNumb, setPhoneNumb] = useState('');
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [load, setLoad] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (result && result[0]) {
        setFile(result[0]);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('Error selecting file:', error);
      }
    }
  };

  const handleBusinessSelect = selectedValue => {
    setSelectedBusiness(selectedValue);
  };

  const saveSkill = async () => {
    if (!numberOfExp || !phoneNumb) {
      Toast.show('Please fill required fields', Toast.LONG);
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
        Toast.show(result.status, Toast.LONG);
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
      <CstmHeader
        title="Add Skill"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <C_Dropdwn
            selectedValue={selectedBusiness}
            options={items}
            onValueChange={handleBusinessSelect}
          />

          <C_SkilInput
            style={styles.inputText}
            value={numberOfExp}
            placeholder="Years of Experience"
            placeholderTextColor={color.gry}
            onChangeText={setNumberOfExp}
            keyboardType="numeric"
          />

          <C_SkilInput
            style={styles.inputText}
            value={phoneNumb}
            placeholder="Phone Number"
            placeholderTextColor={color.gry}
            onChangeText={setPhoneNumb}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.addSkill} onPress={handleFilePick}>
            <Icons.Feather
              name="paperclip"
              size={25}
              color={color.defalt}
              style={styles.plusCont}
            />
            <Text style={styles.addMore}>
              {file ? file.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <BotonComp
            BtnStyle={styles.btnStyle}
            onPressFunc={saveSkill}
            btnText={
              load ? <ActivityIndicator size={24} color="#f8f8ff" /> : 'Save'
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdSkil;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  inputText: {
    color: color.gry,
  },
  btnStyle: {
    width: '100%',
    elevation: 1,
    marginTop: 20,
  },
  addSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  plusCont: {
    color: color.defalt,
    marginRight: 8,
  },
  addMore: {
    fontWeight: '700',
    color: color.gry,
    fontSize: 15,
  },
});