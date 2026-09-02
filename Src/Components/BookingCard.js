import React from 'react';
import {View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,

  Platform} from 'react-native';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const BookingCrd = ({
                      cardStyle,
                      cardTitle,
                      onPressShowProfile,
                      iconName,
                      dateCont,
                      paidTitle,
                      status,
                      toggleReviewModal,
                      bookingId,
                      filepress,
                      date,
                      expertise,
                    }) => {
  const openFile = () => {
    if (!filepress) return;
    const fileURL = `${BASIC_URL}uploads/${filepress}`;
    Linking.openURL(fileURL).catch(err => {
      console.error(`Error opening file: ${err}`);
    });
  };

  return (
    <View style={StyleSheet.flatten([styles.textContainer, cardStyle])}>
      <View style={styles.openingStyle}>
        <Text style={styles.TextStyle}>{cardTitle}</Text>
        <View style={styles.rightCont}>
          {iconName ? (
            <TouchableOpacity onPress={onPressShowProfile}>
              <Icons.FontAwesome
                name={iconName}
                size={30}
                color={colors.drkGry}
              />
            </TouchableOpacity>
          ) : null}
          <Text style={StyleSheet.flatten([styles.paidStyle, dateCont, styles.paidMargin])}>
            {paidTitle}
          </Text>
          {status === 'complete' ? (
            <TouchableOpacity onPress={toggleReviewModal}>
              <Icons.FontAwesome
                name="ellipsis-v"
                size={35}
                color="black"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.openingStyle}>
        <Text style={styles.bookingStyle}>{bookingId}</Text>
        {filepress ? (
          <TouchableOpacity onPress={openFile}>
            <Icons.FontAwesome
              name="file-text"
              size={25}
              color={colors.drkGry}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.openingStyle}>
        <View style={styles.dateTimeCont}>
          <Text style={styles.dateStyle}>{date} </Text>
          <Text style={styles.expertiseStyle}>{expertise}</Text>
        </View>
        <Text style={styles.statusStyle}>{status}</Text>
      </View>
    </View>
  );
};

export default BookingCrd;

const styles = StyleSheet.create({
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
    color: colors.ylow,
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
  paidMargin: {
    marginRight: 8,
  },
});