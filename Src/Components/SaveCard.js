import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';
import { Badge } from 'react-native-paper';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const SavCrd = props => {
  return (
    <TouchableOpacity
      onPress={props.showProfile}
      style={[styles.textContainer, { ...props.cardStyle }]}>
      <Image
        style={styles.logoImg}
        resizeMode="contain"
        source={{ uri: props.imgUrl }}
      />
      <View style={styles.profileCont}>
        <View style={[styles.openingStyle, { ...styles.titleCont }]}>
          <View style={styles.nameCont}>
            <Text style={styles.TextStyle}>{props.cardTitle}</Text>
            <Icons.FontAwesome5
              name={props.approvedIcon}
              color={color.blu}
              size={20}
            />
          </View>

          {props.save?(<TouchableOpacity onPress={() => props.removefavouritem(props.item.id)}>
            <Icons.FontAwesome
              name={props.bookMarkIcon}
              color={color.defalt}
              size={25}
            />
          </TouchableOpacity>) : (<TouchableOpacity onPress={() => (console.log("itemremoved"))}>
            <Icons.FontAwesome
              name={'bookmark-o'}
              color={color.defalt}
              size={25}
            />
          </TouchableOpacity>)}




        </View>
        <View style={styles.openingStyle}>
          <View>
            <Text style={styles.msgTitle}>{props.ratingTitle}</Text>
            <Text style={styles.msgTitle}>{props.totRat}</Text>
          </View>
          <View>
            <Text style={styles.msgTitle}>{props.msgTitle}</Text>
            <Text style={styles.msgTitle}>{props.totJobs}</Text>
          </View>
          <View>
            <Text style={styles.msgTitle}>{props.distance}</Text>
            <Text style={styles.msgTitle}>{props.totDis}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity >
  );
};

export default SavCrd;
const styles = StyleSheet.create({
  profileCont: {
    width: '100%',
  },
  textContainer: {
    paddingHorizontal: 11,
    paddingVertical: 15,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 1,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TextStyle: {
    fontSize: 18,
    color: colors.blak,
    fontWeight: '700',
    textAlign: 'left',
    marginRight: 5,
  },
  msgTitle: {
    fontSize: 14,
    color: colors.gry,
    fontWeight: '400',
    textAlign: 'center',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '72%',
  },
  dateTimeCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateStyle: {
    fontSize: 14,
    color: colors.litGry,
    fontWeight: '400',
    textAlign: 'left',
  },
  statusStyle: {
    fontSize: 14,
    color: colors.rd,
    fontWeight: '400',
  },
  noOfMsg: {
    backgroundColor: color.defalt,
    color: color.wite,
    fontSize: 14,
  },
  logoImg: {
    width: width / 4.8,
    height: height / 8,
    borderRadius: 10,
    marginRight: 7,
  },
  titleCont: {
    paddingBottom: 18,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
