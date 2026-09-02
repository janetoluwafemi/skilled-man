import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import AmountInput from '../../Components/AmountInput';

const AddExpense = props => {
  const [selected, setSelected] = useState([]);
  const [dataapi, setDataApi] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getExpense = useCallback(async () => {
    try {
      const response = await fetch(
          'https://fisdemoprojects.com/freshfood/api/dropdown-expense.php',
          { method: 'POST' }
      );
      const data = await response.json();
      if (data?.expenses) {
        const newArray = data.expenses.map(item => ({
          key: String(item.id),
          value: item.title,
        }));
        setDataApi(newArray);
      }
    } catch (error) {
      console.log('Error fetching expense types:', error);
    }
  }, []);

  useEffect(() => {
    getExpense();
  }, [getExpense]);

  const toggleSelection = val => {
    if (selected.includes(val)) {
      setSelected(selected.filter(item => item !== val));
    } else {
      setSelected([...selected, val]);
    }
  };

  const addExpense = async () => {
    if (!amount.trim()) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please enter an amount', ToastAndroid.SHORT);
      } else {
        alert('Please enter an amount');
      }
      return;
    }

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('rider_id', global.userid || global.id);
      formdata.append('expense', selected.join(','));
      formdata.append('price', amount);

      const response = await fetch(
          'https://fisdemoprojects.com/freshfood/api/add-expense-riders.php',
          {
            method: 'POST',
            body: formdata,
          }
      );
      const { failed, success } = await response.json();
      setLoading(false);

      if (failed) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Failed to save expense', ToastAndroid.SHORT);
        } else {
          alert('Failed to save expense');
        }
      } else if (success) {
        props.navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.log('Error saving expense:', error);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        <View style={styles.headerBar}>
          <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props.navigation.goBack()}
              style={styles.backArrowBtn}>
            <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
          <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.formContainer}>

            <View style={styles.badgeRow}>
              <View style={styles.badgeCircle}>
                <Icons.Feather
                    name="dollar-sign"
                    size={34}
                    color={color.defalt}
                />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Record Expense</Text>
            <Text style={styles.welcomeSubtitle}>
              Track and log your operational expenses
            </Text>

            <View style={styles.cardWrapper}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Amount (₦)</Text>
                <AmountInput
                    placeholder="Amount"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setAmount}
                    value={amount}
                    keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Expense Type</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.selectBox}
                    onPress={() => setModalVisible(true)}>
                  <Text style={selected.length > 0 ? styles.selectBoxValue : styles.selectBoxPlaceholder}>
                    {selected.length > 0
                        ? `${selected.length} type(s) selected`
                        : 'Select Expense Types'}
                  </Text>
                  <Icons.Feather name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {selected.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {selected.map((item, index) => (
                        <View key={index} style={styles.tagBadge}>
                          <Text style={styles.tagText}>{item}</Text>
                          <TouchableOpacity onPress={() => toggleSelection(item)}>
                            <Icons.Feather name="x" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                          </TouchableOpacity>
                        </View>
                    ))}
                  </View>
              )}

              <TouchableOpacity
                  style={styles.loginBtn}
                  activeOpacity={0.8}
                  onPress={addExpense}
                  disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <Text style={styles.btnText}>Save Expense</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>

        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Expense Types</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icons.Ionicons name="close-circle" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <FlatList
                  data={dataapi}
                  keyExtractor={item => item.key}
                  renderItem={({ item }) => {
                    const isSelected = selected.includes(item.value);
                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.optionRow}
                            onPress={() => toggleSelection(item.value)}>
                          <Text style={StyleSheet.flatten([styles.optionText, isSelected && styles.optionTextActive])}>
                            {item.value}
                          </Text>
                          <View style={StyleSheet.flatten([styles.checkbox, isSelected && styles.checkboxActive])}>
                            {isSelected && <Icons.Feather name="check" size={14} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>
                    );
                  }}
              />

              <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setModalVisible(false)}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  selectBoxPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  selectBoxValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.defalt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loginBtn: {
    borderRadius: 14,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    marginTop: 6,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  optionTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: color.defalt,
    borderColor: color.defalt,
  },
  doneBtn: {
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
