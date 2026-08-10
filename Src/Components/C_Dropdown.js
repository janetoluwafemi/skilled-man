import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import color from '../Assets/colors/colors';

const C_Dropdwn = ({
                     selectedValue,
                     onValueChange,
                     options = [],
                     titleText = 'Select Option',
                     enabled = true,
                     containerStyle,
                     mode = 'dialog',
                     dropdownIconColor = color.defalt,
                     selectionColor = color.ylow,
                     labelKey = 'select_bussiness',
                     valueKey = 'select_bussiness',
                     ...rest
                   }) => {
  return (
    <View style={[styles.DropDownContainer, containerStyle]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => {
          if (onValueChange) {
            onValueChange(itemValue, itemIndex);
          }
        }}
        enabled={enabled}
        mode={mode}
        dropdownIconColor={dropdownIconColor}
        prompt={titleText}
        selectionColor={selectionColor}
        itemStyle={styles.itemsStyle}
        {...rest}>
        {options?.map((option, index) => {
          const label =
            typeof option === 'object'
              ? option[labelKey] || option.label || option.value
              : option;
          const value =
            typeof option === 'object'
              ? option[valueKey] || option.value || option.label
              : option;

          return (
            <Picker.Item
              key={index}
              label={String(label ?? '')}
              value={value}
              color={color.defalt}
            />
          );
        })}
      </Picker>
    </View>
  );
};

export default C_Dropdwn;

const styles = StyleSheet.create({
  DropDownContainer: {
    borderColor: color.defalt,
    borderWidth: 1,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 6,
    marginTop: 6,
    height: 53,
    justifyContent: 'center',
  },
  itemsStyle: {
    color: color.rd,
    fontWeight: '400',
  },
});