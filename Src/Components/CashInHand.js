import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useState,useEffect } from 'react';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';
import { BASIC_URL } from '../Screens/Signin/Signin';
const CashinHand = props => {
  // const [showBalance, setShowBalance] = useState(true);
  // const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  // const toggleBalanceVisibility = () => {
  //   setIsBalanceVisible(!isBalanceVisible);


  // };
  const [showBalance, setShowBalance] = useState('0');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const pendingBlncfun = () => {
    try {
      console.log("pending balance")
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=7856s9hmnpm6n6biinqlkqi073');

      var formdata = new FormData();
      formdata.append("provider_id", global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      // fetch("https://fisdemoprojects.com/skilledman/api/balance_pending.php", requestOptions)
      fetch(`${BASIC_URL}balance_pending.php`, requestOptions)

        .then(response => response.json()) // Parse response as JSON
        .then(result => {
          if (result && result.pending_amount) {
            console.log("pending balance result:", result.pending_amount);
            setShowBalance(result.pending_amount);
          }
        })
        .catch(error => console.log('Error:', error));
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    pendingBlncfun();
    
  }, [isBalanceVisible]);

  return (
    <View style={[styles.textContainer, { ...props.cardStyle }]}>
      <View>
        <View style={styles.openingStyle}>
          <Text style={[styles.TextStyle, { marginRight: 10 }]}>{props.cardTitle}</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility}>
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
            {props.price  ? (
              <Text style={styles.balanceStyle}>₦{showBalance}</Text>
            ) : (
              <Text style={styles.balanceStyle}>0</Text>
            )}

          </>
        ) : (
          <Text style={styles.balanceStyle}>*****</Text>
        )}

      </View>
    </View>
  );
};

export default CashinHand;
const styles = StyleSheet.create({
  balanceStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.blak,
    textAlign: 'left',
    paddingTop: 10,
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
    // width: '79.7%',
    width: '100%',
    // borderWidth: 1,
  },
});