import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import color from '../Assets/colors/colors';
import icon, {Icons} from '../Components/Icons';
import {useNavigation} from '@react-navigation/native';
import {BASIC_URL} from '../Screens/Signin/Signin';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
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
const Img_URL =
  'https://https://theskilledman.com/../../freshfood/public/riderlog/';
//const ImageUrl = 'https://fisdemoprojects.com/../../freshfood/public/riderlog/';

const DrarUsr = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
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
          console.log('Profile Data in Drawe user Screen', result);

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
    <TouchableOpacity
      style={styles.MainContainer}
      onPress={() => {
        navigation.navigate('account_setting');
      }}>
      {global.logo === null ? (
        <Image
          source={require('../Assets/Images/user.jpg')}
          style={styles.imgStyle}
        />
      ) : (
        <Image
          source={{uri: Img_URL + global.logo}}
          // style={styles.imgStyle} commenting out this line to avoid an empty border above profile image in drawer
        />
      )}

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
      <Text style={[
        styles.userName,
        {fontSize: getResponsiveSize(18, 19, 20)}
      ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default DrarUsr;
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: color.wite,
    borderBottomWidth: 0.4,
    width: '100%',
    paddingBottom: getResponsiveSpacing(12, 14, 15),
    marginBottom: getResponsiveSpacing(8, 10, 12),
    paddingTop: getResponsiveSpacing(10, 12, 15),
  },
  userName: {
    color: color.wite,
    fontWeight: '700',
    marginTop: getResponsiveSpacing(8, 10, 12),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSpacing(15, 20, 25),
  },
  imgStyle: {
    width: getResponsiveSize(80, 90, 100),
    height: getResponsiveSize(80, 90, 100),
    alignSelf: 'center',
    borderRadius: getResponsiveSize(40, 45, 50),
    borderColor: color.orng,
    borderWidth: getResponsiveSize(2.5, 3, 3.5),
  },
});
