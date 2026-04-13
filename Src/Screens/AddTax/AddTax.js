import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { Checkbox } from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import C_Dropdwn from '../../Components/C_Dropdown';
import InputWIcon from '../../Components/InputWithIcon';
import C_TaxInput from '../../Components/C_Taxinput';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import Toast from 'react-native-simple-toast';

const AdTax = props => {



  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [description, setDescription] = React.useState('')
  const [TaxId, setTaxId] = React.useState('')

  const handledesciption = (value) => {
    console.log("description", value)
    setDescription(value)
  }
  const handleTax = (value) => {
    console.log("setTaxID", value)
    setTaxId(value)
  }

  const AdTxfun = async () => {
    if (TaxId === '' || description === "") {
      Toast.show('Please fill the required fields.');
      return;
    }
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=eddcih6nlqteh4o8jvflmsa5vn");

      var formdata = new FormData();
      formdata.append("tax", TaxId);
      formdata.append("user_id", global.id);
      formdata.append("description", description);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://fisdemoprojects.com/skilledman/api/add_tax.php", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result) {
            console.log(result)
            navigation.navigate('Congratulations')
          }
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error', error)
    }

  }


  return (
    <>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => {
            props.navigation.goBack();
          }}
          headerIcon={styles.headerIcon}
        />
        <View style={styles.container}>
          <Text style={styles.accountVer}>Add Tax Detail</Text>

          <View style={styles.inputContainer}>

            <C_TaxInput
              placeholder="Tax Id"
              placeholderTextColor={color.defalt}
              value={TaxId}
              onChangeText={handleTax} />

          </View>
          <View style={styles.inputContainer}>
            <C_TaxInput
              placeholder="Description"
              placeholderTextColor={color.defalt}
              value={description}
              onChangeText={handledesciption}
            />
          </View>
          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText="Register"
            onPressFunc={() => {
              AdTxfun()
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default AdTax;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.8,
  },

  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 25,
  },
  logoImg: {
    width: width / 2,
    height: height / 4.6,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },

  BtnStyle: {
    marginTop: 25,
    width: '100%',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
