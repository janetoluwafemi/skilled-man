import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const C_Dropdown = ({
                     selectedValue,
                     onValueChange,
                     options = [],
                     titleText = 'Select Option',
                     containerStyle,
                     labelKey = 'select_bussiness',
                     valueKey = 'select_bussiness',
                   }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getLabel = item => {
    if (!item) return '';
    if (typeof item === 'object') {
      return item[labelKey] || item.label || item.name || item[valueKey] || '';
    }
    return String(item);
  };

  const getValue = item => {
    if (!item) return '';
    if (typeof item === 'object') {
      return item[valueKey] ?? item.value ?? item[labelKey] ?? item;
    }
    return item;
  };

  const selectedDisplayLabel = () => {
    if (!selectedValue || selectedValue === 'Select Business' || selectedValue === 'year of experience') {
      return titleText;
    }
    const found = options.find(opt => getValue(opt) === selectedValue);
    return found ? getLabel(found) : String(selectedValue);
  };

  const handleSelect = item => {
    const val = getValue(item);
    if (onValueChange) {
      onValueChange(val);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.tileContainer, containerStyle]}
        onPress={() => setModalVisible(true)}>
        <Text
          style={[
            styles.selectedText,
            (!selectedValue || selectedValue.toString().toLowerCase().includes('select') || selectedValue.toString().toLowerCase().includes('year of')) &&
            styles.placeholderText,
          ]}
          numberOfLines={1}>
          {selectedDisplayLabel()}
        </Text>
        {Icons?.Feather ? (
          <Icons.Feather name="chevron-down" size={18} color="#64748B" />
        ) : (
          <Text style={{ color: '#64748B' }}>▼</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.sheetContainer}>
            <View style={styles.dragHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{titleText}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {Icons?.Ionicons ? (
                  <Icons.Ionicons name="close-circle" size={24} color="#94A3B8" />
                ) : (
                  <Text style={{ color: '#94A3B8', fontSize: 18 }}>✕</Text>
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const itemLabel = getLabel(item);
                const itemVal = getValue(item);
                const isSelected = selectedValue === itemVal;

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => handleSelect(item)}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {itemLabel}
                    </Text>
                    {isSelected && Icons?.Feather && (
                      <Icons.Feather name="check" size={18} color={color.defalt} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default C_Dropdown;

const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  selectedText: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '68%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.15)' }
      : {
        elevation: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      }),
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  listContent: {
    paddingVertical: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  optionRowSelected: {
    backgroundColor: '#FDF7F3',
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: color.defalt,
    fontWeight: '700',
  },
});