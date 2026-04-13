import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../Assets/colors/colors';
import {Image} from 'native-base';
import {Icons} from './Icons';
import {Modal} from 'react-native-paper';
import BotonComp from './BtnComp';
import {BASIC_URL} from '../Screens/Signin/Signin';
const ChatUsrHeader = props => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.containerStyle}>
      <View style={styles.topCont}>
        <View style={styles.userContainer}>
          <TouchableOpacity onPress={props.onPress} style={styles.menuStyle}>
            <Icons.FontAwesome5
              name={props.backIcon}
              size={22}
              color={color.wite}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={props.onProfilePress}>
            <Image
              style={styles.logoImg}
              resizeMode="cover"
              source={{
                // uri: `https://fisdemoprojects.com/skilledman/api/uploads//${props.recieverdata.image}`,
                uri: `${BASIC_URL}uploads//${props.recieverdata.image}`,
              }}
              alt="user"
            />
          </TouchableOpacity>

          <Text style={styles.userStyle}>{props.recieverdata.name}</Text>
        </View>
        {/* <TouchableOpacity onPress={() => toggleModal()}>
            <Image
              style={styles.logoImg}
              resizeMode="center"
              source={{
                uri: `https://fisdemoprojects.com/skilledman/api/uploads//${props.recieverdata.image}`,
              }}
              alt="user"
            />
          </TouchableOpacity> */}

        <Modal
          style={{height: 230, alignItems: 'center', justifyContent: 'center'}}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => toggleModal()}>
          <View style={styles.modalContainer}>
            <Image
              style={{width: 220, height: 120}} // Adjust the size as needed
              source={{
                // uri: `https://fisdemoprojects.com/skilledman/api/uploads//${props.recieverdata.image}`,
                uri: `${BASIC_URL}uploads//${props.recieverdata.image}`,
              }}
              alt="user"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleModal()}>
              <Icons.FontAwesome5 name="times" size={22} color={color.wite} />
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            // onPress={() => props.navigation.navigate('SelectPaymentMethod')}
            onPress={props.onProfilePress}>
            <Icons.FontAwesome5
              name={props.dollarIcon}
              size={20}
              color={color.wite}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Icons.FontAwesome
              name={props.phoneIcon}
              size={20}
              color={color.wite}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icons.FontAwesome
              name={props.searchIcon}
              size={20}
              color={color.wite}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default ChatUsrHeader;

const styles = StyleSheet.create({
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  userStyle: {
    fontSize: 15,
    fontWeight: '800',
    color: color.wite,
    marginLeft: 4,
  },
  logoImg: {
    width: 45,
    height: 45,
    borderRadius: 6,
  },
  iconsContainer: {
    flexDirection: 'row',
    width: '6%',
    justifyContent: 'space-between',
  },
  userContainer: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: {
    height: 10,
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalImage: {
    width: '40%',
    height: '40%',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 120,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  successmodalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalStyle: {
    position: 'absolute',
    bottom: 0,
  },
  menuStyle: {
    marginRight: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
  },
});
