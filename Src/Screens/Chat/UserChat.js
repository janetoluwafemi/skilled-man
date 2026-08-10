import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';

const UsrCht = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProflHader
        rightIcon="search"
        screenTitle="Chat"
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
    </SafeAreaView>
  );
};

export default UsrCht;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});