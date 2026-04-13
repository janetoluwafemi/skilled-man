import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import color from '../../Assets/colors/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';
import HeaderWSarchFiltr from '../../Components/HeaderWithSearchFilter';
import SavCrd from '../../Components/SaveCard';
import { BASIC_URL } from '../Signin/Signin';
import Toast from 'react-native-simple-toast';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const SavScren = props => {
  const navigation = useNavigation();
  const [favouritelist, setfavouritlist] = useState([])
  const foucus = useIsFocused()
  const [save, setsave] = useState(true)
  const [searchTerm, setsearchTerm] = useState('');

  const removefavouritem = async (pid) => {

    console.log("remove id", pid)
    const updatedFavouritelist = favouritelist.filter(item => item.provider_id !== pid);
    setfavouritlist(updatedFavouritelist)

    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=qhabj34eqn4k9p23vmoeqoa5th");

      var formdata = new FormData();
      formdata.append("user_id", global.id);
      formdata.append("provider_id", pid);
      formdata.append("status", "0");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/user/favorite_status_update.php"
      const apiurl = `${BASIC_URL}user/favorite_status_update.php`

      const response = await fetch(apiurl, requestOptions)
      const result = await response.json()

      if (result) {
        console.log("bookmark status changes", result)
      }
    } catch (error) {
      console.log(error)
    }


  }


  useEffect(() => {

    const getFavourite = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "PHPSESSID=qhabj34eqn4k9p23vmoeqoa5th");

        var formdata = new FormData();
        formdata.append("user_id", global.id);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
        // const apiurl = "https://fisdemoprojects.com/skilledman/api/user/get_favorite_provider.php"
        const apiurl = `${BASIC_URL}user/get_favorite_provider.php`

        const response = await fetch(apiurl, requestOptions)
        const result = await response.json()
        if (result && result.favorite_providers) {
          console.log("result.favorite_providers", result?.favorite_providers)
          setfavouritlist(result?.favorite_providers)
        }
        else if (result.error) {
          // Alert.alert(result.error)
          Toast.show(result.error)
        }

      } catch (error) {
        console.log(error)
      }
    }
    getFavourite()
  }, [foucus])

  const filteredData = favouritelist.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  console.log(filteredData, 'filteredData')


  return (
    <>
      <HeaderWSarchFiltr
        onPress={() => {
          navigation.openDrawer();
        }}
        onPressNotifiction={() => {
          navigation.navigate('notification_screen');
        }}
        onPressProfile={() => {
          navigation.navigate('editUserProfile');
        }}
        titleText="What are you looking for?"
        bellIcon="bell"
        onChangeText={val => {
          setsearchTerm(val);
        }}
        value={searchTerm}
        screen={'user'}
      />
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item: itemval, index: ind}) => (
            <SavCrd
              item={itemval}
              showProfile={() =>
                navigation.navigate('IndividualChat', {currentuser: itemval})
              }
              cardTitle={itemval.name}
              time="12:00 AM"
              msgTitle="Total Jobs"
              totJobs={itemval.total_jobs}
              // imgUrl={`https://fisdemoprojects.com/skilledman/api/uploads//${itemval.image}`}
              imgUrl={`${BASIC_URL}uploads//${itemval.image}`}
              approvedIcon="user-check"
              bookMarkIcon="bookmark"
              ratingTitle="Rating"
              totRat={itemval.rating}
              // distance="Distance"
              // totDis={`${itemval.distance}km`}
              removefavouritem={removefavouritem}
              save={save}
              togglestat={() => setsave(false)}
            />
          )}
        />
      </ScrollView>
    </>
  );
};

export default SavScren;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 15,
    marginTop: 40,
    maxHeight:"65%"
  },

  inputCont: {
    marginVertical: 10,
    width: '100%',
  },
});
