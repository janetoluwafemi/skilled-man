import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';

import HeaderWSearchFilter from '../../Components/HeaderWithSearchFilter';
import SavCrd from '../../Components/SaveCard';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const SaveScreen = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [favoriteList, setFavoriteList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const removeFavoriteItem = async (pid) => {
    const updatedList = favoriteList.filter(item => item.provider_id !== pid);
    setFavoriteList(updatedList);

    try {
      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('provider_id', pid);
      formdata.append('status', '0');

      const response = await fetch(`${BASIC_URL}user/favorite_status_update.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log('Error updating favorite status:', error);
    }
  };

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const formdata = new FormData();
        formdata.append('user_id', global.id);

        const response = await fetch(`${BASIC_URL}user/get_favorite_provider.php`, {
          method: 'POST',
          body: formdata,
        });

        const result = await response.json();
        if (result?.favorite_providers) {
          setFavoriteList(result.favorite_providers);
        } else if (result?.error) {
          console.log(result.error);
        }
      } catch (error) {
        console.log('Error fetching favorite providers:', error);
      }
    };

    if (focus) {
      getFavorites();
    }
  }, [focus]);

  const filteredData = favoriteList.filter(item =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bottomPadding = (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        <HeaderWSearchFilter
            onPress={() => navigation.openDrawer()}
            onPressNotifiction={() => navigation.navigate('notification_screen')}
            onPressProfile={() => navigation.navigate('editUserProfile')}
            titleText="What are you looking for?"
            bellIcon="bell"
            onChangeText={val => setSearchTerm(val)}
            value={searchTerm}
            screen="user"
        />

        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => item.provider_id?.toString() || index.toString()}
            renderItem={({ item }) => (
                <SavCrd
                    item={item}
                    showProfile={() =>
                        navigation.navigate('IndividualChat', { currentuser: item })
                    }
                    cardTitle={item.name}
                    time="12:00 AM"
                    msgTitle="Total Jobs"
                    totJobs={item.total_jobs}
                    imgUrl={`${BASIC_URL}uploads/${item.image}`}
                    approvedIcon="user-check"
                    bookMarkIcon="bookmark"
                    ratingTitle="Rating"
                    totRat={item.rating}
                    removefavouritem={removeFavoriteItem}
                    save={true}
                />
            )}
            contentContainerStyle={StyleSheet.flatten([
              styles.cardContainer,
              { paddingBottom: bottomPadding },
            ])}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icons.Feather name="bookmark" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Saved Providers</Text>
                <Text style={styles.emptySubtitle}>
                  Providers you bookmark for quick access will appear here.
                </Text>
              </View>
            }
        />
      </SafeAreaView>
  );
};

export default SaveScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexGrow: 1,
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
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});