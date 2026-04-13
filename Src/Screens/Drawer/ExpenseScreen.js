import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import HomStakwithoutsarch from '../../Components/HomeStackwithoutsearch';
import ExpenseCard from '../../Components/ExpenseCard';
import color from '../../Assets/colors/colors';
import icon, {Icons} from '../../Components/Icons';
import CstmHeader from '../../Components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';

const ExpnsScren = props => {
  const isfoucsed = useIsFocused();
  const [data, setData] = useState([]);

  const renderItem = ({item}) => (
    <>
      <ExpenseCard
        cashinhand={item.expenses}
        price={item.price}
        source={require('../../Assets/Images/petrol.png')}
      />
    </>
  );
  const getExpns = () => {
    var myHeaders = new Headers();
    myHeaders.append('Cookie', 'PHPSESSID=er5ecftfsivp3r986np7jpf28o');
    var formdata = new FormData();
    formdata.append('id', global.userid);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(
      'https://fisdemoprojects.com/freshfood/api/view-expense-riders.php',
      requestOptions,
    )
      .then(response => response.json())
      .then((Expenses, failed) => {
        if (Expenses.Expenses) {
          console.log(Expenses.Expenses, 'EXPENSES');
          setData(Expenses.Expenses);
        } else if (failed) {
          setData(null);
        }
      })
      .catch(error => console.log('error', error));
  };
  useEffect(() => {
    getExpns();
  }, [isfoucsed]);
  return (
    <>
      <CstmHeader
        title="Expense"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <Text style={styles.HeadStyle}> Latest Spending</Text>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ImageBackground>
      <TouchableOpacity
        style={styles.iconCont}
        onPress={() => props.navigation.navigate('add_expense')}>
        <Icons.AntDesign name="plus" style={styles.iconStyle} />
      </TouchableOpacity>
    </>
  );
};

export default ExpnsScren;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
  },
  HeadStyle: {
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
    right: '2%',
    bottom: '3%',
  },
  backgroundImg: {
    // height: '100%',
    flex: 1,
  },
});
