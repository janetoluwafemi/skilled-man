import {StyleSheet, TouchableOpacity, Text, View, Platform, StatusBar, Dimensions, Alert} from 'react-native';
import {React, useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../Assets/colors/colors';
import {Image} from 'native-base';
import {Icons} from './Icons';
import {useIsFocused} from '@react-navigation/native';
import {BASIC_URL} from '../Screens/Signin/Signin';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};
const DrarTitlProfilHeader = props => {
  //const navigation = useNavigation();
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
          console.log(result);

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
        <TouchableOpacity onPress={props.onPress} style={styles.menuStyle} activeOpacity={0.7}>
          <Icon 
            name="menu" 
            size={getResponsiveSize(30, 33, 35)} 
            color={color.wite} 
          />
        </TouchableOpacity>
        <Text style={[
          styles.userStyle,
          {fontSize: getResponsiveSize(14, 15, 16)}
        ]}>
          {props.screenTitle}
        </Text>
        <TouchableOpacity onPress={props.userProfile} activeOpacity={0.7}>
          {profileimg && profileimg.profile !== null ? (
            <Image
              source={{uri: `${BASIC_URL}uploads/${profileData?.profile}`}}
              resizeMode="cover"
              style={[
                styles.imgStyle,
                {
                  width: getResponsiveSize(45, 48, 50),
                  height: getResponsiveSize(45, 48, 50),
                }
              ]}
            />
          ) : (
            <Image
              source={require('../Assets/Images/user.jpg')}
              resizeMode="cover"
              style={[
                styles.imgStyle,
                {
                  width: getResponsiveSize(45, 48, 50),
                  height: getResponsiveSize(45, 48, 50),
                }
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrarTitlProfilHeader;

const styles = StyleSheet.create({
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 4,
  },
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: getResponsiveSpacing(10, 15, 20),
  },
  imgStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  menuStyle: {
    padding: 4,
  },
});
