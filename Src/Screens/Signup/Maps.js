import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

let MapView, Marker;
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
    Marker = require('react-native-maps').Marker;
}

const Mapltln = () => {
    const mapRef = useRef(null);
    const navigation = useNavigation();

    const [location, setLocation] = useState({
        latitude: global.lat || 6.5244,
        longitude: global.long || 3.3792,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- request permission once on mount

    const requestPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === Location.PermissionStatus.GRANTED) {
                getCurrentLocation();
            } else {
                Alert.alert('Permission Denied', 'Location permission is required.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const newLoc = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
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
        } catch (err) {
            Alert.alert(
                'Location Failed',
                err.message || 'Unable to fetch location.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmLocation = () => {
        global.lat = location.latitude;
        global.long = location.longitude;
        navigation.goBack();
    };

    if (Platform.OS === 'web' || !MapView) {
        return (
            <View style={styles.webContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <View style={styles.topBarWeb}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}>
                        <Icons.Ionicons name="arrow-back" size={22} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.topBarTitle}>Select Location</Text>
                </View>

                <View style={styles.webContent}>
                    <Icons.Ionicons name="map-outline" size={60} color="#94A3B8" />
                    <Text style={styles.webTextTitle}>Map View Notice</Text>
                    <Text style={styles.webTextSub}>
                        Interactive GPS maps are available when running on Android and iOS devices.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.goBack()}
                        style={styles.confirmBtnWeb}>
                        <Text style={styles.confirmBtnText}>Go Back to Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

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
                    onPress={handleConfirmLocation}
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
        top: Platform.OS === 'android' ? 45 : 55,
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
    topBarWeb: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
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
        top: Platform.OS === 'android' ? 110 : 120,
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
    confirmBtnWeb: {
        backgroundColor: color.defalt,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 20,
    },
    confirmBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    webContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    webContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    webTextTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 12,
    },
    webTextSub: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 6,
        maxWidth: 320,
    },
});
