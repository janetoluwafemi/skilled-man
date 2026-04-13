import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import color from '../Assets/colors/colors';
import {Picker} from '@react-native-picker/picker';

const C_Dropdwn = props => {
  console.log(props, 'props');
  const [selectedBusiness, setselectedBusiness] = useState(props.selectedValue);
  const pickerRef = useRef();

  return (
    <View style={styles.DropDownContainer}>
      <Picker
        ref={pickerRef}
        selectedValue={selectedBusiness}
        onValueChange={(itemValue, itemIndex) => {
          setselectedBusiness(itemValue);
          props.onValueChange(itemValue);
        }}
        onChangeText={props.onChangeText}
        enabled={true}
        mode={'dialog'}
        dropdownIconColor={color.defalt}
        prompt={props.titleText}
        selectionColor={color.ylow}
        itemStyle={styles.itemsStyle}>
        {props.options?.map((option, index) => (
          <Picker.Item
            key={index}
            label={option.select_bussiness}
            value={option.select_bussiness}
            color={color.defalt}
          />
        ))}
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
  },
  itemsStyle: {
    color: color.rd,
    fontWeight: '400',
  },
  containerStyle: {
    zIndex: 100,
  },
});
