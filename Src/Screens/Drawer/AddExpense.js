import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import AmountInput from '../../Components/AmountInput';

const AdExpens = props => {
  const [selected, setSelected] = useState([]);
  const [dataapi, setDataApi] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const getExpense = useCallback(async () => {
    try {
      const response = await fetch(
        'https://fisdemoprojects.com/freshfood/api/dropdown-expense.php',
        { method: 'POST' }
      );
      const data = await response.json();
      if (data?.expenses) {
        const newArray = data.expenses.map(item => ({
          key: String(item.id),
          value: item.title,
        }));
        setDataApi(newArray);
      }
    } catch (error) {
      console.log('Error fetching expense types:', error);
    }
  }, []);

  useEffect(() => {
    getExpense();
  }, [getExpense]);

  const addExpense = async () => {
    if (!amount.trim()) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please enter an amount', ToastAndroid.SHORT);
      } else {
        alert('Please enter an amount');
      }
      return;
    }

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('rider_id', global.userid || global.id);
      formdata.append('expense', selected.join(','));
      formdata.append('price', amount);

      const response = await fetch(
        'https://fisdemoprojects.com/freshfood/api/add-expense-riders.php',
        {
          method: 'POST',
          body: formdata,
        }
      );
      const { failed, success } = await response.json();
      setLoading(false);

      if (failed) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Failed to save expense', ToastAndroid.SHORT);
        } else {
          alert('Failed to save expense');
        }
      } else if (success) {
        props.navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.log('Error saving expense:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Add Expense"
        onPress={() => props.navigation.goBack()}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <AmountInput
            placeholder="Amount"
            placeholderTextColor="#444444"
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
          />

          <MultipleSelectList
            setSelected={val => setSelected(val)}
            data={dataapi}
            dropdownStyles={styles.dropdownStyles}
            boxStyles={styles.boxStyles}
            placeholder="Expense Type"
            save="value"
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.8}
              onPress={addExpense}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnText}>Save Expense</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AdExpens;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  boxStyles: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1.3,
  },
  backgroundImg: {
    flex: 1,
  },
  dropdownStyles: {
    borderWidth: 0,
    backgroundColor: color.wite,
    borderRadius: 0,
  },
  loginBtn: {
    borderRadius: 5,
    backgroundColor: color.drkgren,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '70%',
    paddingVertical: 12,
    marginTop: 35,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  btnContainer: {
    marginTop: 20,
  },
});