import React, {useState, useEffect} from 'react';
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
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import {Icons} from '../../Components/Icons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import BotonComp from '../../Components/BtnComp';
import InputEdtProfil from '../../Components/InputEditProfile';
import Toast from 'react-native-simple-toast';
import {BASIC_URL} from '../Signin/Signin';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const EdtUsrProfil = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [profileData, setprofileData] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setemail] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [profileimg, setprofileimg] = useState(null);
  const [image, setImage] = useState('');
  const [load, setLoad] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // 1. Get Address Text from Coordinates
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

  // 2. Initial Data Load from API
  const GetProfilData = async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', global.id);
      const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();
      console.log('Profile info Get api in Edit user profile', result);
      if (result) setprofileData(result);
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  useEffect(() => {
    GetProfilData();
  }, [focus]);

  // 3. Set values when profileData changes
  useEffect(() => {
    if (profileData) {
      setPhone(profileData.phone_number || '');
      setAddress(profileData.address || '');
      setemail(profileData.email || '');
      setName(profileData.name || '');
      if (profileData.latitude)
        setLatitude(parseFloat(profileData.latitude).toFixed(6).toString());
      if (profileData.longitude)
        setLongitude(parseFloat(profileData.longitude).toFixed(6).toString());
    }
  }, [profileData]);

  // 4. THE FIX: Sync from Maps Global Variables
  useEffect(() => {
    if (focus) {
      // Use logical check for existence
      if (global.lat && global.long) {
        console.log(
          'Syncing to Profile Screen -> Lat:',
          global.lat,
          'Long:',
          global.long,
        );

        const latStr = parseFloat(global.lat).toFixed(6).toString();
        const longStr = parseFloat(global.long).toFixed(6).toString();

        setLatitude(latStr);
        setLongitude(longStr);

        // Update the address field based on new coordinates
        getAddressFromCoords(latStr, longStr);

        // Optional: Clear globals so it doesn't re-sync unless map is opened again
        // global.lat = null;
        // global.long = null;
      }
    }
  }, [focus, global.lat, global.long]);

  const onGalry = async () => {
    const options = {mediaType: 'photo', includeBase64: false};
    const result = await launchImageLibrary(options);
    if (result.assets) setImage(result.assets[0]);
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
          name: image.fileName,
          type: image.type,
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
      Toast.show('Profile Updated Successfully');
      navigation.navigate('DashBoard');
    } catch (error) {
      setLoad(false);
      Toast.show('Update failed');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['top']}>
      <CstmHeader
        title="Edit Profile"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 20},
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={
                image
                  ? {uri: image.uri}
                  : profileData?.profile
                  ? {uri: `${BASIC_URL}uploads/${profileData.profile}`}
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

          <View style={{position: 'relative'}}>
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

          {/* Coordinate Section - FIXED VISIBILITY */}
          {/* <View style={styles.coordsRow}>
            <View style={styles.coordInputWrap}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.fixedInputStyle}
                value={latitude}
                placeholder="Latitude"
                placeholderTextColor="#999"
                editable={false}
              />
            </View>
            <View style={styles.coordInputWrap}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.fixedInputStyle}
                value={longitude}
                placeholder="Longitude"
                placeholderTextColor="#999"
                editable={false}
              />
            </View>
          </View> */}

          <BotonComp
            BtnStyle={[
              styles.BtnStyle,
              {backgroundColor: 'orange', marginTop: 20, borderWidth: 0},
            ]}
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

const styles = StyleSheet.create({
  scrollView: {flex: 1},
  scrollContent: {flexGrow: 1},
  container: {padding: 20},
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
  BtnStyle: {width: '100%', marginTop: 25},
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: color.defalt,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  coordInputWrap: {width: '48%'},
  fixedInputStyle: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    height: 50,
    borderWidth: 1,
    borderColor: color.defalt,
    paddingHorizontal: 12,
    color: '#000', // Forced black text
    fontSize: 14,
  },
  addressLoader: {position: 'absolute', right: 15, top: 22},
});

