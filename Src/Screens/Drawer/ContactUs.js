import React, {useRef, useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import CashHistoryCard from '../../Components/CashHistoryCard';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';
import ProfileInput from '../../Components/ProfileInput';
import MultiLineInput from '../../Components/MultiLineInput';
import {border} from 'native-base/lib/typescript/theme/styled-system';
const CntctUs = props => {
  const [Data, setData] = useState([]);
  const isfocused = useIsFocused();

  const Items = ({item}) => (
    <View style={styles.bodyCont}>
      <Text style={styles.contStyle}>{item.Date}</Text>
      <Text style={styles.contStyle}>{item.Total_Expense}</Text>
      <Text style={styles.contStyle}>{item.Cash_Collected}</Text>
      <Text style={styles.contStyle}>{item.Closing_Balance}</Text>
      <Text
        style={[
          styles.contStyle,
          {
            backgroundColor:
              item.rider_status === 'accept' ? color.Gren : color.ylow,
            color: color.wite,
            borderRadius: 3,
          },
        ]}>
        {item.rider_status}
      </Text>
    </View>
  );
  return (
    <>
      <CstmHeader
        title="Contact Us"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <ProfileInput
            style={{color: color.gry}}
            placeholder="Name"
            placeholderTextColor={color.gry}
            onChangeText={val => setName(val)}
            icon="user-circle"
          />
          <ProfileInput
            style={{color: color.gry}}
            placeholder="Email"
            placeholderTextColor={color.gry}
            onChangeText={val => setemail(val)}
            icon="envelope"
          />
          <MultiLineInput
            style={{color: color.gry}}
            placeholder="Message..."
            placeholderTextColor={color.gry}
            numberOfLines={8}
            styles={{marginTop: 18, textAlignVertical: 'top'}}
          />
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default CntctUs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  bodyCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.wite,

    alignSelf: 'center',
    elevation: 5,
    paddingHorizontal: 4,
    paddingVertical: 20,
    width: '100%',
  },
  HeadStyle: {
    fontSize: 19,
    fontWeight: '600',
    paddingVertical: 10,
    color: color.drkgren,
  },
  contStyle: {
    fontSize: 13,
    color: color.gry,
    flexWrap: 'wrap',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  iconStyle: {
    color: color.wite,
    fontSize: 33,
    backgroundColor: color.drkGren,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  iconCont: {
    position: 'absolute',
    right: '2%',
    bottom: '3%',
  },
  backgroundImg: {
    height: '100%',
  },
  loginBtn: {
    borderRadius: 5,
    backgroundColor: color.drkgren,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    marginTop: 35,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
});
