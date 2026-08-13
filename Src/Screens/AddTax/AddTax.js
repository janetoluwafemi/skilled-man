import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import C_TaxInput from '../../Components/C_Taxinput';
import { BASIC_URL } from '../Signin/Signin';

const AdTax = props => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [taxId, setTaxId] = useState('');
  const [load, setLoad] = useState(false);

  const adTxFun = async () => {
    if (!taxId.trim() || !description.trim()) {
      showToast('Please fill the required fields.');
      return;
    }
    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('tax', taxId);
      formdata.append('user_id', global.id);
      formdata.append('description', description);

      const response = await fetch(`${BASIC_URL}add_tax.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result) {
        showToast('Tax details added successfully');
        navigation.navigate('Congratulations');
      }
    } catch (error) {
      setLoad(false);
      showToast('Failed to add tax details.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIcon={styles.headerIcon}
        />
        <View style={styles.container}>
          <Text style={styles.accountVer}>Add Tax Detail</Text>

          <View style={styles.inputContainer}>
            <C_TaxInput
              placeholder="Tax Id"
              placeholderTextColor={color.defalt}
              value={taxId}
              onChangeText={setTaxId}
            />
          </View>

          <View style={styles.inputContainer}>
            <C_TaxInput
              placeholder="Description"
              placeholderTextColor={color.defalt}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText={
              load ? <ActivityIndicator size="small" color="#fff" /> : 'Register'
            }
            onPressFunc={adTxFun}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AdTax;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.8,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
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