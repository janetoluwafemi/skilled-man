import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import FltLstCrd from '../../Components/FlatListCard';
import {BASIC_URL} from '../Signin/Signin';

const {height} = Dimensions.get('window');

const HistryScren = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
    20;

  const getData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('status', 'complete');

      const response = await fetch(`${BASIC_URL}provider_status.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.booking_request) {
        setData(result.booking_request);
      } else if (result?.error) {
        showToast(result.error);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || String(error) || 'An error occurred',
      );
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader title="History" onPressBack={() => navigation.goBack()} />

      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item.booking_id?.toString() || index.toString()
        }
        contentContainerStyle={StyleSheet.flatten([
          styles.cardContainer,
          {paddingBottom: bottomPadding},
        ])}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <FltLstCrd
            cardTitle={item.name}
            bookingId={`Booking ID - ${item.booking_id}`}
            date={item.service_date}
            time={item.service_time}
            paidTitle="Paid"
            status={item.status}
            filepress={item.file}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history records found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HistryScren;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: color.gry,
    fontWeight: '500',
  },
});
