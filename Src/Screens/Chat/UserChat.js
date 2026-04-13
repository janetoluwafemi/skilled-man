import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import color from '../../Assets/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const UsrCht = props => {
  const navigation = useNavigation();

  return (
    <>
      <ProflHader
        rightIcon="search"
        screenTitle="Chat"
        onPress={() => {
          navigation.openDrawer();
        }}
        onPressnotification={() => {
          navigation.navigate('');
        }}
      />
      <ScrollView style={styles.scrollView}>
        <ProflCrd
          showProfile={() => navigation.navigate('IndividualChat')}
          cardTitle="Tafari"
          time="12:00 AM"
          msgTitle="Hi, how are you?"
          noOfMsg={3}
        />
        <ProflCrd
          showProfile={() => navigation.navigate('IndividualChat')}
          cardTitle="Staurt"
          time="1:00 AM"
          msgTitle="Hi, how are you?"
          noOfMsg={2}
        />
        <ProflCrd
          showProfile={() => navigation.navigate('IndividualChat')}
          cardTitle="Binny"
          time="2:00 AM"
          msgTitle="Hi, how are you?"
          noOfMsg={5}
        />
        <ProflCrd
          showProfile={() => navigation.navigate('IndividualChat')}
          cardTitle="Sharma"
          time="3:00 AM"
          msgTitle="Hi, how are you?"
          noOfMsg={7}
        />
        <ProflCrd
          showProfile={() => navigation.navigate('IndividualChat')}
          cardTitle="Jamal"
          time="7:00 AM"
          msgTitle="Hi, how are you?"
          noOfMsg={1}
        />
      </ScrollView>
    </>
  );
};

export default UsrCht;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  inputCont: {
    marginVertical: 10,
    width: '100%',
  },
});
