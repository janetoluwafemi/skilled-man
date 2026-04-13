import {StyleSheet, TouchableOpacity, Text, View, Platform, StatusBar} from 'react-native';
import {React, useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../Assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'native-base';
import OpningCrd from './OpeningCard';
import {BASIC_URL} from '../Screens/Signin/Signin';
import {useIsFocused} from '@react-navigation/native';
const HomStakwithoutsarch = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [profileData, setprofileData] = useState(null);
  const [name, setName] = useState(null);
  const [profileimg, setprofileimg] = useState(null);
  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setprofileimg(profileData.profile);
    }
  }, [profileData, focus]);

  //console.log(props);
  useEffect(() => {
    GetProfileData();
  }, [global.id, focus]);
  const GetProfileData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=nehf3e2dgdauiaooraluprccv7');

      var formdata = new FormData();
      formdata.append('id', global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // fetch("https://fisdemoprojects.com/skilledman/api/user/get_profile.php", requestOptions)
      fetch(`${BASIC_URL}user/get_profile.php`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('Profile Data', result);

          if (result) {
            setprofileData(result);
          }
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  };

  return (
    <View style={[
      styles.containerStyle,
      {paddingTop: Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0)}
    ]}>
      <StatusBar barStyle="light-content" backgroundColor={color.defalt} translucent={false} />
      <View style={styles.topCont}>
        <TouchableOpacity onPress={props.onPress} style={styles.menuStyle}>
          <Icon name="menu" size={35} color={color.wite} />
        </TouchableOpacity>

        <View style={styles.rightCont}>
          <TouchableOpacity onPress={props.onPressnotification}>
            {profileimg && profileimg.profile !== null ? (
              <Image
                // source={{ uri: `https://fisdemoprojects.com/skilledman/api/uploads/${profileData?.profile}` }}
                source={{uri: `${BASIC_URL}uploads/${profileData?.profile}`}}
                resizeMode="cover"
                style={styles.imgStyle}
                //alt="user"
              />
            ) : (
              <Image
                source={require('../Assets/Images/user.jpg')}
                resizeMode="cover"
                style={styles.imgStyle}
                //alt="user"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.userStyle}>Hi, {name}</Text>
      <OpningCrd cardStyle={styles.OpeningBalanceCard} />
    </View>
  );
};

export default HomStakwithoutsarch;

const styles = StyleSheet.create({
  OpeningBalanceCard: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
  },
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 4,
  },
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingBottom: 45,
  },
  linearGradientStyle: {
    elevation: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    paddingVertical: 10,
  },

  rightCont: {
    flexDirection: 'row',
  },
  notIcon: {
    marginLeft: 5,
  },

  imgStyle: {
    height: 50,
    width: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  userStyle: {
    fontSize: 15,
    fontWeight: '800',
    color: color.wite,
    marginBottom: 30,
  },
});
