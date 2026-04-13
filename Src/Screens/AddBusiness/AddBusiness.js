import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {Checkbox} from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import C_Dropdwn from '../../Components/C_Dropdown';
import InputWIcon from '../../Components/InputWithIcon';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';
import {configureLayoutAnimations} from 'react-native-reanimated/lib/typescript/reanimated2/core';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import { BASIC_URL } from '../Signin/Signin';
const AdBusines = props => {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [certficate, setCertficate] = React.useState();
  const [Guarantor, setGuarantor] = React.useState();
  const [jobReferences, setJobReferences] = React.useState();
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [load, setLoad] = React.useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState('year of experience');
  const [item, setItem] = useState([]);



  const ExperienceOption = [
    {
      id: 1,
      select_bussiness: 'year of experience',
      select_bussiness: 'year of experience',
    },
    {id: 2, select_bussiness: '0-1', select_bussiness: '0-1'},
    {id: 3, select_bussiness: '1-2', select_bussiness: '1-2'},
    {id: 4, select_bussiness: '2-3', select_bussiness: '2-3'},
    {id: 5, select_bussiness: '3-4', select_bussiness: '3-4'},
    {id: 6, select_bussiness: '4-5', select_bussiness: '4-5'},
    {id: 7, select_bussiness: '6-7', select_bussiness: '6-7'},
  ];
  const handlFilPick = async value => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('image picker result', result[0]);
      console.log('placeholdervalue', value);
      if (value === 'Guarantor') {
        setGuarantor(result[0]);
      }
      if (value == 'Job References') {
        setJobReferences(result[0]);
      }
      if (value == 'Certificates') {
        setCertficate(result[0]);
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
  console.log('certifcate value', certficate);
  const handleBusinessSelect = selectedValue => {
    // You can do something with the selected value here, like set it in the state or use it in an API call.
    // console.log("Selected Business:", selectedValue);
    setSelectedBusiness(selectedValue);
  };

  const handleExperienceSelect = selectedValue => {
    // You can do something with the selected value here, like set it in the state or use it in an API call.
    // console.log("Selected Experience:", selectedValue);
    setSelectedExperience(selectedValue);
  };

  const Adbusines = async () => {
    if (
      selectedBusiness == 'select_bussiness' ||
      selectedExperience == 'year of experience' ||
      !certficate ||
      !Guarantor ||
      !jobReferences
    ) {
      Toast.showWithGravity(
        'Please fill the required fields',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    try {
      setLoad(true);
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=3n5facq5fneebad7haff5r1j8l');

      var formdata = new FormData();
      formdata.append('select_bussiness', selectedBusiness);
      formdata.append('working_experience', selectedExperience);
      formdata.append('certificates', certficate);
      formdata.append('job_references', jobReferences);
      formdata.append('gurantor', Guarantor);
      formdata.append('provider_id', global.id);
      // console.log(https://fisdemoprojects.com/skilledman/api/uploads/${certficate})
      // console.log(https://fisdemoprojects.com/skilledman/api/uploads/${jobReferences})
      // console.log(https://fisdemoprojects.com/skilledman/api/uploads/${Guarantor})
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      const apiUrl =
        // 'https://fisdemoprojects.com/skilledman/api/add_business.php';
        `${BASIC_URL}add_business.php`

      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log('add busineess response', result);
      if (result.status) {
        setLoad(false);
        navigation.navigate('AddBank');
      } else if (result.error) {
        setLoad(false);
        Alert.alert(error);
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
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
        const apiurl =
          // 'https://fisdemoprojects.com/skilledman/api/get_services.php';
          `${BASIC_URL}get_services.php`

        const response = await fetch(apiurl, requestOptions);
        const result = await response.json();
        if (result && result.add_skills) {
          console.log('result', result.add_skills);
          setItem(result.add_skills);
        } else if (result.error) {
          Alert.alert(result.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOverall();
  }, []);

  return (
    <>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => {
            props.navigation.goBack();
          }}
          headerIcon={styles.headerIcon}
        />
        
        <View style={styles.container}>
          <Text style={styles.accountVer}>Add Business</Text>
          <View style={styles.dropdownContainer}>
            <C_Dropdwn
              selectedValue="Select Business"
              options={item}
              onValueChange={handleBusinessSelect}
            />
          </View>
          <View style={styles.dropdownContainer}>
            <C_Dropdwn
              selectedValue="Working Experience"
              options={ExperienceOption}
              onValueChange={handleExperienceSelect}
            />
          </View>
          <TouchableOpacity onPress={() => handlFilPick('Certificates')}>
            <View style={styles.inputContainer}>
              <UploadfilwIcon
                placeholder="Certificates"
                icon="upload"
                // handleFilePick={handleFilePick}
                title={certficate}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlFilPick('Job References')}>
            <View style={styles.inputContainer}>
              <UploadfilwIcon
                placeholder="Job References"
                icon="upload"
                // handleFilePick={handleFilePick}
                title={jobReferences}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlFilPick('Guarantor')}>
            <View style={styles.inputContainer}>
              <UploadfilwIcon
                placeholder="Guarantor"
                icon="upload"
                // handleFilePick={handleFilePick}
                title={Guarantor}
              />
            </View>
          </TouchableOpacity>
          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText={
              load ? <ActivityIndicator size={28} color="#f8f8ff" /> : 'Next'
            }
            onPressFunc={() => {
              Adbusines();
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default AdBusines;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.8,
  },

  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 25,
  },
  logoImg: {
    width: width / 2,
    height: height / 4.6,
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
    marginBottom: 8,
  },
  signinText: {
    fontSize: 16,
    fontWeight: '400',
    color: color.wite,
    textAlign: 'center',
    marginTop: 8,
  },
  BtnStyle: {
    marginTop: 25,
    width: '100%',
  },
  fieldRequired: {
    color: color.drkRd,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    fontWeight: '600',
  },
  checkboxStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 12,
  },
  rememberStyle: {
    fontSize: 17,
    fontWeight: '500',
    color: color.drkGry,
    lineHeight: 25,
  },
  termsStyle: {
    fontSize: 17,
    fontWeight: '500',
    color: color.defalt,
    flexWrap: 'wrap',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '85%',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  registerNow: {
    color: color.defalt,
    fontWeight: '500',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  haveAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '80%',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
