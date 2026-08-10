import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import OrderCard from '../../Components/OrderCard';

const OrdrHistry = props => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="My Orders"
        onPressBack={() => props.navigation.goBack()}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <ScrollView
          style={styles.containerStyle}
          showsVerticalScrollIndicator={false}>
          <OrderCard />
          <OrderCard />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OrdrHistry;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStyle: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  backgroundImg: {
    flex: 1,
  },
});