import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../Assets/colors/colors';
import {Icons} from './Icons';
import color from '../Assets/colors/colors';
import {BASIC_URL} from '../Screens/Signin/Signin';
const BookingCrd = props => {
  const openFile = () => {
    // const fileURL = `https://fisdemoprojects.com/skilledman/api/uploads/${props.filepress}`;
    const fileURL = `${BASIC_URL}uploads/${props.filepress}`;

    // Use Linking to open the file URL
    Linking.openURL(fileURL).catch(err => {
      console.error(`Error opening file: ${err}`);
      // You can show an error message to the user if the file can't be opened
    });
  };
  return (
    <View style={[styles.textContainer, {...props.cardStyle}]}>
      <View style={styles.openingStyle}>
        <Text style={styles.TextStyle}>{props.cardTitle}</Text>
        <View style={styles.rightCont}>
          <TouchableOpacity onPress={props.onPressShowProfile}>
            <Icons.FontAwesome
              name={props.iconName}
              size={30}
              color={color.drkGry}
            />
          </TouchableOpacity>
          <Text style={[styles.paidStyle, {...props.dateCont, marginRight: 8}]}>
            {props.paidTitle}
          </Text>
          {props.status == 'complete' ? (
            <TouchableOpacity onPress={props.toggleReviewModal}>
              <Icons.FontAwesome
                name={'ellipsis-v'}
                size={35}
                color={'black'}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View style={styles.openingStyle}>
        <Text style={styles.bookingStyle}>{props.bookingId}</Text>
        <TouchableOpacity onPress={openFile}>
          <Icons.FontAwesome name="file-text" size={25} color={color.drkGry} />
        </TouchableOpacity>
      </View>
      <View style={styles.openingStyle}>
        <View style={styles.dateTimeCont}>
          <Text style={styles.dateStyle}>{props.date} </Text>
          <Text style={styles.expertiseStyle}>{props.expertise}</Text>
        </View>
        <Text style={styles.statusStyle}>{props.status}</Text>
      </View>
    </View>
  );
};

export default BookingCrd;
const styles = StyleSheet.create({
  balanceStyle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blak,
    textAlign: 'left',
    paddingTop: 10,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 0,
    width: '100%',
    marginBottom: 10,
  },
  TextStyle: {
    fontSize: 17,
    color: colors.blak,
    fontWeight: '700',
    textAlign: 'left',
  },
  bookingStyle: {
    fontSize: 14,
    color: colors.gry,
    fontWeight: '400',
    textAlign: 'left',
  },
  expertiseStyle: {
    color: color.ylow,
    flexWrap: 'wrap',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  dateTimeCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateStyle: {
    fontSize: 14,
    color: colors.ylow,
    fontWeight: '400',
    textAlign: 'left',
  },
  statusStyle: {
    fontSize: 14,
    color: colors.rd,
    fontWeight: '400',
  },
  rightCont: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  paidStyle: {
    fontSize: 17,
    color: colors.defalt,
    fontWeight: 'bold',
  },
});
