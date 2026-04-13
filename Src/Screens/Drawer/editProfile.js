import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import {Icons} from '../../Components/Icons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';
import {BASIC_URL} from '../Signin/Signin';
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const EdtProfilScren = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();

  // States
  const [profileData, setprofileData] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setemail] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // File States
  const [image, setImage] = useState(null);
  const [profileimg, setprofileimg] = useState(null);
  const [certficate, setCertficate] = useState(null);
  const [Guarantor, setGuarantor] = useState(null);
  const [Evidence, setEvidence] = useState(null);

  // UI States
  const [load, setLoad] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // 1. Fetch Address from Coordinates
  const getAddressFromCoords = async (lat, lon) => {
    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {headers: {'User-Agent': 'SkilledManApp'}},
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
  };

  // 2. CRITICAL FIX: Sync Map Data on Focus
  useEffect(() => {
    if (focus) {
      console.log(
        '🔄 Screen Focused - Checking Global Vars:',
        global.lat,
        global.long,
      );

      if (global.lat && global.long) {
        const latStr = String(global.lat);
        const longStr = String(global.long);

        setLatitude(latStr);
        setLongitude(longStr);

        // Auto-update address text based on map pin
        getAddressFromCoords(latStr, longStr);

        // Optional: clear to prevent re-syncing old data later
        // global.lat = null; global.long = null;
      }
    }
  }, [focus]);

  // 3. Initial Profile Data Fetch
  const GetProfileData = async () => {
    try {
      let formdata = new FormData();
      formdata.append('id', global.id);

      const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();
      console.log('User data in provider edit profile', result)

      if (result) {
        setprofileData(result);
        setName(result.name || '');
        setAddress(result.address || '');
        setemail(result.email || '');
        setPhone(result.phone_number || '');
        setExperience(result.working_experience || '');
        setprofileimg(result.profile);

        // Only set from DB if we don't have fresh map data
        if (!global.lat) {
          setLatitude(result.latitude ? String(result.latitude) : '');
          setLongitude(result.longitude ? String(result.longitude) : '');
        }
      }
    } catch (error) {
      console.log('GetProfileData Error:', error);
    }
  };

  useEffect(() => {
    GetProfileData();
    GetSkills();
  }, [global.id]);

  // 4. Update Profile with File Preservation
  // const UpdateProfile = async () => {
  //   setLoad(true);
  //   try {
  //     let formdata = new FormData();
  //     formdata.append('id', global.id);
  //     formdata.append('name', name);
  //     formdata.append('email', email);
  //     formdata.append('phone_number', phone);
  //     formdata.append('address', address);
  //     formdata.append('working_experience', experience);
  //     formdata.append('latitude', latitude);
  //     formdata.append('longitude', longitude);

  //     // Only append if user selected NEW files
  //     if (image)
  //       formdata.append('profile', {
  //         uri: image.uri,
  //         name: image.fileName || 'p.jpg',
  //         type: image.type || 'image/jpeg',
  //       });
  //     if (certficate)
  //       formdata.append('certificates', {
  //         uri: certficate.uri,
  //         name: certficate.name,
  //         type: certficate.type,
  //       });
  //     if (Evidence)
  //       formdata.append('job_references', {
  //         uri: Evidence.uri,
  //         name: Evidence.name,
  //         type: Evidence.type,
  //       });
  //     if (Guarantor)
  //       formdata.append('gurantor', {
  //         uri: Guarantor.uri,
  //         name: Guarantor.name,
  //         type: Guarantor.type,
  //       });

  //     const response = await fetch(`${BASIC_URL}provider_profile.php`, {
  //       method: 'POST',
  //       body: formdata,
  //     });
  //     const result = await response.json();

  //     if (result) {
  //       Toast.show('Profile Updated Successfully');
  //       // Clear local file states so they show "Attached" from DB
  //       setImage(null);
  //       setCertficate(null);
  //       setEvidence(null);
  //       setGuarantor(null);
  //       GetProfileData();
  //     }
  //   } catch (error) {
  //     Toast.show('Update failed');
  //   } finally {
  //     setLoad(false);
  //   }
  // };
  const UpdateProfile = async () => {
    setLoad(true);
    try {
      let formdata = new FormData();

      // 1. Always send basic info
      formdata.append('id', global.id);
      formdata.append('name', name);
      formdata.append('email', email);
      formdata.append('phone_number', phone);
      formdata.append('address', address);
      formdata.append('working_experience', experience);

      // Ensure lat/long are sent as strings
      formdata.append('latitude', String(latitude));
      formdata.append('longitude', String(longitude));

      // 2. ONLY append files if the user selected a NEW one
      // If image is null, we don't append 'profile' at all.
      // This prevents the backend from seeing an empty 'profile' key.
      if (image && image.uri) {
        formdata.append('profile', {
          uri: image.uri,
          name: image.fileName || 'profile.jpg',
          type: image.type || 'image/jpeg',
        });
      }

      if (certficate && certficate.uri) {
        formdata.append('certificates', {
          uri: certficate.uri,
          name: certficate.name,
          type: certficate.type,
        });
      }

      if (Evidence && Evidence.uri) {
        formdata.append('job_references', {
          uri: Evidence.uri,
          name: Evidence.name,
          type: Evidence.type,
        });
      }

      if (Guarantor && Guarantor.uri) {
        formdata.append('gurantor', {
          uri: Guarantor.uri,
          name: Guarantor.name,
          type: Guarantor.type,
        });
      }

      console.log('Sending FormData:', formdata);

      const response = await fetch(`${BASIC_URL}provider_profile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      });

      const textResponse = await response.text(); // Get raw text first to debug
      console.log('Raw Server Response:', textResponse);

      const result = JSON.parse(textResponse);

      if (result) {
        Toast.show('Profile Updated Successfully');
        // Clear local selection states
        setImage(null);
        setCertficate(null);
        setEvidence(null);
        setGuarantor(null);
        // Re-fetch data from server to show everything is still there
        GetProfileData();
      }
    } catch (error) {
      console.log('Update Error:', error);
      Toast.show('Update failed');
    } finally {
      setLoad(false);
    }
  };

  const GetSkills = async () => {
    try {
      const response = await fetch(
        `https://theskilledman.com/api/get_skills.php?user_id=${global.id}`,
        {method: 'POST'},
      );
      const result = await response.json();
      if (result?.business) {
        setSkills(
          Object.values(result.business).filter(
            i => i.select_bussiness && i.select_bussiness !== 'Select Business',
          ),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <CstmHeader
        title="Edit Profile"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{padding: 20}}>
          <View style={{alignItems: 'center', marginBottom: 15}}>
            <Image
              source={
                image
                  ? {uri: image.uri}
                  : profileimg
                  ? {uri: `${BASIC_URL}uploads/${profileimg}`}
                  : require('../../Assets/Images/user.jpg')
              }
              style={styles.profileImgStyle}
            />
            <TouchableOpacity
              onPress={() =>
                launchImageLibrary(
                  {mediaType: 'photo'},
                  r => r.assets && setImage(r.assets[0]),
                )
              }
              style={styles.cameraIcon}>
              <Icons.FontAwesome name="camera" color={color.wite} size={20} />
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
          <View style={{position: 'relative'}}>
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

          {/* Coordinate Fields - High Visibility Style */}
          {/* <View style={styles.coordsRow}>
            <View style={styles.coordInputWrap}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.fixedInputStyle}
                value={String(latitude)}
                editable={false}
              />
            </View>
            <View style={styles.coordInputWrap}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.fixedInputStyle}
                value={String(longitude)}
                editable={false}
              />
            </View>
          </View> */}
{/* Coordinate Fields - High Visibility Style */}
{/* <View style={styles.coordsRow}>
  <View style={styles.coordInputWrap}>
    <Text style={styles.label}>Latitude</Text>
    <TextInput
      key={`lat-${latitude}`} // Forces re-render when latitude changes
      style={styles.fixedInputStyle}
      value={latitude ? String(latitude) : ''}
      editable={false}
    />
  </View>
  <View style={styles.coordInputWrap}>
    <Text style={styles.label}>Longitude</Text>
    <TextInput
      key={`lng-${longitude}`} // Forces re-render when longitude changes
      style={styles.fixedInputStyle}
      value={longitude ? String(longitude) : ''}
      editable={false}
    />
  </View>
</View> */}


          <BotonComp
            BtnStyle={{
              backgroundColor: 'orange',
              marginVertical: 20,
              borderWidth: 0,
              width: '100%',
            }}
            onPressFunc={() => navigation.navigate('Maplatln')}
            btnText="Select Location from Map"
          />

          <View style={styles.certContainer}>
            <TouchableOpacity
              onPress={async () => {
                const res = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                });
                setCertficate(res[0]);
              }}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {certficate
                  ? certficate.name
                  : profileData?.certificates
                  ? 'Cert. Attached'
                  : 'Certificate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const res = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                });
                setEvidence(res[0]);
              }}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {Evidence
                  ? Evidence.name
                  : profileData?.job_references
                  ? 'Evid. Attached'
                  : 'Evidence'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const res = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                });
                setGuarantor(res[0]);
              }}>
              <Icons.FontAwesome5
                name="file-upload"
                size={35}
                color={color.defalt}
                style={styles.iconCont}
              />
              <Text style={styles.certiStyle}>
                {Guarantor
                  ? Guarantor.name
                  : profileData?.gurantor
                  ? 'Gua. Attached'
                  : 'Guarantor'}
              </Text>
            </TouchableOpacity>
          </View>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            onPressFunc={UpdateProfile}
            btnText={
              load ? (
                <ActivityIndicator size={28} color="#fff" />
              ) : (
                'Save changes'
              )
            }
          />
        </View>

        <TouchableOpacity
          style={styles.addSkill}
          onPress={() => navigation.navigate('AddSkill')}>
          <Icons.FontAwesome
            name="plus-square"
            size={35}
            style={styles.plusCont}
          />
          <Text style={styles.addMore}>Add More Skill</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  BtnStyle: {width: '100%', elevation: 1, marginTop: 20},
  certContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  iconCont: {alignSelf: 'center'},
  certiStyle: {
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 5,
    width: 85,
  },
  addSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  plusCont: {color: color.defalt, marginRight: 5},
  addMore: {fontWeight: '700', color: color.defalt, fontSize: 15},
  profileImgStyle: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: color.defalt,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: color.drkGry,
    borderRadius: 50,
    padding: 8,
    right: '35%',
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  coordInputWrap: {width: '48%'},
  label: {
    fontSize: 12,
    color: color.defalt,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  fixedInputStyle: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    color: color.defalt,
    // fontSize: 14,
    // fontWeight: 'bold',
  },
  addressLoader: {position: 'absolute', right: 10, top: 15},
  fixedInputStyle: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    color: '#000000', // CHANGE THIS TO BLACK so you can see the text
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EdtProfilScren;

