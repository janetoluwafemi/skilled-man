import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';
import { BASIC_URL } from '../Screens/Signin/Signin';
import { useNavigation } from '@react-navigation/native';

const OpningCrd = props => {
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = useState('0');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const openingBalancefun = () => {
    try {
      //console.log("öpening balance")
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=a5r6euihjq5g1magf2bfurdoi5");

      var formdata = new FormData();
      formdata.append('provider_id', global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      //fetch("https://fisdemoprojects.com/skilledman/api/available-balance.php", requestOptions)
      fetch(`${BASIC_URL}available-balance.php`, requestOptions)

        .then(response => response.json()) // Parse response as JSON
        .then(result => {
          if (result && result.available_balance) {
            console.log("Opening balance result:", result.available_balance);
            setShowBalance(result.available_balance);
          }
        })
        .catch(error => console.log('Error:', error));
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    openingBalancefun();
  }, []);

  return (
    <TouchableOpacity style={[styles.textContainer, { ...props.cardStyle }]}
    onPress={showBalance === '0' ? null : () => navigation.navigate('Balance')}>
      <View>
        <View style={styles.openingStyle}>
          <Text style={styles.TextStyle}>Earned Balance:</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility}>

{/* <TouchableOpacity onPress={() => {
        
              toggleBalanceVisibility
              }}
          
          > */}
            {isBalanceVisible ? (
              <Icons.FontAwesome name="eye" size={25} color={color.defalt} />
            ) : (
              <Icons.FontAwesome
                name="eye-slash"
                size={25}
                color={color.defalt}
              />
            )}
          </TouchableOpacity>
        </View>

        {isBalanceVisible ? (
          <>
            {showBalance  ? (
              
              <Text style={styles.balanceStyle}>₦{showBalance}</Text>
            ) : (
              <Text style={styles.balanceStyle}></Text>
            )}

          </>
        ) : (
          <Text style={styles.balanceStyle}>*****</Text>
        )}
      </View>

    </TouchableOpacity>
  );
};

export default OpningCrd;
const styles = StyleSheet.create({
  balanceStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.blak,
    textAlign: 'left',
    paddingVertical: 10,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: colors.wite,
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 1,
    width: '100%',
  },
  TextStyle: {
    fontSize: 16,
    color: colors.defalt,
    fontWeight: '700',
    textAlign: 'left',
    marginTop: 8,
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '80%',
    width: '100%',
  },
});