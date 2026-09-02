import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity ,
  Platform} from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const DlivrTo = ({
                   deliverTo = 'Deliver to:',
                   location,
                   changeText = 'Change',
                   onChangePress,
                   deliverContStyle,
                 }) => {
  return (
    <View style={[styles.locationCont, deliverContStyle]}>
      <View style={styles.locationWrapper}>
        <Icons.FontAwesome name="map-marker" size={22} color={color.defalt} />
        <Text style={styles.deliverStyle}>{deliverTo}</Text>
        {location ? (
          <Text style={styles.locStyle} numberOfLines={1}>
            {location}
          </Text>
        ) : null}
      </View>

      {onChangePress ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onChangePress}>
          <Text style={styles.chStyle}>{changeText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default DlivrTo;

const styles = StyleSheet.create({
  locationCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
    width: '100%',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  deliverStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.blak,
    paddingHorizontal: 6,
  },
  locStyle: {
    fontSize: 15,
    color: color.litGry,
    flexShrink: 1,
  },
  chStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: color.defalt,
  },
});