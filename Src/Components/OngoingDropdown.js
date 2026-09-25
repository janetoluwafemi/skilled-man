import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {Icons} from './Icons';

if (
  Platform.OS === 'android' &&
  !global.nativeFabricUIManager &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OngoingDrpdwn = props => {
  const [isOpen, setIsOpen] = useState(false);

  const businessOptions = [
    {label: 'Select Action', value: '0', icon: 'layers', color: '#94A3B8'},
    {label: 'In Progress', value: 'progress', icon: 'clock', color: '#EA580C'},
    {
      label: 'Complete',
      value: 'complete',
      icon: 'check-circle',
      color: '#10B981',
    },
    {label: 'Reject', value: 'reject', icon: 'x-circle', color: '#EF4444'},
  ];

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const handleSelect = value => {
    props.setselectedBusiness(value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(false);
  };

  const selectedOption =
    businessOptions.find(o => o.value === props.selectedBusiness) ||
    businessOptions[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.header, isOpen && styles.headerOpen]}
        onPress={toggleDropdown}>
        <View style={styles.headerLeft}>
          <Icons.Feather
            name={selectedOption.icon}
            size={18}
            color={selectedOption.color}
          />
          <Text
            style={[
              styles.headerText,
              props.selectedBusiness === '0' && styles.placeholderText,
            ]}>
            {selectedOption.label}
          </Text>
        </View>
        <Icons.Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsList}>
          {businessOptions
            .filter(opt => opt.value !== '0')
            .map((option, index) => {
              const isSelected = props.selectedBusiness === option.value;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}>
                  <View style={styles.optionLeft}>
                    <Icons.Feather
                      name={option.icon}
                      size={18}
                      color={option.color}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </View>

                  {/* Show checkmark if selected */}
                  {isSelected && (
                    <Icons.Feather name="check" size={18} color="#0F172A" />
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </View>
  );
};

export default OngoingDrpdwn;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 6,
    zIndex: 100, // Keeps dropdown above other elements if necessary
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    height: 53,
    paddingHorizontal: 16,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 12,
  },
  placeholderText: {
    color: '#64748B',
    fontWeight: '400',
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  optionItemSelected: {
    backgroundColor: '#F8FAFC',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    marginLeft: 12,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