export default EdtUsrProfil;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
//   TextInput,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import color from '../../Assets/colors/colors';
// import CstmHeader from '../../Components/CustomHeader';
// import {Icons} from '../../Components/Icons';
// import {useNavigation, useIsFocused} from '@react-navigation/native';
// import {launchImageLibrary} from 'react-native-image-picker';
// import BotonComp from '../../Components/BtnComp';
// import InputEdtProfil from '../../Components/InputEditProfile';
// import Toast from 'react-native-simple-toast';
// import {BASIC_URL} from '../Signin/Signin';

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// const EdtUsrProfil = props => {
//   const navigation = useNavigation();
//   const focus = useIsFocused();
//   const insets = useSafeAreaInsets();

//   const [profileData, setprofileData] = useState(null);
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [email, setemail] = useState('');
//   const [name, setName] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [profileimg, setprofileimg] = useState(null);
//   const [image, setImage] = useState('');
//   const [load, setLoad] = useState(false);
//   const [addressLoading, setAddressLoading] = useState(false);

//   // --- Reverse Geocoding Function ---
//   const getAddressFromCoords = async (lat, lon) => {
//     setAddressLoading(true);
//     try {
//       // Using OpenStreetMap's Nominatim API (Free)
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
//         {
//           headers: {
//             'User-Agent': 'SkilledManApp', // Nominatim requires a User-Agent
//           },
//         },
//       );
//       const data = await response.json();
//       if (data && data.display_name) {
//         setAddress(data.display_name);
//       }
//     } catch (error) {
//       console.log('Reverse Geocoding Error:', error);
//     } finally {
//       setAddressLoading(false);
//     }
//   };

//   // 1. Load initial data from API
//   useEffect(() => {
//     if (profileData) {
//       setPhone(profileData.phone_number || '');
//       setAddress(profileData.address || '');
//       setemail(profileData.email || '');
//       setName(profileData.name || '');
//       setprofileimg(profileData.profile);

//       if (profileData.latitude) {
//         setLatitude(parseFloat(profileData.latitude).toFixed(6));
//       }
//       if (profileData.longitude) {
//         setLongitude(parseFloat(profileData.longitude).toFixed(6));
//       }
//     }
//   }, [profileData]);

//   // 2. Sync from Map AND trigger Address lookup
//   useEffect(() => {
//     if (focus) {
//       if (global.lat && global.long) {
//         const latStr = parseFloat(global.lat).toFixed(6);
//         const longStr = parseFloat(global.long).toFixed(6);

//         setLatitude(latStr);
//         setLongitude(longStr);

//         // Trigger address fetch based on new global values
//         getAddressFromCoords(latStr, longStr);
//       }
//     }
//   }, [focus]);

//   const onGalry = async () => {
//     const options = {mediaType: 'photo', includeBase64: false};
//     const result = await launchImageLibrary(options);
//     if (result.assets) setImage(result.assets[0]);
//   };

//   const handleUpdate = async () => {
//     if (!latitude || !longitude) {
//       Alert.alert('Error', 'Latitude and Longitude are required.');
//       return;
//     }

//     setLoad(true);
//     try {
//       const profileFormData = new FormData();
//       profileFormData.append('id', global.id);
//       profileFormData.append('name', name);
//       profileFormData.append('email', email);
//       profileFormData.append('phone_number', phone);
//       profileFormData.append('address', address);
//       profileFormData.append('latitude', latitude);
//       profileFormData.append('longitude', longitude);
//       if (image) {
//         profileFormData.append('profile', {
//           uri: image.uri,
//           name: image.fileName,
//           type: image.type,
//         });
//       }

//       const profResponse = await fetch(`${BASIC_URL}user/profile.php`, {
//         method: 'POST',
//         body: profileFormData,
//       });

//       const otpFormData = new FormData();
//       otpFormData.append('name', name);
//       otpFormData.append('phone_number', phone);
//       otpFormData.append('address', address);
//       otpFormData.append('email', email);
//       otpFormData.append('latitude', latitude);
//       otpFormData.append('longitude', longitude);
//       otpFormData.append('role', global.role || '0');
//       otpFormData.append('account', 'Verified');

//       await fetch(`${BASIC_URL}otp_register.php`, {
//         method: 'POST',
//         body: otpFormData,
//       });

//       const profResult = await profResponse.json();

//       if (profResult) {
//         setLoad(false);
//         Toast.show('Profile and Location Updated Successfully');
//         global.name = profResult.name;
//         navigation.navigate('DashBoard');
//       }
//     } catch (error) {
//       setLoad(false);
//       console.log('Update error:', error);
//       Toast.show('Update failed');
//     }
//   };

