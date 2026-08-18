import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';

const UserChat = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
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

export default UserChat;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
});