// import {Picker} from '@react-native-picker/picker';
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   ToastAndroid,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Modal,
// } from 'react-native';
// import color from '../../Assets/colors/colors';
// import CstmHeader from '../../Components/CustomHeader';
// import Icon, {Icons} from '../../Components/Icons';
// import {useNavigation} from '@react-navigation/native';

// import {launchImageLibrary} from 'react-native-image-picker';
// import InputWIcon from '../../Components/InputWithIcon';
// import BotonComp from '../../Components/BtnComp';
// import InputEdtProfil from '../../Components/InputEditProfile';
// import DocumentPicker from 'react-native-document-picker';
// import {Alert} from 'native-base';
// import Toast from 'react-native-simple-toast';
// import {BASIC_URL} from '../Signin/Signin';
// const EdtProfilScren = props => {
//   const navigation = useNavigation();
//   const [profileData, setprofileData] = useState(null);
//   //console.log(profileData,'profiel')
//   const [phone, setPhone] = useState(null);
//   const [address, setAddress] = useState(null);
//   const [email, setemail] = useState(null);
//   const [name, setName] = useState(null);
//   const [experience, setExperience] = useState(null);
//   const [image, setImage] = useState('');
//   const [profileimg, setprofileimg] = useState(null);
//   const [certficate, setCertficate] = React.useState();
//   const [Guarantor, setGuarantor] = React.useState();
//   const [Evidence, setEvidence] = React.useState();
//   const [load, setLoad] = React.useState(false);
//   const [skills, setSkills] = useState([]);
//   const [selectedSkill, setSelectedSkill] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     if (profileData) {
//       setPhone(profileData.phone_number);
//       setAddress(profileData.address);
//       setemail(profileData.email);
//       setName(profileData.name);
//       setExperience(profileData.working_experience);
//       setprofileimg(profileData.profile);
//       // console.log(profileData.profile, '1234')
//     }
//   }, [profileData]);
//   // pick profile image
//   const onGallery = async () => {
//     const options = {
//       title: 'Select Image',
//       type: 'library',
//       options: {
//         maxHeight: 200,
//         maxWidth: 200,
//         selectionLimit: 1,
//         mediaType: 'photo',
//         includeBase64: false,
//       },
//     };
//     const result = await launchImageLibrary(options);
//     console.log(result);

