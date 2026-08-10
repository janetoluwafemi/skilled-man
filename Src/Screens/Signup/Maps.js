import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import { useNavigation } from '@react-navigation/native';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const Mapltln = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [location, setLocation] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    if (loading) return;
    setLoading(true);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
    })
      .then(loc => {
        const newLoc = {
          latitude: loc.latitude,
          longitude: loc.longitude,
        };

        setLocation(newLoc);
        global.lat = newLoc.latitude;
        global.long = newLoc.longitude;

        mapRef.current?.animateToRegion(
          {
            ...newLoc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      })
      .catch(err => {
        Alert.alert(
          'Location Failed',
          err.message || 'Unable to fetch location.'
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}>
        <Marker coordinate={location} />
      </MapView>

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Select Location</Text>
      </View>

      <View style={styles.badgeCard}>
        <View style={styles.badgeHeader}>
          <Icons.Ionicons name="location-sharp" size={18} color={color.defalt} />
          <Text style={styles.badgeTitle}>Current Coordinates</Text>
        </View>
        <Text style={styles.coordText}>
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={getCurrentLocation}
          disabled={loading}
          style={[styles.primaryBtn, loading && styles.btnDisabled]}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" style={styles.loaderMargin} />
          ) : (
            <Icons.Ionicons name="locate" size={20} color="#FFF" style={styles.btnIcon} />
          )}
          <Text style={styles.primaryBtnText}>
            {loading ? 'Locating...' : 'Get Current Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Confirm & Use Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mapltln;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeCard: {
    position: 'absolute',
    top: 115,
    left: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  coordText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: color.defalt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnIcon: {
    marginRight: 8,
  },
  loaderMargin: {
    marginRight: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});