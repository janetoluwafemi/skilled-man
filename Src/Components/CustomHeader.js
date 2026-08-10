import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;

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

const CstmHeader = ({
                      title,
                      onPressBack,
                      toggleReviewModal,
                      dropDownIcon = 'ellipsis-v',
                    }) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
  );

  return (
    <View style={[styles.headerContainer, { paddingTop: topPadding }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.defalt}
        translucent={false}
      />

      <TouchableOpacity
        style={styles.leftContainer}
        onPress={onPressBack}
        activeOpacity={0.7}>
        <Icons.Ionicons
          name="arrow-back"
          size={getResponsiveSize(26, 28, 30)}
          color={color.wite}
        />
        <Text
          style={[
            styles.titleStyle,
            { fontSize: getResponsiveSize(16, 17, 18) },
          ]}
          numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>

      {toggleReviewModal && (
        <TouchableOpacity
          style={styles.rightActionBtn}
          onPress={toggleReviewModal}
          activeOpacity={0.7}>
          <Icons.FontAwesome
            name={dropDownIcon}
            size={getResponsiveSize(26, 28, 30)}
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
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleStyle: {
    fontWeight: '600',
    color: color.wite,
    marginLeft: getResponsiveSpacing(10, 12, 15),
    flex: 1,
  },
  rightActionBtn: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});