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

const FlatListCard = ({
                     cardTitle,
                     cardStyle,
                     onPressShowProfile,
                     iconName,
                     paidTitle,
                     dateCont,
                     bookingId,
                     filepress,
                     date,
                     status,
                   }) => {
  const openFile = () => {
    if (!filepress) return;

    const fileURL = `${BASIC_URL}uploads/${filepress}`;
    Linking.openURL(fileURL).catch(err => {
      console.error(`Error opening file: ${err}`);
    });
  };

  const combinedCardStyle = StyleSheet.flatten([
    styles.textContainer,
    cardStyle,
  ]);

  const combinedPaidStyle = StyleSheet.flatten([
    styles.paidStyle,
    dateCont,
  ]);

  return (
    <View style={combinedCardStyle}>
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
          <Text style={combinedPaidStyle}>{paidTitle}</Text>
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
          <Text style={styles.dateStyle}>{date}</Text>
        </View>
        <Text style={styles.statusStyle}>{status}</Text>
      </View>
    </View>
  );
};

export default FlatListCard;

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
    fontSize: 15,
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
    alignItems: 'baseline',
  },
  paidStyle: {
    fontSize: 17,
    color: colors.defalt,
    fontWeight: 'bold',
  },
});