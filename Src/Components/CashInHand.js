import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const CashinHand = ({ cardTitle, cardStyle, price }) => {
  const [showBalance, setShowBalance] = useState('0');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prev => !prev);
  };

  const fetchPendingBalance = async () => {
    try {
      const formdata = new FormData();
      formdata.append('provider_id', global.id);

      const response = await fetch(`${BASIC_URL}balance_pending.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.pending_amount) {
        setShowBalance(result.pending_amount);
      }
    } catch (error) {
      console.log('Error fetching pending balance:', error);
    }
  };

  useEffect(() => {
    if (isBalanceVisible) {
      fetchPendingBalance();
    }
  }, [isBalanceVisible]);

  return (
    <View style={[styles.textContainer, cardStyle]}>
      <View style={styles.contentWrapper}>
        <View style={styles.openingStyle}>
          <Text style={styles.TextStyle}>{cardTitle}</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility}>
            <Icons.FontAwesome
              name={isBalanceVisible ? 'eye' : 'eye-slash'}
              size={25}
              color={colors.defalt}
            />
          </TouchableOpacity>
        </View>

        {isBalanceVisible ? (
          <Text style={styles.balanceStyle}>
            {price ? `₦${showBalance}` : '0'}
          </Text>
        ) : (
          <Text style={styles.balanceStyle}>*****</Text>
        )}
      </View>
    </View>
  );
};

export default CashinHand;

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: colors.wite,
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 1,
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
  },
  TextStyle: {
    fontSize: 16,
    color: colors.defalt,
    fontWeight: '700',
    textAlign: 'left',
    marginTop: 8,
    marginRight: 10,
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  balanceStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.blak,
    textAlign: 'left',
    paddingTop: 10,
  },
});