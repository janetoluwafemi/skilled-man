import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  Modal,
  StatusBar,
  ActivityIndicator } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import HeaderWSarchFiltr from '../../Components/HeaderWithSearchFilter';
import SrvicCrd from '../../Components/ServiceCard';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { useAuth } from '../../context/AuthProvider';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const UserDashboard = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skill, setSkill] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecificData = async value => {
    try {
      const formdata = new FormData();
      formdata.append('job', value);
      formdata.append('user_id', global.id || '255');

      const response = await fetch(`${BASIC_URL}user/providers_job.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result && result.add_skills) {
        navigation.navigate('FindExpert', { data: result.add_skills });
      } else if (result?.error) {
        Alert.alert(
            'Error',
            typeof result.error === 'string'
                ? result.error
                : String(result.error)
        );
      }
    } catch (error) {
      console.log('Error fetching specific services:', error);
    }
  };

  const getOverallServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASIC_URL}get_services.php`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result && Array.isArray(result.add_skills)) {
        setSkill(result.add_skills);
      } else if (result && Array.isArray(result)) {
        setSkill(result);
      } else {
        setSkill([]);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
      setSkill([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state?.isAuth) {
      setModalVisible(true);
    }
    getOverallServices();
  }, [state?.isAuth, getOverallServices]);

  const filteredData = Array.isArray(skill)
      ? skill.filter(item =>
          item?.select_bussiness?.toLowerCase().includes((searchTerm || '').toLowerCase())
      )
      : [];

  const bottomPadding =
      height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 24;

  return (
      <SafeAreaView style={styles.safeContainer} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={color.defalt} />

        <HeaderWSarchFiltr
            onPress={() => navigation.openDrawer()}
            onPressNotifiction={() => navigation.navigate('notification_screen')}
            onPressProfile={() => navigation.navigate('editUserProfile')}
            titleText="What service are you searching for?"
            bellIcon="bell"
            onChangeText={val => setSearchTerm(val)}
            value={searchTerm}
            screen="user"
        />

        {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color={color.defalt} />
              <Text style={styles.loadingText}>Fetching available services...</Text>
            </View>
        ) : (
            <ScrollView
                style={styles.scrollStyle}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
                showsVerticalScrollIndicator={false}>

              <Animatable.View
                  animation="fadeInUp"
                  duration={600}
                  style={styles.cardContainer}>

                <View style={styles.headerCentered}>
                  <View style={styles.topIndicatorPill} />
                  <Text style={styles.sectionTitle}>Available Services</Text>
                  <Text style={styles.sectionSubtitle}>
                    Choose a category to find certified artisans near you
                  </Text>
                </View>

                <View style={styles.gridContainer}>
                  {filteredData.length > 0 ? (
                      filteredData.map((itemdata, ind) => (
                          <Animatable.View
                              key={itemdata?.id?.toString() || ind.toString()}
                              animation="zoomIn"
                              duration={450}
                              delay={Math.min(ind * 50, 700)}
                              useNativeDriver
                              style={styles.gridItemWrapper}>
                            <View style={styles.centerCardWrap}>
                              <SrvicCrd
                                  showProfile={() => fetchSpecificData(itemdata?.select_bussiness)}
                                  serviceTitle={itemdata?.select_bussiness || 'Service'}
                                  iconUrl={`${BASIC_URL}uploads/${itemdata?.image || ''}`}
                              />
                            </View>
                          </Animatable.View>
                      ))
                  ) : (
                      <Animatable.View animation="fadeIn" duration={400} style={styles.noDataContainer}>
                        <View style={styles.emptyIconCircle}>
                          <Icons.Feather name="search" size={26} color="#94A3B8" />
                        </View>
                        <Text style={styles.noDataText}>No services found</Text>
                        <Text style={styles.noDataSubtext}>
                          Try searching with another keyword
                        </Text>
                      </Animatable.View>
                  )}
                </View>
              </Animatable.View>
            </ScrollView>
        )}

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Animatable.View animation="zoomIn" duration={350} style={styles.modalView}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconWrapper}>
                  {Icons?.Feather && (
                      <Icons.Feather name="shield" size={24} color={color.defalt} />
                  )}
                </View>
                <Text style={styles.modalTitle}>Disclaimer Notice</Text>
                <Text style={styles.modalSubheading}>
                  Please review terms before continuing
                </Text>
              </View>

              <View style={styles.modalBody}>
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={styles.disclaimerScroll}
                    contentContainerStyle={styles.disclaimerScrollContent}>
                  <Text style={styles.disclaimerText}>
                    The following disclaimer outlines the terms of use for the
                    Skilledman App, a platform designed to connect artisans and
                    users.{'\n\n'}
                    By accessing or using the Skilledman application, you agree to
                    comply with the terms and conditions outlined below. The app
                    serves as a medium for facilitating communication and
                    transactions between artisans and users. We do not take
                    responsibility for the quality, guarantee, pricing, delivery,
                    or any other aspect of the products or services offered by
                    artisans.
                  </Text>
                </ScrollView>

                <View style={styles.btnContainer}>
                  <BotonComp
                      BtnStyle={styles.acceptStyle}
                      btnTextStyle={styles.btnTextStyle}
                      btnText="I Understand & Agree"
                      onPressFunc={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </Animatable.View>
          </View>
        </Modal>
      </SafeAreaView>
  );
};

export default UserDashboard;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: color.defalt,
  },
  scrollStyle: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 12,
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
  },
  topIndicatorPill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerCentered: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItemWrapper: {
    width: '46%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  centerCardWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  centerLoading: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  noDataContainer: {
    width: '100%',
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 4,
  },
  noDataSubtext: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 22,
    width: '100%',
    maxWidth: 420,
    height: Math.min(height * 0.72, 520),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  modalIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F7ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 19,
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubheading: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    flex: 1,
    justifyContent: 'space-between',
  },
  disclaimerScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginVertical: 12,
  },
  disclaimerScrollContent: {
    padding: 14,
  },
  disclaimerText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19.5,
  },
  btnContainer: {
    width: '100%',
  },
  acceptStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
  },
  btnTextStyle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

