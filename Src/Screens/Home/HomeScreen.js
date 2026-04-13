import React, {useRef, useEffect} from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import HomStakwithoutsarch from '../../Components/HomeStackwithoutsearch';
import Two_Crd from '../../Components/Two_Card';
import Card from '../../Components/OpeningCard';
import TargetCard from '../../Components/TargetCard';
import color from '../../Assets/colors/colors';
const WishlstScren = () => {
  return (
    <>
      <Text
        style={{
          fontSize: 19,
          fontWeight: '600',
          color: color.drkgren,
          alignSelf: 'center',
          paddingVertical: 10,
        }}>
        Welcome Jhon!
      </Text>
    </>
  );
};

export default WishlstScren;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
