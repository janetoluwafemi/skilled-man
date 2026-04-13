import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  useColorScheme,
  ALert,
  ActivityIndicator,
} from 'react-native';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import Icon, {Icons} from '../../Components/Icons';
import {useNavigation} from '@react-navigation/native';

import {launchImageLibrary} from 'react-native-image-picker';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import C_TxtInput from '../../Components/C_TextInput';
import DocumentPicker from 'react-native-document-picker';
import C_SkilInput from '../../Components/C_SkillInput';
import C_Dropdwn from '../../Components/C_Dropdown';
import Toast from 'react-native-simple-toast';
import { BASIC_URL } from '../Signin/Signin';

const AdSkil = props => {
  const navigation = useNavigation();
  const [NumberofEXp, setNumberExp] = useState('');
  const [phonenumb, setPhoneNumb] = useState('');
  const [file, setFile] = useState('');
  const [item, setItem] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [load, setLoad] = React.useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('File picker result', result[0]);
      if (result) {
        setFile(result[0]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User canceled the document picker
      } else {
        console.log('error occur on document picking', error);
        throw error; // Throw the correct error
      }
    }
  };

  const handleBusinessSelect = selectedValue => {
    // You can do something with the selected value here, like set it in the state or use it in an API call.
    // console.log("Selected Business:", selectedValue);
    setSelectedBusiness(selectedValue);
  };

  const savSkil = async () => {
    if (NumberofEXp == '' || phonenumb == '') {
      Toast.show('please fill required field', Toast.LONG);
      return;
    }
    try {
      setLoad(true);
      var formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('service_name', selectedBusiness);
      formdata.append('number_of_exp', NumberofEXp);
      formdata.append('phone', phonenumb);
      {
        file ? formdata.append('image', file) : null;
      }

      // const apiUrl ='https://fisdemoprojects.com/skilledman/api/add_skills.php';
      const apiUrl =`${BASIC_URL}add_skills.php`;

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log('Add skill Result', result);
      if (result.status) {
        setLoad(false);
        Toast.show(result.status, Toast.LONG);
        console.log('add skills', result.status);
        // navigation.navigate('DashBoard');
      } else if (result.error) {
        setLoad(false);
        ALert.alert(error);
      }
    } catch (error) {
      setLoad(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    const getOverall = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append('Cookie', 'PHPSESSID=0g4vvcrd3mg6h7pr1q0c26ns09');

        var urlencoded = new URLSearchParams();

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };
        // const apiurl ='https://fisdemoprojects.com/skilledman/api/get_services.php';
        const apiurl =`${BASIC_URL}get_services.php`;

        const response = await fetch(apiurl, requestOptions);
        const result = await response.json();
        if (result && result.add_skills) {
          console.log('result add skill', result.add_skills);
          setItem(result.add_skills);
        } else if (result.error) {
          ALert.alert(result.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOverall();
  }, []);
  return (
    <View style={{flex: 1}}>
      <CstmHeader
        title="Add Skill"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={{padding: 20}}>
          <C_Dropdwn
            selectedValue="Select Business"
            options={item}
            onValueChange={handleBusinessSelect}
          />
          <C_SkilInput
            style={{color: color.gry}}
            // value={NumberofEXp}
            placeholder="Number of Experience"
            placeholderTextColor={color.gry}
            onChangeText={text => setNumberExp(text)}
            keyboardType={'numeric'}
          />

          <C_SkilInput
            style={{color: color.gry}}
            // value={phonenumb}
            placeholder="Phone Number"
            placeholderTextColor={color.gry}
            onChangeText={text => setPhoneNumb(text)}
            keyboardType={'numeric'}
          />
          <TouchableOpacity style={styles.addSkill} onPress={handleFilePick}>
            <Icons.Feather
              name="paperclip"
              size={25}
              color={color.defalt}
              style={styles.plusCont}
            />
            <Text style={styles.addMore}>
              {file ? file?.name : 'Choose File'}
            </Text>
            {/* <Text style={[styles.addMore,
            { color: 'red', marginLeft: 2 }]}>{JSON.stringify(file)}</Text> */}
          </TouchableOpacity>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            onPressFunc={() => {
              savSkil();
            }}
            btnText={
              load ? <ActivityIndicator size={28} color="#f8f8ff" /> : 'Save'
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Register_Text: {
    marginTop: 20,
    color: color.wite,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginBtn: {
    borderRadius: 5,
    backgroundColor: color.drkgren,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '70%',
    paddingVertical: 12,
    marginTop: 35,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  BtnStyle: {
    width: '100%',
    elevation: 1,
  },
  addSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  plusCont: {
    color: color.defalt,
    marginRight: 5,
  },
  addMore: {
    fontWeight: '700',
    color: color.gry,
    fontSize: 15,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
});

export default AdSkil;
