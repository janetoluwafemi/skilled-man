import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import ExpenseCard from '../../Components/ExpenseCard';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const ExpenseScreen = props => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const getExpns = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', global.userid || global.id);

      const response = await fetch(
        'https://fisdemoprojects.com/freshfood/api/view-expense-riders.php',
        {
          method: 'POST',
          body: formdata,
        }
      );
      const result = await response.json();
      if (result?.Expenses) {
        setData(result.Expenses);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
      setData([]);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getExpns();
    }
  }, [isFocused, getExpns]);

  const renderItem = ({ item }) => (
    <ExpenseCard
      cashinhand={item.expenses}
      price={item.price}
      source={require('../../Assets/Images/petrol.png')}
    />
  );

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
        <Text style={styles.headerTitle}>Expenses</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.flexFill}>
          <Text style={styles.headStyle}>Latest Spending</Text>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icons.Feather name="dollar-sign" size={42} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Expenses Recorded</Text>
                <Text style={styles.emptySubtitle}>
                  Tap the plus button below to log your first business expense.
                </Text>
              </View>
            }
          />
        </Animatable.View>
      </View>

      <TouchableOpacity
        style={styles.fabBtn}
        activeOpacity={0.85}
        onPress={() => props.navigation.navigate('add_expense')}>
        <Icons.Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  flexFill: {
    flex: 1,
  },
  headStyle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  fabBtn: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
