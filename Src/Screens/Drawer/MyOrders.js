import React, {useRef, useEffect, useContext, useState} from 'react';

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import color from '../../Assets/colors/colors';
import {ScrollView} from 'native-base';
import OrderHistoryCard from '../../Components/OrderHistoryCard';
import CstmHeader from '../../Components/CustomHeader';
import Icon, {Icons} from '../../Components/Icons';
import {useIsFocused} from '@react-navigation/native';
import Card from '../../Components/OpeningCard';
import OrderCard from '../../Components/OrderCard';
const OrdrHistry = props => {
  const [data, setData] = useState([]);
  const isfocused = useIsFocused();

  const Items = ({item}) => (
    <OrderHistoryCard
      userName={item?.Customer_Name}
      address={`${item.Customer_Address},${item.Customer_City}`}
      addressIcon="map-marker"
      status={item?.Status}
      time={item?.Order_Date}
    />
  );

  return (
    <>
      <CstmHeader
        title="My Orders"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <ScrollView style={styles.containerStyle}>
          <OrderCard />
          <OrderCard />
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default OrdrHistry;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 60,
    paddingHorizontal: 15,
  },
  HeadStyle: {
    color: color.drkGren,
    fontSize: 18,
    fontWeight: '800',
    paddingVertical: 5,
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  imgStyle: {
    width: '48%',
    height: 150,
    borderRadius: 10,
    marginBottom: 6,
  },
  iconstyle: {
    fontSize: 27,
    color: color.drkGren,
  },
  headCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backgroundImg: {
    height: '100%',
  },
});
