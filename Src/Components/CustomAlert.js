import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375;

function normalize(size) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

const CustomAlert = ({ visible, title, message, onOk, okText = 'OK' }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onOk}
    >
      <View style={styles.alertOverlay}>
        <Animatable.View animation="zoomIn" duration={300} style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity
            style={styles.alertButton}
            activeOpacity={0.8}
            onPress={onOk}
          >
            <Text style={styles.alertButtonText}>{okText}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(24),
  },
  alertBox: {
    width: '100%',
    maxWidth: normalize(340),
    backgroundColor: '#1E293B',
    borderRadius: normalize(20),
    padding: normalize(22),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  alertTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: normalize(10),
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: normalize(13.5),
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: normalize(20),
    marginBottom: normalize(20),
  },
  alertButton: {
    width: '100%',
    backgroundColor: '#334155',
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '600',
  },
});
