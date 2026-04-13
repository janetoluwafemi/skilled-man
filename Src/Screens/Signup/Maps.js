// import React, {useEffect, useState, useRef} from 'react';
// import MapView from 'react-native-maps';
// import {
//   View,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Text,
//   Platform,
//   Alert,
//   Modal,
//   Button,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// // import {Marker} from 'react-native-svg';
// import {Marker} from 'react-native-maps';

// import {useNavigation} from '@react-navigation/native'; // Import useNavigation

// const Mapltln = () => {
//   // const [mlat, setmlat] = useState(0);
//   // const [mlong, setmlong] = useState(0);
//   const [mlat, setmlat] = useState(33.6844); // Islamabad
//   const [mlong, setmlong] = useState(73.0479);

//   const [initialLoad, setInitialLoad] = useState(true);
//   const [locationModalVisible, setLocationModalVisible] = useState(false);
//   const navigation = useNavigation(); // Initialize navigation

//   // useEffect(() => {
//   //   requestLocationPermission();
//   // }, []);

//   // const requestLocationPermission = async () => {
//   //   // ... (rest of your requestLocationPermission function remains the same)
//   // };

//   useEffect(() => {
//   requestLocationPermission();
// }, []);

// const requestLocationPermission = async () => {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//   );

//   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     getCurrentLocation(true);
//   }
// };

//   global.lat = mlat;
//   console.log('mlat (global)', global.lat);
//   global.long = mlong;
//   console.log('mlong (global)', global.long);

//   const getCurrentLocation = (isInitial = false) => {
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('Position:', position);
//         setmlat(position.coords.latitude);
//         setmlong(position.coords.longitude);
//         if (isInitial) {
//           setInitialLoad(false); // Mark initial load as complete
//         }
//       },
//       error => {
//         console.log('Error getting location:', error.code, error.message);
//         if (error.code === 2) {
//           Alert.alert(
//             'Location Services Disabled',
//             'Please enable location services in your device settings to allow the app to determine your current location.',
//           );
//         } else if (error.code === 3) {
//           // Location request timed out, show the modal
//           setLocationModalVisible(true);
//         } else {
//           // Handle other types of errors
//           Alert.alert(
//             'Location Error',
//             'Failed to get current location. Please try again later.',
//           );
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         // timeout: 20000,
//         timeout: 60000,
//         maximumAge: 0,
//       },
//     );
//   };

//   const handleOpenLocationSettings = () => {
//     setLocationModalVisible(false);
//     Alert.alert(
//       'Open Settings',
//       'Unfortunately, this app cannot directly open your location settings. Please open them manually.',
//     );
//     // navigation.navigate('YourLocationSettingsScreen'); // Placeholder
//   };

//   return (
//     <View style={{flex: 1}}>
//       <MapView
//         style={{width: '100%', height: '100%'}}
//         initialRegion={
//           initialLoad
//             ? {
//                 latitude: mlat, // Initial latitude (Islamabad)
//                 longitude: mlong, // Initial longitude (Islamabad)
//                 latitudeDelta: 0.0544443541,
//                 longitudeDelta: 0.03454355341,
//               }
//             : {
//                 latitude: mlat,
//                 longitude: mlong,
//                 latitudeDelta: 0.0544443541,
//                 longitudeDelta: 0.03454355341,
//               }
//         }
//         region={
//           !initialLoad
//             ? {
//                 // Update region dynamically after initial load
//                 latitude: mlat,
//                 longitude: mlong,
//                 latitudeDelta: 0.0544443541,
//                 longitudeDelta: 0.03454355341,
//               }
//             : undefined
//         }
//         zoomEnabled={true}
//         zoomControlEnabled={true}
//         showsUserLocation={true}>
//         <Marker coordinate={{latitude: mlat, longitude: mlong}} />
//       </MapView>

//       <TouchableOpacity
//         onPress={() => {
//           getCurrentLocation();
//         }}
//         style={styles.getLocationButton}>
//         <Text style={{color: 'white'}}>Get Current Location</Text>
//       </TouchableOpacity>

//       {/* <Modal
//         visible={locationModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setLocationModalVisible(false);
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Location Timeout</Text>
//             <Text style={styles.modalText}>
//               The app is taking longer than expected to determine your current
//               location. Please ensure that location services are enabled on your
//               device and that you have a clear view of the sky if possible. Tap "OK"
//               to try again.
//             </Text>
//             <View style={styles.modalButtons}>
//               <Button title="OK" onPress={handleOpenLocationSettings} />
//               <Button
//                 title="Cancel"
//                 onPress={() => setLocationModalVisible(false)}
//                 color="gray"
//               />
//             </View>
//           </View>
//         </View>
//       </Modal> */}
//     </View>
//   );
// };