//     if (result.didCancel) {
//       if (Platform.OS === 'android') {
//         ToastAndroid.show('You cancel the Gallery', ToastAndroid.SHORT);
//       } else {
//         alert('You cancel the Gallery');
//       }
//     } else if (result.error) {
//       console.log('ImagePicker Error: ', response.error);
//     } else if (result.customButton) {
//       console.log('User tapped custom button: ', response.customButton);
//     } else {
//       setImage(result.assets[0], 'gallery');
//     }
//   };

//   console.log('experience', experience);
//   //pick pdf file
//   const handleFilePick = async value => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });
//       console.log('image picker result', result[0]);
//       console.log('placeholdervalue', value);
//       if (value === 'Guarantor') {
//         setGuarantor(result[0]);
//       }
//       if (value == 'Evidence') {
//         setEvidence(result[0]);
//       }
//       if (value == 'Certificate') {
//         setCertficate(result[0]);
//       }
//     } catch (error) {
//       if (DocumentPicker.isCancel(error)) {
//         // User canceled the document picker
//       } else {
//         console.log('error occur on document picking', error);
//         throw error; // Throw the correct error
//       }
//     }
//   };

//   const GetSkills = async () => {
//     try {
//       const formdata = new FormData();
//       formdata.append('user_id', global.id);

