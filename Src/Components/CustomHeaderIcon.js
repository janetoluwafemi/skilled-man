import React from 'react';
import {StyleSheet, TouchableOpacity ,
  Platform} from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const CstmHeaderIcon = ({
                          onPress,
                          iconName = 'arrow-left',
                          iconSize = 26,
                          iconColor = color.defalt,
                          headerIconStyle,
                          containerStyle,
                          activeOpacity = 0.7,
                          ...rest
                        }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.headerStyle, containerStyle]}
      onPress={onPress}
      {...rest}>
      <Icons.FontAwesome5
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={headerIconStyle}
      />
    </TouchableOpacity>
  );
};

export default CstmHeaderIcon;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 4,
  },
});