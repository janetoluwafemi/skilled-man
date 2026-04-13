import { StyleSheet, TouchableOpacity, Text, View, Platform, StatusBar, Dimensions, Alert } from 'react-native';
import { React, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../Assets/colors/colors';
import { Image } from 'native-base';
import OpningCrd from './OpeningCard';
import SarchInpt from './SearchInput';
import InputSarchFiltr from './InputSearchFilter';
import { useIsFocused } from '@react-navigation/native';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

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
const HeaderWSarchFiltr = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [profileData, setprofileData] = useState(null);
  const [name, setName] = useState(null);
  const [profileimg, setprofileimg] = useState(null)
  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setprofileimg(profileData.profile)
    }
  }, [profileData, focus]);

  //console.log(props);
  useEffect(() => {
    GettProfilData();
  }, [global.id, focus]);
  const GettProfilData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=nehf3e2dgdauiaooraluprccv7");

      var formdata = new FormData();
      formdata.append("id", global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      // fetch("https://fisdemoprojects.com/skilledman/api/user/get_profile.php", requestOptions)
      fetch(`${BASIC_URL}user/get_profile.php`, requestOptions)

        .then(response => response.json())
        .then(result => {
          console.log(result,'result')

          if (result) {
            setprofileData(result)
          }
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  }

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
        <View style={styles.rightCont}>
          <TouchableOpacity
            onPress={props.onPressNotifiction}
            style={styles.menuStyle}
            activeOpacity={0.7}>
            <Icons.MaterialCommunityIcons
              name={props.bellIcon}
              size={getResponsiveSize(26, 28, 30)}
              color={color.wite}
              style={styles.bellStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={props.onPressProfile} activeOpacity={0.7}>
            {(profileimg && profileimg.profile !== null) ?
              <Image
                source={{ uri: `${BASIC_URL}uploads/${profileData?.profile}` }}
                resizeMode="cover"
                style={[
                  styles.imgStyle,
                  {
                    width: getResponsiveSize(45, 48, 50),
                    height: getResponsiveSize(45, 48, 50),
                  }
                ]}
              />
              :
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
                alt="user"
              />
            }
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[
        styles.userStyle,
        {fontSize: getResponsiveSize(15, 16, 17)}
      ]}>
        {props.titleText}
      </Text>
      <View style={styles.searchStyle}>
        <InputSarchFiltr
          onChangeText={props.onChangeText}
          value={props.value}
          toggleModal={props.toggleModal}
          screen={props.screen}
        />
      </View>
    </View>
  );
};

export default HeaderWSarchFiltr;

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
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingBottom: getResponsiveSpacing(25, 30, 35),
    minHeight: getResponsiveSpacing(140, 160, 180),
  },
  linearGradientStyle: {
    elevation: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    paddingVertical: 10,
  },

  rightCont: {
    flexDirection: 'row',
    alignItems: 'center',
    width: getResponsiveSpacing(35, 38, 40),
    justifyContent: 'flex-end',
  },
  notIcon: {
    marginLeft: 5,
  },
  menuStyle: {
    padding: 4,
  },
  imgStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginBottom: getResponsiveSpacing(15, 20, 25),
  },
  searchStyle: {
    position: 'absolute',
    bottom: getResponsiveSpacing(-20, -25, -30),
    alignSelf: 'center',
    width: '95%',
    maxWidth: SCREEN_WIDTH - 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bellStyle: {
    marginRight: getResponsiveSpacing(8, 6, 12),
  },
});