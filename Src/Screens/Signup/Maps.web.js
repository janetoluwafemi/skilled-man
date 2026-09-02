import React from 'react';
import {View, Text, StyleSheet ,
  Platform} from 'react-native';

const Maps = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Map View</Text>
            <Text style={styles.subtitle}>
                Map features run on native mobile devices.
            </Text>
        </View>
    );
};

export default Maps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});