import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import CashinHand from './CashInHand';
import { BASIC_URL } from '../Screens/Signin/Signin';

const Two_Crd = () => {
  const [showBalance, setShowBalance] = useState('0');

  const pendingBalancefun = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    pendingBalancefun();
  }, [pendingBalancefun]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardWrapper}>
        <CashinHand cardTitle="Cash Pending:" price={showBalance} />
      </View>
    </View>
  );
};

export default Two_Crd;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 55,
  },
  cardWrapper: {
    width: '100%',
  },
});