import {StyleSheet, TouchableOpacity, Text, View, Platform, StatusBar, Dimensions} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from './Icons';
import color from '../Assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const CstmHeader = props => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.headerContainer,
      {paddingTop: Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0)}
    ]}>
      <StatusBar barStyle="light-content" backgroundColor={color.defalt} translucent={false} />
      <TouchableOpacity 
        style={styles.headerStyle} 
        onPress={props.onPressBack}
        activeOpacity={0.7}>
        <Icons.Ionicons 
          name="arrow-back" 
          size={getResponsiveSize(26, 28, 30)} 
          color={color.wite} 
        />
        <Text style={[
          styles.titleStyle,
          {fontSize: getResponsiveSize(16, 17, 18)}
        ]}>
          {props.title}
        </Text>
      </TouchableOpacity>
      {props.toggleReviewModal && (
        <TouchableOpacity
          style={styles.headerStyle}
          onPress={props.toggleReviewModal}
          activeOpacity={0.7}>
          <Icons.FontAwesome
            name={props.dropDownIcon}
            size={getResponsiveSize(30, 33, 35)}
            color={color.wite}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CstmHeader;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.defalt,
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingBottom: getResponsiveSpacing(12, 14, 15),
  },

  rightCont: {
    flexDirection: 'row',
  },
  notIcon: {
    marginLeft: 5,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  titleStyle: {
    fontWeight: '600',
    textAlign: 'center',
    color: color.wite,
    marginLeft: getResponsiveSpacing(10, 12, 15),
    flex: 1,
  },
});
