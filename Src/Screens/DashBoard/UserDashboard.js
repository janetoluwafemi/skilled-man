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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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

  const scrollContentFlattened = StyleSheet.flatten([
    styles.scrollContent,
    { paddingBottom: bottomPadding },
  ]);

  return (
    <SafeAreaView style={styles.flexContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

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
        </View>
      ) : (
        <ScrollView
          style={styles.scrollStyle}
          contentContainerStyle={scrollContentFlattened}
          showsVerticalScrollIndicator={false}>
          <View style={styles.innerSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Services</Text>
              <Text style={styles.sectionSubtitle}>
                Choose a category to find certified artisans
              </Text>
            </View>

            <View style={styles.gridContainer}>
              {filteredData.length > 0 ? (
                filteredData.map((itemdata, ind) => (
                  <View
                    key={itemdata?.id?.toString() || ind.toString()}
                    style={styles.gridItemWrapper}>
                    <SrvicCrd
                      showProfile={() => fetchSpecificData(itemdata?.select_bussiness)}
                      serviceTitle={itemdata?.select_bussiness || 'Service'}
                      iconUrl={`${BASIC_URL}uploads/${itemdata?.image || ''}`}
                    />
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <View style={styles.emptyIconCircle}>
                    {Icons?.Feather && (
                      <Icons.Feather name="search" size={28} color="#94A3B8" />
                    )}
                  </View>
                  <Text style={styles.noDataText}>No services found</Text>
                  <Text style={styles.noDataSubtext}>
                    Try searching with another keyword
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Disclaimer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrapper}>
                {Icons?.Feather && (
                  <Icons.Feather name="shield" size={20} color={color.defalt} />
                )}
              </View>
              <Text style={styles.modalTitle}>Disclaimer Notice</Text>
              <Text style={styles.modalSubheading}>
                Please review terms before connecting with artisans
              </Text>
            </View>

            <View style={styles.modalBody}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.disclaimerScroll}>
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
                  artisans.{'\n\n'}
                  We do not endorse or take responsibility for the accuracy,
                  reliability, or legality of any content, products, or services
                  provided by artisans on the platform. Users are advised to
                  exercise their own discretion and judgment before engaging in
                  any transactions.{'\n\n'}
                  Skilledman App is not liable for any direct, indirect,
                  incidental, special, or consequential damages that may arise
                  from the use of the platform, including, but not limited to,
                  losses incurred from transactions with artisans.{'\n\n'}
                  Users are responsible for conducting their own due diligence,
                  including verifying the credentials, qualifications, and
                  background of artisans before engaging in any business
                  transactions.{'\n\n'}
                  We reserve the right to suspend, terminate, or modify any part
                  of the platform without prior notice. We are not liable for
                  any damages or losses resulting from such actions.{'\n\n'}
                  By using the Skilledman App, you acknowledge that you have
                  read and understood this disclaimer and agree to be bound by
                  its terms. If you do not agree with any part of this
                  disclaimer, please refrain from using the Skilledman
                  application.
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserDashboard;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  innerSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  gridItemWrapper: {
    width: '48.5%',
    marginBottom: 12,
  },
  noDataContainer: {
    width: '100%',
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalView: {
    borderRadius: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '76%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)' }
      : {
        elevation: 6,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      }),
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  modalIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
    flex: 1,
  },
  disclaimerScroll: {
    maxHeight: height * 0.38,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  disclaimerText: {
    color: '#475569',
    textAlign: 'left',
    lineHeight: 21,
    fontSize: 13,
  },
  btnContainer: {
    width: '100%',
    marginTop: 18,
  },
  acceptStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)' }
      : {
        elevation: 3,
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }),
  },
  btnTextStyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});