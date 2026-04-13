import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import HomStakWSarch from '../../Components/HomeStackWithSearch';
import MyWrkTab from './AllTabs';

const {height, width} = Dimensions.get('window');

const MyWrk = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchTerm, setsearchTerm] = useState('');
  
  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <HomStakWSarch
        onPress={() => {
          navigation.openDrawer();
        }}
        onPressnotification={() => {
          navigation.navigate('edit_profile');
        }}
        onChangeText={val => {
          setsearchTerm(val);
        }}
        value={searchTerm}
      />
      <View style={{flex: 1, paddingTop: 10}}>
        <MyWrkTab value={searchTerm} />
      </View>
    </SafeAreaView>
  );
};

export default MyWrk;

const styles = StyleSheet.create({
  linearGradientStyle: {
    elevation: 0,
    borderRadius: 6,
    height: '100%',
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  vegetableTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: color.blak,
  },
  inputCont: {
    marginVertical: 10,
    width: '100%',
  },

  pendAppr: {
    fontWeight: 'bold',
    fontSize: 17,
    color: color.blak,
    paddingVertical: 5,
  },
  cardContainer: {
    marginHorizontal: 15,
    marginTop: 40,
    marginBottom: 27,
  },
  scrollViewStyle: {
    marginBottom: 40,
    paddingBottom: 40,
  },

  bookingStyle: {
    fontSize: 14,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'left',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '93%',
    marginBottom: 15,
  },
  dateTimeCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dateStyle: {
    fontSize: 14,
    color: color.ylow,
    fontWeight: '400',
    textAlign: 'left',
  },
  logoImg: {
    width: width / 4,
    height: height / 8,
    marginTop: -55,
    borderRadius: 10,
  },
  btnTextStyle: {
    fontSize: 13,
  },
  acceptStyle: {
    width: '47%',
  },
  rejectStyle: {
    backgroundColor: color.rd,
    borderColor: color.rd,
    borderWidth: 2,
    width: '47%',
  },
  getDir: {
    color: color.defalt,
    fontWeight: '700',
    paddingTop: 5,
  },
});
