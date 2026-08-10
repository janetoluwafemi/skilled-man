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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import color from '../../Assets/colors/colors';
import HeaderWSarchFiltr from '../../Components/HeaderWithSearchFilter';
import SrvicCrd from '../../Components/ServiceCard';
import BotonComp from '../../Components/BtnComp';
import { useAuth } from '../../context/AuthProvider';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const UsrDshbord = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skill, setSkill] = useState([]);

  const fetchSpecificData = async value => {
    try {
      const formdata = new FormData();
      formdata.append('job', value);
      formdata.append('user_id', global.id);

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
      const response = await fetch(`${BASIC_URL}get_services.php`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result && result.add_skills) {
        setSkill(result.add_skills);
      } else if (result?.error) {
        Alert.alert(
          'Error',
          typeof result.error === 'string'
            ? result.error
            : String(result.error)
        );
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  }, []);

  useEffect(() => {
    if (state?.isAuth) {
      setModalVisible(true);
    }
    getOverallServices();
  }, [state?.isAuth, getOverallServices]);

  const filteredData = skill.filter(item =>
    item?.select_bussiness?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bottomPadding =
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  return (
    <View style={styles.flexContainer}>
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

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredData.map((itemdata, ind) => (
            <SrvicCrd
              key={ind}
              showProfile={() => fetchSpecificData(itemdata.select_bussiness)}
              serviceTitle={itemdata.select_bussiness}
              iconUrl={`${BASIC_URL}uploads/${itemdata.image}`}
            />
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Disclaimer Notice</Text>
            </View>

            <View style={styles.modalBody}>
              <ScrollView showsVerticalScrollIndicator={false}>
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
                  btnText="Agree"
                  onPressFunc={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsrDshbord;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollStyle: {
    paddingHorizontal: 15,
    paddingTop: 15,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    borderRadius: 12,
    width: '100%',
    maxHeight: '75%',
    backgroundColor: color.wite,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: color.wite,
    fontWeight: '700',
  },
  modalBody: {
    padding: 15,
    flex: 1,
  },
  disclaimerText: {
    color: '#334155',
    textAlign: 'justify',
    lineHeight: 22,
    fontSize: 13,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  acceptStyle: {
    width: '100%',
  },
  btnTextStyle: {
    fontSize: 14,
  },
});