//       const response = await fetch(
//         `https://theskilledman.com/api/get_skills.php?user_id=${global.id}`,
//         {
//           method: 'POST',
//           body: formdata,
//         },
//       );

//       const result = await response.json();
//       console.log('User Skills:', result);

//       if (result?.business) {
//         const skillsArray = Object.values(result.business);

//         // remove "Select Business" entries
//         const filteredSkills = skillsArray.filter(
//           item =>
//             item.select_bussiness &&
//             item.select_bussiness !== 'Select Business',
//         );

//         setSkills(filteredSkills);
//       }
//     } catch (error) {
//       console.log('Skill error:', error);
//     }
//   };

//   const UpdateProfile = async () => {
//     try {
//       setLoad(true);
//       var myHeaders = new Headers();
//       myHeaders.append('Cookie', 'PHPSESSID=hegqceptc45e26k91tjptfbolg');
//       var formdata = new FormData();
//       formdata.append('id', global.id);
//       formdata.append('name', name);
//       formdata.append('email', email);
//       formdata.append('phone_number', phone);
//       formdata.append('address', address);
//       formdata.append('working_experience', experience);
//       formdata.append('certificates', certficate);
//       formdata.append('job_references', Evidence);
//       formdata.append('gurantor', Guarantor);
//       {
//         image
//           ? formdata.append('profile', {
//               uri: image.uri,
//               name: image.fileName,
//               type: image.type,
//             })
//           : null;
//       }

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: formdata,
//         redirect: 'follow',
//       };

//       // const apiurl ='https://fisdemoprojects.com/skilledman/api/provider_profile.php';
//       const apiurl = `${BASIC_URL}provider_profile.php`;

//       const response = await fetch(apiurl, requestOptions);
//       const result = await response.json();
//       console.log('Provider profile updated result', result);
//       if (result) {
//         setLoad(false);
//         global.address = result.address;
//         global.name = result.name;
//         global.phone_number = result.phone_number;
//         Toast.show('Profile Updated..');
//         // navigation.navigate('DashBoard');
//       }
//     } catch (error) {
//       setLoad(false);
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     GetProfileData();
//     GetSkills();
//   }, [global.id]);
//   const GetProfileData = async () => {
//     try {
//       var myHeaders = new Headers();
//       myHeaders.append('Cookie', 'PHPSESSID=nehf3e2dgdauiaooraluprccv7');

//       var formdata = new FormData();
//       formdata.append('id', global.id);

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: formdata,
//         redirect: 'follow',
//       };

//       // fetch(
//       //   'https://fisdemoprojects.com/skilledman/api/user/get_profile.php',
//       //   requestOptions,
//       // )
//       fetch(`${BASIC_URL}user/get_profile.php`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           console.log('Complete profile Data', result);