// const styles = {
//   getLocationButton: {
//     width: '60%',
//     height: 50,
//     alignSelf: 'center',
//     position: 'absolute',
//     bottom: 20,
//     backgroundColor: 'orange',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
// };

// export default Mapltln;

// import React, {useEffect, useState, useRef} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Text,
//   Alert,
//   Platform,
// } from 'react-native';

// import MapView, {Marker} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

// const Mapltln = () => {
//   const mapRef = useRef(null);

//   const [location, setLocation] = useState({
//     latitude: 33.6844,
//     longitude: 73.0479,
//   });

//   // ✅ Request Permission + Fetch Location
//   useEffect(() => {
//     requestPermission();
//   }, []);

//   // ✅ Permission Function
//   const requestPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         getCurrentLocation();
//       } else {
//         Alert.alert('Permission Denied', 'Location permission is required.');
//       }
//     } else {
//       getCurrentLocation();
//     }
//   };

//   // ✅ Fetch Location Properly
//   const getCurrentLocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('✅ Location Found:', position.coords);

//         const newLoc = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         };

//         setLocation(newLoc);

//         // ✅ Save into global only AFTER success
//         global.lat = newLoc.latitude;
//         global.long = newLoc.longitude;

//         // ✅ Move Map Smoothly
//         mapRef.current?.animateToRegion(
//           {
//             ...newLoc,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           },
//           1000,
//         );
//       },
//       error => {
//         console.log('❌ Location Error:', error);

//         Alert.alert('Location Timeout', 'Please turn ON GPS and try again.');
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 40000,
//         maximumAge: 1000,
//       },
//     );
//   };

//   return (
//     <View style={{flex: 1}}>
//       {/* ✅ MAP */}
//       <MapView
//         ref={mapRef}
//         style={{flex: 1}}
//         initialRegion={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//         showsUserLocation={true}>
//         {/* ✅ Marker Always Visible */}
//         <Marker coordinate={location} />
//       </MapView>

//       {/* ✅ Button */}
//       <TouchableOpacity
//         onPress={getCurrentLocation}
//         style={{
//           position: 'absolute',
//           bottom: 30,
//           alignSelf: 'center',
//           backgroundColor: 'orange',
//           padding: 15,
//           borderRadius: 10,
//         }}>
//         <Text style={{color: 'white', fontWeight: 'bold'}}>
//           Get Current Location
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Mapltln;

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {useNavigation} from '@react-navigation/native';

const Mapltln = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [location, setLocation] = useState({
    latitude: 33.6844, // Default Islamabad
    longitude: 73.0479,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Request Permission on Mount
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    console.log('📌 Requesting Location Permission...');
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Location Permission Granted');
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission required');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    if (loading) return;

    console.log('📍 Fetching Current Location...');
    setLoading(true);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
    })
      .then(loc => {
        console.log('✅ Location Found:', loc);

        const newLoc = {
          latitude: loc.latitude,
          longitude: loc.longitude,
        };

        // ✅ Update State
        setLocation(newLoc);

        // ✅ Save Globally
        global.lat = newLoc.latitude;
        global.long = newLoc.longitude;
        console.log('🌍 Global Latitude:', global.lat);
        console.log('🌍 Global Longitude:', global.long);

        // ✅ Animate Map
        mapRef.current?.animateToRegion(
          {
            ...newLoc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      })
      .catch(err => {
        console.log('❌ Location Error:', err);
        Alert.alert(
          'Location Failed',
          err.message || 'Unable to fetch location',
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={{flex: 1}}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}>
        <Marker coordinate={location} />
      </MapView>

      {/* LAT/LONG DISPLAY */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>Location Obtained:</Text>
        <Text style={styles.locationText}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.locationText}>
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonsContainer}>
        {/* Get Location */}
        <TouchableOpacity
          onPress={getCurrentLocation}
          disabled={loading}
          style={[
            styles.button,
            {backgroundColor: loading ? 'gray' : 'orange'},
          ]}>
          {loading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{marginRight: 8}}
            />
          )}
          <Text style={styles.buttonText}>
            {loading ? 'Fetching...' : 'Get Current Location'}
          </Text>
        </TouchableOpacity>

        {/* Close Screen */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.button, {backgroundColor: 'red'}]}>
          <Text style={styles.buttonText}>Close Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  locationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Mapltln;
