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
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import HeaderWSarchFiltr from '../../Components/HeaderWithSearchFilter';
import SrvicCrd from '../../Components/ServiceCard';
import BotonComp from '../../Components/BtnComp';
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
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUp" duration={600}>
            <View style={styles.gridContainer}>
              {filteredData.length > 0 ? (
                filteredData.map((itemdata, ind) => (
                  <SrvicCrd
                    key={itemdata?.id?.toString() || ind.toString()}
                    showProfile={() => fetchSpecificData(itemdata?.select_bussiness)}
                    serviceTitle={itemdata?.select_bussiness || 'Service'}
                    iconUrl={`${BASIC_URL}uploads/${itemdata?.image || ''}`}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No services found</Text>
                </View>
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
        <View style={styles.modalContainer}>
          <Animatable.View animation="zoomIn" duration={300} style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Disclaimer Notice</Text>
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
          </Animatable.View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  noDataContainer: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 20,
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '800',
  },
  modalBody: {
    padding: 18,
    flex: 1,
  },
  disclaimerScroll: {
    maxHeight: height * 0.4,
  },
  disclaimerText: {
    color: '#475569',
    textAlign: 'left',
    lineHeight: 22,
    fontSize: 13,
  },
  btnContainer: {
    width: '100%',
    marginTop: 16,
  },
  acceptStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnTextStyle: {
    fontSize: 14,
    fontWeight: '700',
  },
});