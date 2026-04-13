import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ToastAndroid,
} from 'react-native';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import C_TxtInput from '../../Components/C_TextInput';
import AmountInput from '../../Components/AmountInput';
import ExpenseTypeDropdown from '../../Components/ExpenseTypeDropdown';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
const AdExpens = props => {
  const [selected, setSelected] = React.useState('');
  const [dataapi, setdata] = React.useState([]);
  const [amount, setAmount] = React.useState('');
  const [selectedvalue, setSelectedvalue] = React.useState([]);
  const data = [
    {key: '1', value: 'Mobiles', disabled: true},
    {key: '2', value: 'Appliances'},
    {key: '3', value: 'Cameras'},
    {key: '4', value: 'Computers', disabled: true},
    {key: '5', value: 'Vegetables'},
    {key: '6', value: 'Diary Products'},
    {key: '7', value: 'Drinks'},
  ];

  const AddExpense = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Cookie', 'PHPSESSID=hngqgsn84embu1ppv6s4qdh6sa');

    var formdata = new FormData();
    formdata.append('rider_id', global.userid);
    formdata.append('expense', dataget());
    formdata.append('price', amount);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    await fetch(
      'https://fisdemoprojects.com/freshfood/api/add-expense-riders.php',
      requestOptions,
    )
      .then(response => response.json())
      .then(({failed, success}) => {
        if (failed) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Failed...', ToastAndroid.SHORT);
          } else {
            alert('Failed');
          }
        } else if (success) {
          props.navigation.goBack();
        }
      })
      .catch(error => console.log('error', error));
  };
  const getExpense = () => {
    var myHeaders = new Headers();
    myHeaders.append('Cookie', 'PHPSESSID=hngqgsn84embu1ppv6s4qdh6sa');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      'https://fisdemoprojects.com/freshfood/api/dropdown-expense.php',
      requestOptions,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data, 'DATA');

        let newArray = data.expenses.map(item => {
          return {key: item.id, value: item.title};
        });
        console.log(newArray, 'NEW ARRAY');
        setdata(newArray);
      })
      .catch(error => console.log('error', error));
  };
  const dataget = () => {
    let text = selected.join();

    return text;
  };
  useEffect(() => {
    getExpense();
  }, []);
  return (
    <>
      <CstmHeader
        title="Add Expense"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <AmountInput
            placeholder="Amount"
            placeholderTextColor="#444444"
            onChangeText={amount => {
              setAmount(amount);
            }}
            keyboardType={'numeric'}
          />

          <MultipleSelectList
            setSelected={val => setSelected(val)}
            data={dataapi}
            dropdownStyles={styles.dropdownStyles}
            boxStyles={styles.boxStyles}
            placeholder={'Expense Type'}
            save={item => {
              setSelectedvalue(item);
            }}
            onSelect={() => {
              console.log(selected);
              let newvariable = selected;
              console.log(newvariable);
            }}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.btnText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default AdExpens;

const styles = StyleSheet.create({
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
    height: '100%',
  },
  dropdownStyles: {
    borderWidth: 0,
    backgroundColor: color.wite,
    borderRadius: 0,
  },
  loginBtn: {
    borderRadius: 5,
    backgroundColor: color.drkgren,
    textAlign: 'center',
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
