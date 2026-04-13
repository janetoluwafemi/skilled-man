import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Icons} from './Icons';
import LinearGradient from 'react-native-linear-gradient';

import color from '../Assets/colors/colors';
const DlivrTo = props => {
  return (
    <View style={[styles.locationCont, {...props.deliverCont}]}>
      <View style={styles.location}>
        <Icons.FontAwesome name="map-marker" size={23} color={color.defalt} />
        <Text style={styles.deliverStyle}>{props.deliverTo}</Text>
        <Text style={styles.locStyle}>{props.location}</Text>
      </View>

      <TouchableOpacity>
        <Text style={styles.chStyle}>{props.change}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  locationCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locStyle: {
    fontSize: 16,
    color: color.litGry,
  },
  deliverStyle: {
    fontSize: 19,
    fontWeight: '700',
    color: color.blak,
    paddingHorizontal: 7,
  },
  chStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: color.defalt,
  },
});

export default DlivrTo;
