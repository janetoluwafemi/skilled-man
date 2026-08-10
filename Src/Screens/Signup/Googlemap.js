import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const { width, height } = Dimensions.get('window');

// Dynamic native imports to prevent Web bundler crashes
let MapView, Marker;
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
    Marker = require('react-native-maps').Marker;
}

const GoglMap = () => {
    const mapRef = useRef(null);
    const [location, setLocation] = useState({
        latitude: 33.6844,
        longitude: 73.0479,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            requestPermission();
        }
    }, []);

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    Alert.alert('Permission Denied', 'Location permission is required.');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        if (loading) return;
        setLoading(true);

        if (Platform.OS === 'web') {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        global.lat = latitude;
                        global.long = longitude;
                        setLoading(false);
                    },
                    error => {
                        setLoading(false);
                        Alert.alert('Location Error', error.message || 'Failed to fetch location.');
                    }
                );
            } else {
                setLoading(false);
                Alert.alert('Not Supported', 'Geolocation is not supported in this browser.');
            }
            return;
        }

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const newLoc = { latitude, longitude };

                setLocation(newLoc);
                global.lat = latitude;
                global.long = longitude;

                mapRef.current?.animateToRegion(
                    {
                        ...newLoc,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    1000
                );
                setLoading(false);
            },
            error => {
                setLoading(false);
                Alert.alert('Location Error', error.message || 'Failed to fetch current location.');
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    // Render Web Fallback View
    if (Platform.OS === 'web' || !MapView) {
        return (
            <View style={styles.webFallbackContainer}>
                <View style={styles.webCard}>
                    <Icons.Ionicons name="map-outline" size={48} color={color.defalt} />
                    <Text style={styles.webTitle}>Map Preview Unavailable on Web</Text>
                    <Text style={styles.webSubtitle}>
                        Interactive native maps are supported directly on mobile devices (Android & iOS).
                    </Text>

                    <View style={styles.coordsBadge}>
                        <Text style={styles.coordTextDark}>
                            Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={getCurrentLocation}
                        disabled={loading}
                        style={[styles.primaryBtn, styles.fullWidth, loading && styles.btnDisabled]}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" style={styles.loaderMargin} />
                        ) : (
                            <Icons.Ionicons name="locate" size={20} color="#FFF" style={styles.btnIcon} />
                        )}
                        <Text style={styles.primaryBtnText}>
                            {loading ? 'Locating...' : 'Get Browser Location'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Render Native Mobile Map
    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation
                showsMyLocationButton={false}
                zoomEnabled
                zoomControlEnabled>
                <Marker coordinate={location} />
            </MapView>

            <View style={styles.badgeCard}>
                <View style={styles.badgeHeader}>
                    <Icons.Ionicons name="location" size={16} color={color.defalt} />
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
            </View>
        </View>
    );
};

export default GoglMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    map: {
        flex: 1,
        width: width,
        height: height,
    },
    badgeCard: {
        position: 'absolute',
        top: 50,
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
    fullWidth: {
        width: '100%',
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
    webFallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        padding: 24,
    },
    webCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        maxWidth: 420,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    webTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    webSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    coordsBadge: {
        backgroundColor: '#E2E8F0',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 20,
    },
    coordTextDark: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
});