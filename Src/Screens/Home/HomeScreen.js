import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import color from '../../Assets/colors/colors';

const WishlstScren = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome Jhon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default WishlstScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: '600',
    color: color.drkgren,
    textAlign: 'center',
    paddingVertical: 10,
  },
});