//           if (result) {
//             setprofileData(result);
//           }
//         })
//         .catch(error => console.log('error', error));
//     } catch (error) {
//       Alert.alert(error);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <CstmHeader
//         title="Edit Profile"
//         onPressBack={() => {
//           props.navigation.goBack();
//         }}
//       />
//       <ScrollView>
//         <View style={{padding: 20}}>
//           <View style={{alignItems: 'center', marginBottom: 15}}>
//             {image ? (
//               <Image
//                 source={{uri: image.uri}}
//                 style={{
//                   width: 100,
//                   height: 100,
//                   alignSelf: 'center',
//                   marginVertical: 20,
//                   borderRadius: 50,
//                   borderWidth: 4,
//                   borderColor: color.defalt,
//                 }}
//               />
//             ) : profileimg && profileimg.profile !== null ? (
//               <Image
//                 source={{
//                   // uri: `https://fisdemoprojects.com/skilledman/api/uploads/${profileData?.profile}`,
//                   uri: `${BASIC_URL}uploads/${profileData?.profile}`,
//                 }}
//                 style={{
//                   width: 100,
//                   height: 100,
//                   alignSelf: 'center',
//                   marginVertical: 20,
//                   borderRadius: 50,
//                   borderWidth: 4,
//                   borderColor: color.defalt,
//                 }}
//               />
//             ) : (
//               <Image
//                 source={require('../../Assets/Images/user.jpg')}
//                 style={{
//                   width: 100,
//                   height: 100,
//                   alignSelf: 'center',
//                   marginVertical: 20,
//                   borderRadius: 50,
//                   borderWidth: 4,
//                   borderColor: color.defalt,
//                 }}
//               />
//             )}

//             <TouchableOpacity
//               onPress={onGallery}
//               style={{
//                 position: 'absolute',
//                 bottom: 15,
//                 backgroundColor: color.drkGry,
//                 borderRadius: 50,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: 8,
//                 right: '35%',
//               }}>
//               <Icons.FontAwesome name="camera" color={color.wite} size={20} />
//             </TouchableOpacity>
//           </View>
//           <InputEdtProfil
//             style={{color: color.gry}}
//             value={name}
//             placeholder="Name"
//             placeholderTextColor={color.gry}
//             onChangeText={val => setName(val)}
//             icon="user"
//           />
//           <InputEdtProfil
//             style={{color: color.gry}}
//             // value={address}
//             value={address}
//             placeholder="Address"
//             placeholderTextColor={color.gry}
//             onChangeText={val => setAddress(val)}
//             icon="map-pin"
//           />
//           <InputEdtProfil
//             style={{color: color.gry}}
//             value={email}
//             placeholder="Email"
//             placeholderTextColor={color.gry}
//             icon="mail"
//           />
//           <InputEdtProfil
//             style={{color: color.gry}}
//             value={phone}
//             placeholder="Phone Number"
//             placeholderTextColor={color.gry}
//             onChangeText={val => setPhone(val)}
//             icon="phone"
//           />
//           <InputEdtProfil
//             style={{color: color.gry}}
//             value={experience}
//             placeholder="Experience"
//             placeholderTextColor={color.gry}
//             onChangeText={val => setExperience(val)}
//             icon="star"
//           />
//           <View style={styles.certContainer}>
//             <TouchableOpacity onPress={() => handleFilePick('Certificate')}>
//               <Icons.FontAwesome5
//                 name="file-upload"
//                 size={35}
//                 color={color.defalt}
//                 style={styles.iconCont}
//               />
//               <Text style={[styles.certiStyle, {color: 'black'}]}>
//                 {certficate ? certficate?.name : 'Certificate'}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleFilePick('Evidence')}>
//               <Icons.FontAwesome5
//                 name="file-upload"
//                 size={35}
//                 color={color.defalt}
//                 style={styles.iconCont}
//               />
//               <Text style={[styles.certiStyle, {color: 'black'}]}>
//                 {Evidence ? Evidence?.name : 'Evidence'}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleFilePick('Guarantor')}>
//               <Icons.FontAwesome5
//                 name="file-upload"
//                 size={35}
//                 color={color.defalt}
//                 style={styles.iconCont}
//               />
//               <Text style={[styles.certiStyle, {color: 'black'}]}>
//                 {Guarantor ? Guarantor?.name : 'Guarantor'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <BotonComp
//             BtnStyle={styles.BtnStyle}
//             onPressFunc={() => UpdateProfile()}
//             btnText={
//               load ? (
//                 <ActivityIndicator size={28} color="#f8f8ff" />
//               ) : (
//                 'Save changes'
//               )
//             }
//           />
//         </View>

