import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';

import CstmHeader from '../../Components/CustomHeader';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import InputSarchFiltr from '../../Components/InputSearchFilter';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const FndExprt = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialData = route.params?.data || [];

  const [expertProviders, setExpertProviders] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [modalTitle, setModalTitle] = useState('Filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const accounts = [
    { id: '1', name: 'Verified' },
    { id: '2', name: 'Non Verified' },
  ];

  const getLocationData = useCallback(async () => {
    try {
      const serviceName = expertProviders[0]?.service_name || initialData[0]?.service_name;
      if (!serviceName) return;

      const formdata = new FormData();
      formdata.append('select_bussiness', serviceName);

      const response = await fetch(`${BASIC_URL}user/get_location.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.provider_location) {
        setLocations(result.provider_location);
      } else if (result?.error) {
        showToast(result.error);
      }
    } catch (error) {
      console.log('Error fetching locations:', error);
    }
  }, [expertProviders, initialData]);

  useEffect(() => {
    getLocationData();
  }, [getLocationData]);

  const filteredData = expertProviders.filter(item =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredData.slice().sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );

  const toggleModal = () => {
    setModalVisible(prev => !prev);
    setShowLocation(false);
    setShowAccount(false);
  };

  const toggleBack = () => {
    setShowLocation(false);
    setShowAccount(false);
  };

  const toggleLocation = () => {
    setShowLocation(true);
    setModalTitle('Location');
  };

  const toggleAccount = () => {
    setShowAccount(true);
    setModalTitle('Account');
  };

  const handleAccount = value => {
    setSelectedAccount(value);
  };

  const handleLocation = value => {
    setSelectedLocation(value);
  };

  const applyFilter = async () => {
    try {
      const jobName = initialData[0]?.service_name;
      if (!jobName) return;

      const formdata = new FormData();
      formdata.append('job', jobName);
      formdata.append('user_id', global.id);

      const response = await fetch(`${BASIC_URL}user/providers_job.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.add_skills) {
        setExpertProviders(result.add_skills);
      } else if (result?.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.log('Error applying filter:', error);
    }
  };

  const addToFavourite = async item => {
    try {
      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('provider_id', item.id);
      formdata.append('provider_name', item.name);
      formdata.append('rating', item.averageRating?.toFixed(2) || '0.00');
      formdata.append('total_jobs', item.totaljob);
      formdata.append('distance', item.distance);
      formdata.append('profile', item.image);
      formdata.append('service_name', item.service_name);

      const response = await fetch(`${BASIC_URL}user/favorite_providers.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.status) {
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (error) {
      console.log('Error adding favorite:', error);
    }
  };

  const renderLocationItem = ({ item }) => (
    <View style={styles.listCont}>
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => {
          handleLocation(item.address);
          toggleBack();
        }}>
        <Text style={styles.itemName}>{item.address}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAccountItem = ({ item }) => (
    <View style={styles.listCont}>
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => {
          handleAccount(item.name);
          toggleBack();
        }}>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExpertItem = ({ item }) => {
    const imageUrl = `${BASIC_URL}uploads/${item.image}`;
    const avgRating = typeof item.averageRating === 'number' ? item.averageRating.toFixed(2) : '0.00';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ExpertDetail', { item })}
        style={styles.textContainer}>
        <Image
          style={styles.logoImg}
          resizeMode="cover"
          source={
            item.image
              ? { uri: imageUrl }
              : require('../../Assets/Images/user.jpg')
          }
        />

        <View style={styles.profileCont}>
          <View style={[styles.openingStyle, styles.titleCont]}>
            <View style={styles.nameCont}>
              <Text style={styles.TextStyle}>{item.name}</Text>
              {item.verified === 'Verified' ? (
                <Icons.FontAwesome5
                  name="user-check"
                  color={color.blu}
                  size={14}
                />
              ) : null}
            </View>

            <TouchableOpacity onPress={() => addToFavourite(item)}>
              <Icons.FontAwesome
                name="bookmark-o"
                color={color.defalt}
                size={22}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.openingStyle}>
            <View style={styles.statCol}>
              <Text style={styles.msgTitle}>Rating</Text>
              <View style={styles.starCont}>
                <Icons.FontAwesome name="star" color={color.ylow} size={14} />
                <Text style={[styles.msgTitle, styles.ratingText]}>
                  {avgRating}
                </Text>
              </View>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.msgTitle}>Total jobs</Text>
              <Text style={styles.statVal}>{item.totaljob}</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.msgTitle}>Experience</Text>
              <Text style={styles.statVal}>{item.experience} Yrs</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const serviceTitle = initialData[0]?.service_name || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title={`Find Expert ${serviceTitle}`}
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.searchStyle}>
        <InputSarchFiltr
          toggleModal={toggleModal}
          onChangeText={val => setSearchTerm(val)}
          value={searchTerm}
        />
      </View>

      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderExpertItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No experts found</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              {showLocation || showAccount ? (
                <>
                  <TouchableOpacity
                    style={[styles.cancelCont, styles.leftCancel]}
                    onPress={toggleBack}>
                    <Icons.FontAwesome5
                      name="angle-left"
                      color={color.wite}
                      size={22}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{modalTitle}</Text>
                </>
              ) : (
                <Text style={styles.modalTitle}>Filter</Text>
              )}

              <TouchableOpacity style={styles.cancelCont} onPress={toggleModal}>
                <Icons.FontAwesome5
                  name="times"
                  color={color.wite}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {!showLocation && !showAccount ? (
                <View style={styles.jobsCont}>
                  <Text style={styles.jobTitle}>Location</Text>
                  <TouchableOpacity
                    style={styles.cancelCont}
                    onPress={toggleLocation}>
                    <Text style={styles.filterText} numberOfLines={1}>
                      {selectedLocation || 'View All'}
                    </Text>
                    <Icons.FontAwesome
                      name="angle-right"
                      color={color.blak}
                      size={22}
                      style={styles.angleRight}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              {showLocation && (
                <View style={styles.flatCont}>
                  <FlatList
                    data={locations}
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => `location_${index}`}
                    numColumns={2}
                  />
                </View>
              )}

              {!showLocation && !showAccount ? (
                <View style={styles.jobsCont}>
                  <Text style={styles.jobTitle}>Account</Text>
                  <TouchableOpacity
                    style={styles.cancelCont}
                    onPress={toggleAccount}>
                    <Text style={styles.filterText} numberOfLines={1}>
                      {selectedAccount || 'View All'}
                    </Text>
                    <Icons.FontAwesome
                      name="angle-right"
                      color={color.blak}
                      size={22}
                      style={styles.angleRight}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              {showAccount && (
                <View style={styles.flatCont}>
                  <FlatList
                    data={accounts}
                    renderItem={renderAccountItem}
                    keyExtractor={(item, index) => `account_${index}`}
                    numColumns={2}
                  />
                </View>
              )}
            </View>

            <BotonComp
              onPressFunc={() => {
                applyFilter();
                toggleModal();
              }}
              BtnStyle={styles.BtnStyle}
              btnText="Apply"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FndExprt;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 15,
    color: color.gry,
  },
  profileCont: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: color.wite,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextStyle: {
    fontSize: 16,
    color: color.blak,
    fontWeight: '700',
    marginRight: 6,
  },
  msgTitle: {
    fontSize: 12,
    color: color.gry,
    textAlign: 'center',
  },
  statVal: {
    fontSize: 13,
    color: color.blak,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    color: color.blak,
  },
  statCol: {
    alignItems: 'center',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoImg: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },
  titleCont: {
    paddingBottom: 10,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 12,
    width: '85%',
    backgroundColor: color.wite,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelCont: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftCancel: {
    left: 12,
    right: undefined,
  },
  modalTitle: {
    fontSize: 18,
    color: color.wite,
    fontWeight: '600',
  },
  modalBody: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  jobsCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: color.gry,
    paddingBottom: 8,
    marginVertical: 10,
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: color.defalt,
  },
  filterText: {
    color: color.blak,
    fontSize: 13,
  },
  angleRight: {
    marginLeft: 6,
  },
  flatCont: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
  },
  BtnStyle: {
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  listCont: {
    flex: 0.5,
    padding: 4,
  },
  itemStyle: {
    backgroundColor: color.litOrng,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  itemName: {
    color: color.wite,
    textAlign: 'center',
    fontSize: 12,
  },
});