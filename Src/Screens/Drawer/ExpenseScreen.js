import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ExpenseCard from '../../Components/ExpenseCard';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import CstmHeader from '../../Components/CustomHeader';

const ExpnsScren = props => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const getExpns = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', global.userid || global.id);

      const response = await fetch(
        'https://fisdemoprojects.com/freshfood/api/view-expense-riders.php',
        {
          method: 'POST',
          body: formdata,
        }
      );
      const result = await response.json();
      if (result?.Expenses) {
        setData(result.Expenses);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
      setData([]);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getExpns();
    }
  }, [isFocused, getExpns]);

  const renderItem = ({ item }) => (
    <ExpenseCard
      cashinhand={item.expenses}
      price={item.price}
      source={require('../../Assets/Images/petrol.png')}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Expense"
        onPress={() => props.navigation.goBack()}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <Text style={styles.headStyle}>Latest Spending</Text>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses found</Text>
              </View>
            }
          />
        </View>
      </ImageBackground>
      <TouchableOpacity
        style={styles.iconCont}
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('add_expense')}>
        <Icons.AntDesign name="plus" style={styles.iconStyle} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExpnsScren;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
  },
  headStyle: {
    fontSize: 19,
    fontWeight: '600',
    paddingVertical: 10,
    color: color.drkgren,
  },
  iconStyle: {
    color: color.wite,
    fontSize: 33,
    backgroundColor: color.drkGren,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  iconCont: {
    position: 'absolute',
    right: '4%',
    bottom: '4%',
  },
  backgroundImg: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 15,
    color: color.gry,
  },
});