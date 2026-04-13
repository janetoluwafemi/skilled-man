import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const GoglMap = () => {
  const [mlat, setmlat] = useState(0);
  const [mlong, setmlong] = useState(0);
  const [currentlocation, setCurrentLocation] = useState(null);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setmlat(latitude);
        setmlong(longitude);
      },
      (error) => {
        console.log('error message', error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  global.lat = mlat;
  global.long = mlong;
  

  useEffect(() => {
    getCurrentLocation();
  }, []); // Pass an empty dependency array to run the effect only once

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <Text>Map</Text>
      <MapView
        initialRegion={{
          latitude: mlat,
          longitude: mlong,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        zoomEnabled={true}
        zoomControlEnabled={true}
        showsUserLocation={true}
        style={{ flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.6 }}>
        <Marker coordinate={{ latitude: mlat, longitude: mlong }} />
      </MapView>
    </View>
  );
};

export default GoglMap;










// import React, {useState,useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import MapView ,{Marker}from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import {position} from 'native-base/lib/typescript/theme/styled-system';
// import {longPressGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';

// const GoogleMaps = () => {
//     const  [mlat,setmlat]=useState(0);
//     const [mlong,setmlong]=useState(0);
//   const {width, height} = Dimensions.get('window');
//   const {currentlocation,setcurrentlocation}=useState(null);
//   const getCurrentLocation = () => {
    
//     Geolocation.getCurrentPosition(
//         position => {
//     //   const {latitude, longitude} = position.coords;

//     //   setcurrentlocation({latitude,longitude});
//     //   setmlat(position.coords.latitude);
//     //   setmlong(position.coords.longitude);
//       console.log(position);
//       setmlat(position.coords.latitude);
//       setmlong(position.coords.longitude);
       

//     },
//     error=>{
//         console.log('error message',error.message);
//     },
//     {enableHighAccuracy:true,timeout:20000,maximumAge:1000}
    
//     );
//   };
//   global.lat=mlat;
//   console.log('mlat',global.lat)
//   global.long=mlong;
//   console.log('mlong',global.long)
//   useEffect(()=>{
//     getCurrentLocation();
//   })
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
//       <Text>Map</Text>
//       <MapView
//         initialRegion={{
//           latitude:mlat,
//           longitude:mlong,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         zoomEnabled={true}
//         zoomControlEnabled={true}
//         showsUserLocation={true}
//         style={{flex: 1, width: width * 1, height: height * 0.6}}>

// <Marker
//         coordinate={{latitude:mlat,longitude:mlong}}
//          />
//         </MapView>
//     </View>
//   );
// };
// export default GoogleMaps;
