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
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import InputSarchFiltr from '../../Components/InputSearchFilter';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const FindExpert = props => {
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
    <View style={styles.filterChipCol}>
      <TouchableOpacity
        style={[
          styles.filterSelectChip,
          selectedLocation === item.address && styles.filterSelectChipActive,
        ]}
        onPress={() => {
          handleLocation(item.address);
          toggleBack();
        }}>
        <Text
          numberOfLines={1}
          style={[
            styles.filterSelectChipText,
            selectedLocation === item.address && styles.filterSelectChipTextActive,
          ]}>
          {item.address}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAccountItem = ({ item }) => (
    <View style={styles.filterChipCol}>
      <TouchableOpacity
        style={[
          styles.filterSelectChip,
          selectedAccount === item.name && styles.filterSelectChipActive,
        ]}
        onPress={() => {
          handleAccount(item.name);
          toggleBack();
        }}>
        <Text
          style={[
            styles.filterSelectChipText,
            selectedAccount === item.name && styles.filterSelectChipTextActive,
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderExpertItem = ({ item }) => {
    const imageUrl = `${BASIC_URL}uploads/${item.image}`;
    const avgRating = typeof item.averageRating === 'number' ? item.averageRating.toFixed(2) : '0.00';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ExpertDetail', { item })}
        style={styles.expertCard}>
        <Image
          style={styles.providerImg}
          resizeMode="cover"
          source={
            item.image
              ? { uri: imageUrl }
              : require('../../Assets/Images/user.jpg')
          }
        />

        <View style={styles.providerCardInfo}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.nameVerifiedRow}>
              <Text style={styles.providerCardName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.verified === 'Verified' && (
                <Icons.MaterialIcons
                  name="verified"
                  color={color.defalt}
                  size={15}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => addToFavourite(item)}
              style={styles.favBadge}>
              <Icons.Feather name="bookmark" color={color.defalt} size={17} />
            </TouchableOpacity>
          </View>

          <View style={styles.metaBadgeRow}>
            <View style={styles.statBadge}>
              <Icons.FontAwesome name="star" color="#F59E0B" size={12} />
              <Text style={styles.statBadgeText}>{avgRating}</Text>
            </View>

            <View style={styles.statBadge}>
              <Icons.Feather name="check-circle" color="#64748B" size={12} />
              <Text style={styles.statBadgeText}>{item.totaljob} Jobs</Text>
            </View>

            <View style={styles.statBadge}>
              <Icons.Feather name="briefcase" color="#64748B" size={12} />
              <Text style={styles.statBadgeText}>{item.experience} Yrs</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const serviceTitle = initialData[0]?.service_name || '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <Animatable.View animation="fadeInUp" duration={600} style={styles.contentContainer}>
        <Text style={styles.welcomeTitle}>
          {serviceTitle ? `Experts: ${serviceTitle}` : 'Find Experts'}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Browse top-rated professionals and filter by location or status.
        </Text>

        <View style={styles.searchSection}>
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
              <View style={styles.emptyIconCircle}>
                <Icons.Feather name="users" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Experts Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search criteria or filter options.
              </Text>
            </View>
          }
        />
      </Animatable.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              {showLocation || showAccount ? (
                <TouchableOpacity
                  style={styles.modalNavBtn}
                  onPress={toggleBack}>
                  <Icons.Feather name="arrow-left" color="#0F172A" size={20} />
                </TouchableOpacity>
              ) : null}

              <Text style={styles.modalTitleText}>
                {showLocation || showAccount ? modalTitle : 'Filter Providers'}
              </Text>

              <TouchableOpacity style={styles.modalCloseIcon} onPress={toggleModal}>
                <Icons.Ionicons name="close-circle" color="#94A3B8" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBodyContent}>
              {!showLocation && !showAccount ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.filterTile}
                    onPress={toggleLocation}>
                    <View>
                      <Text style={styles.filterTileLabel}>Location</Text>
                      <Text style={styles.filterTileValue}>
                        {selectedLocation || 'All Locations'}
                      </Text>
                    </View>
                    <Icons.Feather name="chevron-right" size={18} color="#94A3B8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.filterTile}
                    onPress={toggleAccount}>
                    <View>
                      <Text style={styles.filterTileLabel}>Account Status</Text>
                      <Text style={styles.filterTileValue}>
                        {selectedAccount || 'All Accounts'}
                      </Text>
                    </View>
                    <Icons.Feather name="chevron-right" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </>
              ) : null}

              {showLocation && (
                <FlatList
                  data={locations}
                  renderItem={renderLocationItem}
                  keyExtractor={(item, index) => `location_${index}`}
                  numColumns={2}
                  contentContainerStyle={{ paddingVertical: 6 }}
                />
              )}

              {showAccount && (
                <FlatList
                  data={accounts}
                  renderItem={renderAccountItem}
                  keyExtractor={(item, index) => `account_${index}`}
                  numColumns={2}
                  contentContainerStyle={{ paddingVertical: 6 }}
                />
              )}
            </View>

            <BotonComp
              onPressFunc={() => {
                applyFilter();
                toggleModal();
              }}
              BtnStyle={styles.applyFilterBtn}
              btnText="Apply Filter"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FindExpert;

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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
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
    marginBottom: 16,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  searchSection: {
    marginBottom: 12,
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 32,
    flexGrow: 1,
  },
  expertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }),
  },
  providerImg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 12,
  },
  providerCardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  favBadge: {
    padding: 4,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 19,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalNavBtn: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  modalTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseIcon: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  modalBodyContent: {
    paddingVertical: 14,
  },
  filterTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  filterTileLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  filterTileValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  filterChipCol: {
    flex: 0.5,
    padding: 4,
  },
  filterSelectChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  filterSelectChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: color.defalt,
  },
  filterSelectChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  filterSelectChipTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },
  applyFilterBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
});