//         {/* Skills Row */}
//         {skills.length > 0 && (
//           <Text
//             style={[
//               styles.certiStyle,
//               {color: 'black', paddingHorizontal: 20, marginVertical: 20},
//             ]}>
//             All Skills:
//           </Text>
//         )}
//         {skills.length > 0 && (
//           <View
//             style={{
//               flexDirection: 'row',
//               flexWrap: 'wrap',
//               paddingHorizontal: 20,
//               marginBottom: 15,
//             }}>
//             {skills.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   setSelectedSkill(item);
//                   setModalVisible(true);
//                 }}
//                 style={{
//                   backgroundColor: color.defalt,
//                   paddingHorizontal: 12,
//                   paddingVertical: 6,
//                   borderRadius: 20,
//                   marginRight: 8,
//                   marginBottom: 8,
//                 }}>
//                 <Text style={{color: 'white', fontWeight: '600'}}>
//                   {item.select_bussiness}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Skills Horizontal List */}
//         {/* {skills.length > 0 && (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{paddingHorizontal: 20, marginBottom: 15}}>
//             {skills.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   setSelectedSkill(item);
//                   setModalVisible(true);
//                 }}
//                 style={{
//                   backgroundColor: '#fff',
//                   padding: 10,
//                   borderRadius: 10,
//                   marginRight: 12,
//                   alignItems: 'center',
//                   elevation: 2,
//                   width: 120,
//                 }}>
//                 {item.certificates ? (
//                   <Image
//                     source={{
//                       uri: `${BASIC_URL}uploads/${item.certificates}`,
//                     }}
//                     style={{
//                       width: 60,
//                       height: 60,
//                       borderRadius: 8,
//                       marginBottom: 6,
//                     }}
//                   />
//                 ) : (
//                   <View
//                     style={{
//                       width: 60,
//                       height: 60,
//                       backgroundColor: '#eee',
//                       borderRadius: 8,
//                       marginBottom: 6,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Text style={{fontSize: 10}}>No Image</Text>
//                   </View>
//                 )}

//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: 13,
//                     color: color.defalt,
//                   }}>
//                   {item.select_bussiness}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )} */}

//         <TouchableOpacity
//           style={styles.addSkill}
//           onPress={() => navigation.navigate('AddSkill')}>
//           <Icons.FontAwesome
//             name="plus-square"
//             size={35}
//             color={color.defalt}
//             style={styles.plusCont}
//           />
//           <Text style={styles.addMore}>Add More Skill</Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={styles.addSkill}
//           onPress={() => navigation.navigate('AddSkill')}>
//           <Icons.FontAwesome
//             name="plus-square"
//             size={35}
//             color={color.defalt}
//             style={styles.plusCont}
//           />
//           <Text style={styles.addMore}>Add More Skill</Text>
//         </TouchableOpacity> */}
//       </ScrollView>
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: '85%',
//               backgroundColor: '#fff',
//               borderRadius: 15,
//               padding: 20,
//             }}>
//             {selectedSkill && (
//               <>
//                 <Text
//                   style={{
//                     fontSize: 18,
//                     fontWeight: '700',
//                     color: color.defalt,
//                     marginBottom: 10,
//                   }}>
//                   {selectedSkill.select_bussiness}
//                 </Text>

//                 <Text style={{marginBottom: 10, color: '#000'}}>
//                   Experience: {selectedSkill.working_experience} years
//                 </Text>

//                 {selectedSkill.certificates && (
//                   <Image
//                     source={{
//                       uri: `${BASIC_URL}uploads/${selectedSkill.certificates}`,
//                     }}
//                     style={{
//                       width: '100%',
//                       height: 180,
//                       borderRadius: 10,
//                       marginBottom: 15,
//                     }}
//                     resizeMode="cover"
//                   />
//                 )}

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{
//                     backgroundColor: color.defalt,
//                     padding: 10,
//                     borderRadius: 8,
//                     alignItems: 'center',
//                   }}>
//                   <Text style={{color: '#fff', fontWeight: '600'}}>Close</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   Register_Text: {
//     marginTop: 20,
//     color: color.wite,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   loginBtn: {
//     borderRadius: 5,
//     backgroundColor: color.drkgren,
//     textAlign: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     width: '70%',
//     paddingVertical: 12,
//     marginTop: 35,
//   },
//   btnText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: '800',
//   },
//   BtnStyle: {
//     width: '100%',
//     elevation: 1,
//   },
//   certContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     paddingVertical: 10,
//   },
//   iconCont: {
//     alignSelf: 'center',
//     alignContent: 'center',
//     textAlign: 'center',
//   },
//   certiStyle: {
//     fontWeight: '600',
//   },
//   addSkill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom:"6%",
//   },
//   plusCont: {
//     color: color.defalt,
//     marginRight: 5,
//   },
//   addMore: {
//     fontWeight: '700',
//     color: color.defalt,
//     fontSize: 15,
//   },
// });

// export default EdtProfilScren;
