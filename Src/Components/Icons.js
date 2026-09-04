import React from 'react';
import {StyleSheet} from 'react-native';
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
} from '@expo/vector-icons';
import { normalize } from '../utilis/responsive';

export const Icons = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
  FontAwesome6,
};

const Icon = ({ type, name, color, size = 24, style }) => {
  const Tag = type;
  if (!Tag || !name) return null;

  return (
    <Tag
      name={name}
      size={normalize(size)}
      color={color}
      style={style ? StyleSheet.flatten(style) : undefined}
    />
  );
};

export default Icon;