//   const GetProfilData = async () => {
//     try {
//       const formdata = new FormData();
//       formdata.append('id', global.id);
//       const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
//         method: 'POST',
//         body: formdata,
//       });
//       const result = await response.json();
//       if (result) setprofileData(result);
//     } catch (error) {
//       console.log('Fetch error:', error);
//     }
//   };

//   useEffect(() => {
//     GetProfilData();
//   }, [focus]);

//   return (
//     <SafeAreaView style={{flex: 1}} edges={['top']}>
//       <CstmHeader
//         title="Edit Profile"
//         onPressBack={() => navigation.goBack()}
//       />
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={[
//           styles.scrollContent,
//           {paddingBottom: insets.bottom + 20},
//         ]}
//         keyboardShouldPersistTaps="handled">
//         <View style={styles.container}>
//           <View style={styles.imageContainer}>
//             <Image
//               source={
//                 image
//                   ? {uri: image.uri}
//                   : profileData?.profile
//                   ? {uri: `${BASIC_URL}uploads/${profileData.profile}`}
//                   : require('../../Assets/Images/user.jpg')
//               }
//               style={styles.profileImage}
//             />
//             <TouchableOpacity onPress={onGalry} style={styles.cameraButton}>
//               <Icons.FontAwesome name="camera" color={color.wite} size={18} />
//             </TouchableOpacity>
//           </View>

//           <InputEdtProfil
//             value={name}
//             placeholder="Name"
//             onChangeText={setName}
//             icon="user"
//           />
//           <InputEdtProfil
//             value={email}
//             placeholder="Email"
//             editable={false}
//             icon="mail"
//           />
//           <InputEdtProfil
//             value={phone}
//             placeholder="Phone Number"
//             onChangeText={setPhone}
//             icon="phone"
//           />

//           {/* Address field with Loading Indicator for Geocoding */}
//           <View style={{position: 'relative'}}>
//             <InputEdtProfil
//               value={address}
//               placeholder="Address"
//               onChangeText={setAddress}
//               icon="map-pin"
//               multiline={true}
//             />
//             {addressLoading && (
//               <ActivityIndicator
//                 size="small"
//                 color={color.defalt}
//                 style={{position: 'absolute', right: 10, top: 20}}
//               />
//             )}
//           </View>

//           {/* Coordinate Section */}
//           <View style={styles.coordsRow}>
//             <View style={styles.coordInputWrap}>
//               <TextInput
//                 style={styles.coordInput}
//                 value={latitude}
//                 placeholder="Latitude"
//                 onChangeText={val => setLatitude(val)}
//                 keyboardType="numeric"
//               />
//             </View>
//             <View style={styles.coordInputWrap}>
//               <TextInput
//                 style={styles.coordInput}
//                 value={longitude}
//                 placeholder="Longitude"
//                 onChangeText={val => setLongitude(val)}
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>

//           <BotonComp
//             BtnStyle={[
//               styles.BtnStyle,
//               {backgroundColor: 'orange', marginTop: 10},
//             ]}
//             onPressFunc={() => navigation.navigate('Maplatln')}
//             btnText="Get Location from Map"
//           />

//           <BotonComp
//             BtnStyle={styles.BtnStyle}
//             onPressFunc={handleUpdate}
//             btnText={
//               load ? <ActivityIndicator color="#fff" /> : 'Update Profile'
//             }
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {flex: 1},
//   scrollContent: {flexGrow: 1},
//   container: {padding: 20},
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 15,
//     position: 'relative',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: color.defalt,
//     marginVertical: 15,
//   },
//   cameraButton: {
//     position: 'absolute',
//     backgroundColor: color.drkGry,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     bottom: 15,
//     right: SCREEN_WIDTH * 0.35,
//   },
//   BtnStyle: {width: '100%', marginTop: 25},
//   coordsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 5,
//   },
//   coordInputWrap: {width: '48%'},
//   coordInput: {
//     backgroundColor: 'transparent',
//     borderRadius: 6,
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: color.defalt,
//     paddingHorizontal: 10,
//     color: color.defalt,
//   },
// });

// export default EdtUsrProfil;
