import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from '@react-native-community/datetimepicker';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import InputSarchFiltr from '../../Components/InputSearchFilter';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';
import { getProviderId, isActiveFavorite } from '../../utilis/favoriteUtils';

const { height, width } = Dimensions.get('window');

const FindExpert = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const focus = useIsFocused();
  const initialData = useMemo(() => route.params?.data || [], [route.params?.data]);

  const [expertProviders, setExpertProviders] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [modalTitle, setModalTitle] = useState('Filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [favorites, setFavorites] = useState({});

  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [fullName, setFullName] = useState(global.name || '');
  const [phoneNumber, setPhoneNumber] = useState(global.phone_number || '');
  const [address, setAddress] = useState(global.address || '');
  const [selectedfile, setSelectedFile] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const accounts = [
    { id: '1', name: 'Verified' },
    { id: '2', name: 'Non Verified' },
  ];

  const serviceTitle = initialData[0]?.service_name || 'Service';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const formdata = new FormData();
        formdata.append('user_id', global.id);

        const response = await fetch(`${BASIC_URL}user/get_favorite_provider.php`, {
          method: 'POST',
          body: formdata,
        });

        const result = await response.json();
        if (result?.favorite_providers) {
          const favMap = {};
          result.favorite_providers.forEach(fav => {
            if (isActiveFavorite(fav)) {
              favMap[getProviderId(fav)] = true;
            }
          });
          setFavorites(favMap);
        }
      } catch (error) {
        console.log('Error fetching favorites:', error);
      }
    };

    if (focus) {
      fetchFavorites();
    }
  }, [focus]);

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
      }
    } catch (error) {
      console.log('Error fetching locations:', error);
    }
  }, [expertProviders, initialData]);

  useEffect(() => {
    getLocationData();
  }, [getLocationData]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name || `IMG_${Date.now()}.jpg`,
          type: result.assets[0].mimeType || 'image/jpeg',
        });
      }
    } catch (error) {
      console.log('Error picking document', error);
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const camFile = result.assets[0];
        setSelectedFile({
          uri: camFile.uri,
          name: camFile.fileName || `IMG_${Date.now()}.jpg`,
          type: camFile.mimeType || 'image/jpeg',
        });
      }
    } catch (error) {
      console.log('Error using camera', error);
    }
  };

  const handleBookingConfirm = async () => {
    if (!selectedfile || !selectedfile.uri) {
      Alert.alert('Photo Required', 'Please attach a photo before confirming your booking.');
      return;
    }
    setIsPending(true);

    try {
      const formdata = new FormData();
      formdata.append('user_id', String(global.id || '256'));
      formdata.append('provider_id', ''); // Blank for open broadcast to all providers
      formdata.append('service_name', serviceTitle);
      formdata.append('service_date', date.toISOString().split('T')[0]);
      formdata.append('service_time', '12:00 PM');
      formdata.append('servic_phone_no', phoneNumber);
      formdata.append('address', address);

      if (selectedfile) {
        if (Platform.OS === 'web') {
          const fileBlobResponse = await fetch(selectedfile.uri);
          const blob = await fileBlobResponse.blob();
          formdata.append('file', blob, selectedfile.name || `IMG_${Date.now()}.jpg`);
        } else {
          formdata.append('file', {
            uri: selectedfile.uri,
            name: selectedfile.name || `IMG_${Date.now()}.jpg`,
            type: selectedfile.type || 'image/jpeg',
          });
        }
      }

      const response = await fetch(`${BASIC_URL}user/book_service.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();

      if (result?.success || result?.status === 'success' || result?.status?.toLowerCase().includes('successfully')) {
        setBookingModalVisible(false);
        showToast('Open broadcast request sent to experts!');
        setIsPending(false);
      } else {
        setIsPending(false);
        Alert.alert('Error', result?.error || result?.status || 'Failed to send request.');
      }
    } catch (error) {
      setIsPending(false);
      console.log('Booking error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    }
  };

  const filteredData = expertProviders.filter(item =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedData = filteredData
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(item => {
        const expertId = getProviderId(item);
        const isFav = !!favorites[expertId];
        return { ...item, is_favorite: isFav };
      });

  const toggleModal = () => {
    setModalVisible(prev => !prev);
    setShowLocation(false);
    setShowAccount(false);
  };

  const toggleBack = () => {
    setShowLocation(false);
    setShowAccount(false);
  };

  const toggleFavourite = async (item, currentId, isFav) => {
    setFavorites(prev => {
      const updatedFavs = { ...prev };
      if (isFav) delete updatedFavs[currentId];
      else updatedFavs[currentId] = true;
      return updatedFavs;
    });

    try {
      const formdata = new FormData();
      if (!isFav) {
        formdata.append('user_id', global.id);
        formdata.append('provider_id', currentId);
        formdata.append('provider_name', item.name);
        formdata.append('rating', item.averageRating?.toFixed(2) || '0.00');
        formdata.append('total_jobs', item.totaljob || item.total_jobs || 0);
        formdata.append('profile', item.image || '');
        formdata.append('service_name', item.service_name || '');
        await fetch(`${BASIC_URL}user/favorite_providers.php`, { method: 'POST', body: formdata });
        showToast('Added to favorites');
      } else {
        formdata.append('user_id', global.id);
        formdata.append('provider_id', currentId);
        formdata.append('status', '0');
        await fetch(`${BASIC_URL}user/favorite_status_update.php`, { method: 'POST', body: formdata });
        showToast('Removed from favorites');
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const renderExpertItem = ({ item }) => {
    const currentId = getProviderId(item);
    const isFav = item.is_favorite;
    const avgRating = typeof item.averageRating === 'number' ? item.averageRating.toFixed(2) : '0.00';

    return (
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ExpertDetail', { item })} style={styles.expertCard}>
          <Image style={styles.providerImg} resizeMode="cover" source={item.image ? { uri: `${BASIC_URL}uploads/${item.image}` } : require('../../Assets/Images/user.jpg')} />
          <View style={styles.providerCardInfo}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.providerCardName} numberOfLines={1}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleFavourite(item, currentId, isFav)} style={styles.favBadge}>
                <Icons.FontAwesome name="bookmark" color={isFav ? color.defalt : '#CBD5E1'} size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.metaBadgeRow}>
              <View style={styles.statBadge}>
                <Icons.FontAwesome name="star" color="#F59E0B" size={12} />
                <Text style={styles.statBadgeText}>{avgRating}</Text>
              </View>
              <View style={styles.statBadge}>
                <Icons.Feather name="check-circle" color="#64748B" size={12} />
                <Text style={styles.statBadgeText}>{item.totaljob || item.total_jobs || 0} Jobs</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowBtn}>
            <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInUp" duration={600} style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>{serviceTitle ? `Experts: ${serviceTitle}` : 'Find Experts'}</Text>
          <Text style={styles.welcomeSubtitle}>Browse top-rated professionals or broadcast a request.</Text>

          <View style={styles.searchSection}>
            <InputSarchFiltr toggleModal={toggleModal} onChangeText={val => setSearchTerm(val)} value={searchTerm} />
          </View>

          <FlatList
              data={sortedData}
              extraData={favorites}
              keyExtractor={(item, index) => `expert_${item.id || item.provider_id || index}_${index}`}
              renderItem={renderExpertItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icons.Feather name="users" size={32} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No Experts Found</Text>
                </View>
              }
          />
        </Animatable.View>

        <View style={styles.floatingBtnContainer}>
          <TouchableOpacity style={styles.floatingBroadcastBtn} onPress={() => setBookingModalVisible(true)} activeOpacity={0.9}>
            <Icons.Feather name="send" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.floatingBroadcastText}>Post Open Request</Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" visible={bookingModalVisible} onRequestClose={() => setBookingModalVisible(false)}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)} style={styles.backArrowBtn}>
                <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.formContainer}>
                  <Text style={styles.welcomeTitle}>Request {serviceTitle}</Text>
                  <Text style={styles.welcomeSubtitle}>Broadcast this job to all available experts in this category.</Text>

                  <View style={styles.cardWrapper}>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Your Full Name</Text>
                      <View style={styles.inputContainer}>
                        <Icons.Feather name="user" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                        <TextInput style={styles.inputStyle} placeholder="John Doe" value={fullName} onChangeText={setFullName} editable={!isPending} />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Phone Number</Text>
                      <View style={styles.inputContainer}>
                        <Icons.Feather name="phone" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                        <TextInput style={styles.inputStyle} placeholder="08012345678" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" editable={!isPending} />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Service Date</Text>
                      <TouchableOpacity style={styles.inputContainer} onPress={() => { if (Platform.OS !== 'web' && !isPending) setOpenDate(true); }}>
                        <Icons.Feather name="calendar" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                        <View pointerEvents="none" style={{ flex: 1 }}>
                          <TextInput style={styles.inputStyle} value={date.toISOString().split('T')[0]} editable={false} />
                        </View>
                      </TouchableOpacity>
                      {openDate && Platform.OS !== 'web' && (
                          <DatePicker value={date} mode="date" onChange={(e, selected) => { setOpenDate(false); if (selected) setDate(selected); }} />
                      )}
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Address</Text>
                      <View style={styles.inputContainer}>
                        <Icons.Feather name="map-pin" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                        <TextInput style={styles.inputStyle} placeholder="123 Main Street" value={address} onChangeText={setAddress} editable={!isPending} />
                      </View>
                    </View>

                    <View style={styles.mediaUploadRow}>
                      <TouchableOpacity style={[styles.uploadOptionBtn, styles.firstUploadOption]} onPress={handleFilePick} disabled={isPending}>
                        <Icons.Feather name="image" size={16} color={color.defalt} />
                        <Text style={styles.uploadOptionText}>Select Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.uploadOptionBtn} onPress={handleCamera} disabled={isPending}>
                        <Icons.Feather name="camera" size={16} color={color.defalt} />
                        <Text style={styles.uploadOptionText}>Use Camera</Text>
                      </TouchableOpacity>
                    </View>

                    {selectedfile && (
                        <View style={styles.selectedMediaCard}>
                          <Image source={{ uri: selectedfile.uri }} style={styles.previewImage} resizeMode="cover" />
                        </View>
                    )}

                    <TouchableOpacity style={[styles.submitBtn, (!selectedfile || isPending) && styles.btnDisabled]} disabled={!selectedfile || isPending} onPress={handleBookingConfirm}>
                      <Text style={styles.submitBtnText}>{isPending ? 'Sending Broadcast...' : 'Post Open Request'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
  );
};

export default FindExpert;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBar: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' },
  backArrowBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 1, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 4 },
  welcomeTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', letterSpacing: -0.3 },
  welcomeSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 16, marginTop: 4, lineHeight: 20 },
  searchSection: { marginBottom: 12 },
  listContainer: { paddingTop: 4, paddingBottom: 100, flexGrow: 1 },
  expertCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEF2F6', elevation: 2 },
  providerImg: { width: 60, height: 60, borderRadius: 16, marginRight: 12 },
  providerCardInfo: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  providerCardName: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  favBadge: { padding: 4 },
  metaBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  statBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  statBadgeText: { fontSize: 11, fontWeight: '700', color: '#334155', marginLeft: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginTop: 16 },
  floatingBtnContainer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 20, left: 20, right: 20 },
  floatingBroadcastBtn: { backgroundColor: color.defalt, flexDirection: 'row', borderRadius: 16, paddingVertical: 18, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: color.defalt, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  floatingBroadcastText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  formContainer: { paddingHorizontal: 20, paddingTop: 4 },
  cardWrapper: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, elevation: 2, marginBottom: 16 },
  fieldGroup: { marginBottom: 14, width: '100%' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12 },
  inputIconLeft: { marginRight: 10 },
  inputStyle: { flex: 1, paddingVertical: 11, fontSize: 14, color: '#0F172A', fontWeight: '500' },
  mediaUploadRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  firstUploadOption: { marginRight: 10 },
  uploadOptionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 12 },
  uploadOptionText: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginLeft: 6 },
  selectedMediaCard: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 10, marginVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  previewImage: { width: '100%', height: 140, borderRadius: 10 },
  submitBtn: { width: '100%', backgroundColor: color.defalt, borderRadius: 14, paddingVertical: 14, marginTop: 10, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  btnDisabled: { backgroundColor: '#94A3B8', opacity: 0.7, elevation: 0 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});