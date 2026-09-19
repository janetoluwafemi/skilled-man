import React from 'react';
import {StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity} from 'react-native';
import colors from '../Assets/colors/colors';
import { Icons } from './Icons';
import {getProviderId} from '../utilis/favoriteUtils';

const SavCrd = props => {
  const providerId = getProviderId(props.item);

  const handleBookmarkPress = () => {
    if (props.save && props.removefavouritem && providerId) {
      props.removefavouritem(providerId);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.showProfile}
      style={[styles.textContainer, props.cardStyle]}>
      <Image
        style={styles.logoImg}
        resizeMode="cover"
        source={
          props.imgUrl
            ? { uri: props.imgUrl }
            : require('../Assets/Images/user.jpg')
        }
      />
      <View style={styles.profileCont}>
        <View style={styles.titleCont}>
          <View style={styles.nameCont}>
            <Text style={styles.textStyle} numberOfLines={1}>
              {props.cardTitle}
            </Text>
            {props.approvedIcon ? (
              <Icons.FontAwesome5
                name={props.approvedIcon}
                color={colors.blu}
                size={16}
              />
            ) : null}
          </View>

          <TouchableOpacity onPress={handleBookmarkPress}>
            <Icons.FontAwesome
              name={props.save ? props.bookMarkIcon || 'bookmark' : 'bookmark-o'}
              color={colors.defalt}
              size={22}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.statCol}>
            <Text style={styles.msgTitle}>{props.ratingTitle}</Text>
            <Text style={styles.statVal}>{props.totRat}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.msgTitle}>{props.msgTitle}</Text>
            <Text style={styles.statVal}>{props.totJobs}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.msgTitle}>{props.distance}</Text>
            <Text style={styles.statVal}>{props.totDis}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavCrd;

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImg: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 12,
  },
  profileCont: {
    flex: 1,
  },
  titleCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  textStyle: {
    fontSize: 16,
    color: colors.blak,
    fontWeight: '700',
    marginRight: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
  },
  msgTitle: {
    fontSize: 12,
    color: colors.gry,
    textAlign: 'center',
  },
  statVal: {
    fontSize: 13,
    color: colors.blak,
    fontWeight: '600',
    marginTop: 2,
  },
});