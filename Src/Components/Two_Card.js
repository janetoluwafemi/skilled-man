import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../Assets/colors/colors';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const Two_Card = () => {
  const focus = useIsFocused();
  const [earnedHidden, setEarnedHidden] = useState(false);
  const [pendingHidden, setPendingHidden] = useState(false);
  const [availableBalance, setAvailableBalance] = useState('0.00');
  const [pendingBalance, setPendingBalance] = useState('0.00');

  const fetchBalances = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const userId = global.id || userObj?.id || '255';

      const [availRes, pendRes] = await Promise.all([
        fetch(`${BASIC_URL}available-balance.php?provider_id=${userId}`),
        fetch(`${BASIC_URL}balance_pending.php?provider_id=${userId}`),
      ]);

      const availData = await availRes.json();
      const pendData = await pendRes.json();

      if (availData?.balance !== undefined) setAvailableBalance(String(availData.balance));
      if (pendData?.balance !== undefined) setPendingBalance(String(pendData.balance));
    } catch (e) {
      console.log('Balance fetch error:', e);
    }
  }, []);

  useEffect(() => {
    if (focus) fetchBalances();
  }, [focus, fetchBalances]);

  return (
    <View style={styles.cardWrapper}>
      {/* Earned Balance Card */}
      <View style={[styles.balanceCard, styles.firstBalanceCard]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.badgeRow}>
            <View style={styles.earnedDot} />
            <Text style={styles.badgeText}>Earned Balance</Text>
          </View>
          <TouchableOpacity onPress={() => setEarnedHidden(!earnedHidden)} activeOpacity={0.7}>
            {Icons?.Feather && (
              <Icons.Feather
                name={earnedHidden ? 'eye-off' : 'eye'}
                size={16}
                color="#64748B"
              />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>
          {earnedHidden ? '••••••' : `₦${availableBalance}`}
        </Text>
      </View>

      {/* Cash Pending Card */}
      <View style={[styles.balanceCard, styles.secondBalanceCard]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.badgeRow}>
            <View style={styles.pendingDot} />
            <Text style={styles.badgeText}>Cash Pending</Text>
          </View>
          <TouchableOpacity onPress={() => setPendingHidden(!pendingHidden)} activeOpacity={0.7}>
            {Icons?.Feather && (
              <Icons.Feather
                name={pendingHidden ? 'eye-off' : 'eye'}
                size={16}
                color="#64748B"
              />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>
          {pendingHidden ? '••••••' : `₦${pendingBalance}`}
        </Text>
      </View>
    </View>
  );
};

export default Two_Card;

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  firstBalanceCard: {
    marginRight: 6,
  },
  secondBalanceCard: {
    marginLeft: 6,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
});