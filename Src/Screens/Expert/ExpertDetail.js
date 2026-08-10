import React, { useEffect, useState, useCallback } from 'react';
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
  Linking,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import BtnDisable from '../../Components/BtnDisable';
import InputBokServices from '../../Components/InputBookService';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const ExprtDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item;

  const provider_id = item?.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [submitReviewVisible, setSubmitReviewVisible] = useState(false);
  const [singleReviewModal, setSingleReviewModal] = useState(false);
  const [allReviewsModal, setAllReviewsModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [fullName, setFullName] = useState(global.name || '');
  const [phoneNumber, setPhoneNumber] = useState(global.phone_number || '');
  const [address, setAddress] = useState(global.address || '');
  const [price, setPrice] = useState('');
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [selectedfile, setSelectedFile] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [load, setLoad] = useState(false);

  const GetSkills = useCallback(async () => {
    if (!item?.id) return;
    try {
      const formdata = new FormData();
      formdata.append('user_id', item.id);

      const response = await fetch(`${BASIC_URL}get_skills.php?user_id=${item.id}`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.business) {
        const skillsArray = Object.values(result.business);
        const filteredSkills = skillsArray.filter(
          s => s?.select_bussiness && s.select_bussiness !== 'Select Business'
        );
        setSkills(filteredSkills);
      }
    } catch (error) {
      console.log('Skill error:', error);
    }
  }, [item?.id]);

  useEffect(() => {
    GetSkills();
  }, [GetSkills]);

  const openInGoogleMaps = () => {
    if (!item?.Address) {
      Alert.alert('Error', 'Address not available');
      return;
    }
    const encodedAddress = encodeURIComponent(item.Address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    Linking.openURL(googleMapsUrl).catch(() =>
      Alert.alert('Error', 'Unable to open Google Maps')
    );
  };

  const openSingleReview = review => {
    setSelectedReview(review);
    setSingleReviewModal(true);
  };

  const openAllReviews = () => {
    setAllReviewsModal(true);
  };

  const toggleModal = () => {
    setModalVisible(prev => !prev);
    setReviewVisible(false);
  };

  const toggleReview = () => {
    setReviewVisible(prev => !prev);
    setModalVisible(false);
  };

  const toggleSubmitReview = () => {
    setSubmitReviewVisible(prev => !prev);
    setReviewVisible(false);
  };

  const handleNavigate = () => {
    navigation.navigate('SelectPaymentMethod', {
      price,
      fullName,
      phoneNumber,
      address,
      date,
      provider_id,
      selectedfile,
    });
  };

  const sendRating = async () => {
    if (!rating) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('rating', rating);
      formdata.append('feedback', feedback);
      formdata.append('provider_id', item?.id);

      const response = await fetch(`${BASIC_URL}user/feedback.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.success) {
        Toast.show(result.success);
        setSubmitReviewVisible(false);
        setReviewVisible(false);
        setFeedback('');
        setRating(0);
      } else if (result?.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      console.log('Error submitting review:', error);
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (result && result[0]) {
        setSelectedFile({
          uri: result[0].uri,
          name: result[0].name || `IMG_${Date.now()}.jpg`,
          type: result[0].type || 'image/jpeg',
        });
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('Error picking document', error);
      }
    }
  };

  const handleCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });

      if (result.assets && result.assets.length > 0) {
        const camFile = result.assets[0];
        setSelectedFile({
          uri: camFile.uri,
          name: camFile.fileName || `IMG_${Date.now()}.jpg`,
          type: camFile.type || 'image/jpeg',
        });
      }
    } catch (error) {
      console.log('Error using camera', error);
    }
  };

  const isAnyFieldEmpty =
    !fullName || !phoneNumber || !date || !address || !price || !selectedfile;

  const renderReviewItem = ({ item: reviewItem, index }) => (
    <TouchableOpacity
      onPress={() => openSingleReview(reviewItem)}
      style={styles.textContainer}
      key={index}>
      <View style={styles.profileCont}>
        <Image
          style={styles.logoImg}
          resizeMode="cover"
          source={{
            uri: reviewItem?.profile
              ? `${BASIC_URL}uploads/${reviewItem.profile}`
              : `${BASIC_URL}uploads/dumy.png`,
          }}
        />
        <View style={styles.flexFill}>
          <Text style={styles.TextStyle}>{reviewItem.name}</Text>
          <View style={styles.displayFlex}>
            <Icons.FontAwesome name="star" color={color.ylow} size={15} />
            <Text style={styles.reviewRatingText}>{reviewItem.rating}</Text>
          </View>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.msgTitle}>
        {reviewItem.feedback}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader title="Detail" onPressBack={() => navigation.goBack()} />

      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image
            style={styles.expertImg}
            resizeMode="cover"
            source={{ uri: `${BASIC_URL}uploads/${item?.image}` }}
          />
          <View style={styles.overlay} />
          <Text style={styles.expertTitle}>Expert {item?.service_name}</Text>
        </View>

        <View style={styles.contentStyle}>
          <View style={styles.displayFlex}>
            <Text style={styles.nameStyle}>{item?.name}</Text>
            {item?.verified === 'Verified' ? (
              <Icons.FontAwesome5 name="user-check" color={color.blu} size={16} />
            ) : null}
          </View>
          <Icons.FontAwesome name="bookmark" color={color.defalt} size={15} />
        </View>

        <View style={[styles.contentStyle, { alignItems: 'flex-start' }]}>
          <View style={[styles.displayFlex, { width: '65%' }]}>
            <Icons.MaterialIcons name="location-on" color={color.defalt} size={20} />
            <Text style={[styles.expStyle, { fontSize: 12 }]}>{item?.Address}</Text>
          </View>
          <TouchableOpacity onPress={openInGoogleMaps}>
            <Text style={styles.disStyle}>Get Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentStyle}>
          <View style={styles.displayFlex}>
            <Icons.FontAwesome name="phone" color={color.defalt} size={20} />
            <Text style={styles.expStyle}>{item?.phone_number}</Text>
          </View>
          <Text style={styles.expStyle}>({item?.experience} Years Exp)</Text>
        </View>

        <View style={styles.ratingCont}>
          <View style={styles.ratContent}>
            <Text style={styles.ratTitle}>Rating</Text>
            <View style={styles.displayFlex}>
              <Icons.FontAwesome name="star" color={color.ylow} size={15} />
              <Text style={styles.totRat}>
                {item?.averageRating ? item.averageRating.toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
          <View style={styles.ratContentRight}>
            <Text style={styles.ratTitle}>Total Jobs</Text>
            <Text style={styles.totRatVal}>{item?.totaljob}</Text>
          </View>
        </View>

        <View style={styles.contentStyle}>
          <Text style={styles.serInc}>Services</Text>
        </View>

        <View style={styles.listCont}>
          {skills.length > 0 && (
            <View style={styles.skillsWrapper}>
              {skills.map((skillItem, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedSkill(skillItem);
                    setSkillModal(true);
                  }}
                  style={styles.skillBadge}>
                  <Text style={styles.skillBadgeText}>
                    {skillItem.select_bussiness}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.reviewCont}>
          <View style={styles.contentStyle}>
            <Text style={styles.serInc}>
              {(item?.people_review || []).filter(r => r?.name && r?.rating).length} Reviews
            </Text>
            <TouchableOpacity onPress={openAllReviews}>
              <Text style={[styles.licenseStyle, { fontWeight: '400' }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={(item?.people_review || []).filter(r => r?.rating)}
            keyExtractor={(r, idx) => idx.toString()}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={renderReviewItem}
          />
        </View>

        <View style={styles.btnContainer}>
          <BotonComp
            onPressFunc={() => navigation.navigate('IndividualChat', { currentuser: item })}
            btnText="Inbox"
            BtnStyle={styles.BtnStyleHalf}
          />
          <BotonComp
            btnText="Book Service"
            BtnStyle={styles.BtnStyleHalf}
            onPressFunc={toggleModal}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Book Service</Text>
          <TouchableOpacity style={styles.cancelCont} onPress={toggleModal}>
            <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalView}>
          <View style={styles.modalBody}>
            <View style={styles.fullWidth}>
              <Text style={styles.labelStyle}>Name</Text>
              <InputBokServices
                placeholder="Enter Full Name"
                placeholderTextColor={color.defalt}
                icon="user"
                inputstyle={styles.inputContainer}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.fullWidth}>
              <Text style={styles.labelStyle}>Phone Number</Text>
              <InputBokServices
                placeholder="Enter phone no"
                placeholderTextColor={color.defalt}
                icon="phone"
                keyboardType="numeric"
                inputstyle={styles.inputContainer}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity style={styles.fullWidth} onPress={() => setOpen(true)}>
              <Text style={styles.labelStyle}>Service Date</Text>
              <InputBokServices
                placeholder="Date"
                placeholderTextColor={color.defalt}
                icon="calendar"
                inputstyle={styles.inputContainer}
                value={date.toISOString().split('T')[0]}
                editable={false}
              />
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={selectedDate => {
                  setOpen(false);
                  setDate(selectedDate);
                }}
                onCancel={() => setOpen(false)}
              />
            </TouchableOpacity>

            <View style={styles.fullWidth}>
              <Text style={styles.labelStyle}>Address</Text>
              <InputBokServices
                placeholder="Enter Address"
                placeholderTextColor={color.defalt}
                icon="map-pin"
                inputstyle={styles.inputContainer}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.fullWidth}>
              <Text style={styles.labelStyle}>Price</Text>
              <InputBokServices
                placeholder="Enter Price"
                placeholderTextColor={color.defalt}
                icon="naira-sign"
                keyboardType="numeric"
                inputstyle={styles.inputContainer}
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <TouchableOpacity style={styles.attachCont} onPress={handleFilePick}>
              <Icons.Entypo name="attachment" size={20} style={styles.attachIcon} color={color.defalt} />
              <Text style={styles.labelStyle}>Choose Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachCont} onPress={handleCamera}>
              <Icons.Entypo name="attachment" size={20} style={styles.attachIcon} color={color.defalt} />
              <Text style={styles.labelStyle}>Open Camera</Text>
            </TouchableOpacity>

            {selectedfile && (
              <View style={styles.selectedFileBox}>
                <View style={styles.displayFlex}>
                  <Icons.Entypo name="image" size={20} color={color.defalt} style={{ marginRight: 8 }} />
                  <Text style={styles.selectedTitle}>Selected Image</Text>
                </View>
                <Image source={{ uri: selectedfile.uri }} style={styles.selectedPreview} />
                <Text numberOfLines={1} style={styles.selectedFileName}>
                  {selectedfile.name}
                </Text>
              </View>
            )}
          </View>

          <BtnDisable
            onPressFunc={() => {
              if (isAnyFieldEmpty || Number(price) <= 0) {
                Alert.alert('Error', 'Please fill in all required fields');
              } else {
                handleNavigate();
              }
            }}
            isDisabled={isAnyFieldEmpty || Number(price) <= 0}
            load={load}
            btnText="Book Service"
          />
        </ScrollView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={submitReviewVisible}
        onRequestClose={() => setSubmitReviewVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Opinion matters to us!</Text>
            <TouchableOpacity style={styles.cancelCont} onPress={toggleSubmitReview}>
              <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.iconCont}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                halfStarEnabled
                selectedStar={setRating}
                containerStyle={{ marginVertical: 10 }}
                starSize={40}
                emptyStarColor="lightgray"
                fullStarColor="gold"
                halfStarColor="orange"
              />
            </View>
            <C_TxtInput
              styles={{ fontWeight: '400' }}
              numberOfLines={5}
              placeholder="Give your feedback"
              placeholderTextColor={color.litGry}
              value={feedback}
              onChangeText={setFeedback}
            />
            <BotonComp
              onPressFunc={sendRating}
              BtnStyle={{ marginTop: 25 }}
              btnText="Submit"
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={reviewVisible}
        onRequestClose={() => setReviewVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity style={styles.cancelCont} onPress={toggleReview}>
              <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TouchableOpacity style={styles.attachCont}>
              <Icons.FontAwesome5 name="exclamation-circle" size={20} style={styles.attachIcon} color={color.defalt} />
              <Text style={styles.labelStyle}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSubmitReview} style={styles.attachCont}>
              <Icons.FontAwesome5 name="edit" size={20} style={styles.attachIcon} color={color.defalt} />
              <Text style={styles.labelStyle}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachCont}>
              <Icons.Feather name="share-2" size={20} style={styles.attachIcon} color={color.defalt} />
              <Text style={styles.labelStyle}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={singleReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSingleReviewModal(false)}>
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewModalBox}>
            <View style={styles.reviewModalHeader}>
              <Text style={styles.reviewModalTitle}>Review Detail</Text>
              <TouchableOpacity onPress={() => setSingleReviewModal(false)}>
                <Icons.FontAwesome5 name="times" size={18} color={color.wite} />
              </TouchableOpacity>
            </View>
            {selectedReview && (
              <View style={{ padding: 15 }}>
                <View style={styles.centerAlign}>
                  <Image
                    style={styles.largeAvatar}
                    resizeMode="cover"
                    source={{
                      uri: selectedReview?.profile
                        ? `${BASIC_URL}uploads/${selectedReview.profile}`
                        : `${BASIC_URL}uploads/dumy.png`,
                    }}
                  />
                  <Text style={styles.reviewNameText}>{selectedReview.name}</Text>
                  <Text style={styles.reviewRatingTextSub}>
                    Rating (⭐{selectedReview.rating})
                  </Text>
                </View>
                <Text style={styles.reviewHeadingText}>Review:</Text>
                <Text style={styles.reviewBodyText}>{selectedReview.feedback}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={allReviewsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAllReviewsModal(false)}>
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewModalBox}>
            <View style={styles.reviewModalHeader}>
              <Text style={styles.reviewModalTitle}>All Reviews</Text>
              <TouchableOpacity onPress={() => setAllReviewsModal(false)}>
                <Icons.FontAwesome5 name="times" size={18} color={color.wite} />
              </TouchableOpacity>
            </View>

            <FlatList
              style={{ flexGrow: 0 }}
              data={(item?.people_review || []).filter(r => r?.rating)}
              keyExtractor={(r, index) => index.toString()}
              contentContainerStyle={{ padding: 15 }}
              renderItem={({ item: reviewItem }) => (
                <TouchableOpacity
                  style={styles.allReviewItem}
                  onPress={() => {
                    setAllReviewsModal(false);
                    openSingleReview(reviewItem);
                  }}>
                  <View style={styles.reviewRow}>
                    <View style={styles.reviewLeft}>
                      <Image
                        style={styles.logoImg}
                        resizeMode="cover"
                        source={{
                          uri: reviewItem?.profile
                            ? `${BASIC_URL}uploads/${reviewItem.profile}`
                            : `${BASIC_URL}uploads/dumy.png`,
                        }}
                      />
                      <View>
                        <Text style={styles.reviewName}>{reviewItem.name}</Text>
                        <Text style={styles.reviewRating}>
                          Rating (⭐{reviewItem.rating})
                        </Text>
                        <Text numberOfLines={1} style={styles.reviewFeedback}>
                          {reviewItem.feedback}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.chevronBox}>
                      <Icons.Feather name="chevron-right" size={24} color={color.gry} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={skillModal}
        transparent
        animationType="slide"
        onRequestClose={() => setSkillModal(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.skillBox}>
            {selectedSkill && (
              <>
                <Text style={styles.skillTitle}>
                  {selectedSkill.select_bussiness}
                </Text>
                <Text style={styles.skillExpText}>
                  Experience: {selectedSkill.working_experience} years
                </Text>

                {selectedSkill.certificates ? (
                  <Image
                    source={{ uri: `${BASIC_URL}uploads/${selectedSkill.certificates}` }}
                    style={styles.certImg}
                    resizeMode="cover"
                  />
                ) : null}

                <TouchableOpacity
                  onPress={() => setSkillModal(false)}
                  style={styles.closeSkillBtn}>
                  <Text style={styles.closeSkillText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ExprtDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainScrollView: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  flexFill: {
    flex: 1,
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  profileCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    paddingHorizontal: 11,
    paddingVertical: 11,
    backgroundColor: color.wite,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 10,
    marginRight: 10,
    width: 280,
  },
  TextStyle: {
    fontSize: 18,
    color: color.blak,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 2,
  },
  msgTitle: {
    fontSize: 14,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'left',
    paddingVertical: 4,
  },
  logoImg: {
    width: width / 6,
    height: height / 15,
    borderRadius: 10,
    marginRight: 7,
  },
  heroContainer: {
    width: '100%',
    height: height / 3,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
  },
  expertImg: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  expertTitle: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  displayFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: color.defalt,
    marginRight: 5,
  },
  disStyle: {
    fontSize: 12,
    color: color.defalt,
    fontWeight: '600',
  },
  expStyle: {
    fontSize: 15,
    color: color.gry,
    paddingLeft: 6,
  },
  ratingCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    backgroundColor: '#e8e8e8',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 1,
  },
  ratContent: {
    justifyContent: 'flex-start',
  },
  ratContentRight: {
    borderLeftColor: color.litGry,
    borderLeftWidth: 2,
    width: '50%',
    alignItems: 'flex-end',
  },
  ratTitle: {
    fontSize: 16,
    color: color.gry,
    paddingBottom: 4,
  },
  totRat: {
    fontSize: 16,
    color: color.blak,
    paddingLeft: 5,
    fontWeight: '600',
  },
  totRatVal: {
    fontSize: 16,
    color: color.blak,
    fontWeight: '600',
    paddingRight: 10,
  },
  serInc: {
    fontSize: 18,
    color: color.defalt,
    fontWeight: '600',
  },
  licenseStyle: {
    fontSize: 16,
    color: color.defalt,
    fontWeight: '600',
    paddingRight: 6,
  },
  listCont: {
    marginBottom: 10,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  skillBadge: {
    backgroundColor: color.defalt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillBadgeText: {
    color: 'white',
    fontWeight: '600',
  },
  reviewCont: {
    marginVertical: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  BtnStyleHalf: {
    width: '46%',
    marginTop: 0,
  },
  modalView: {
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: color.wite,
    width: '100%',
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelCont: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: color.wite,
    fontWeight: '600',
  },
  labelStyle: {
    fontSize: 16,
    color: color.blak,
    fontWeight: '600',
    marginTop: 6,
  },
  attachCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 10,
  },
  attachIcon: {
    marginRight: 5,
  },
  iconCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  reviewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewModalBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: color.wite,
    borderRadius: 15,
    overflow: 'hidden',
  },
  reviewModalHeader: {
    backgroundColor: color.defalt,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.wite,
  },
  allReviewItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: color.defalt,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chevronBox: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
  },
  reviewRating: {
    fontSize: 12,
    color: '#000',
  },
  reviewRatingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
  },
  reviewFeedback: {
    fontSize: 13,
    color: color.gry,
  },
  selectedFileBox: {
    marginTop: 15,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  selectedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: color.defalt,
  },
  selectedPreview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 10,
  },
  selectedFileName: {
    marginTop: 8,
    fontSize: 13,
    color: color.gry,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 10,
  },
  skillExpText: {
    marginBottom: 10,
    color: '#000',
  },
  certImg: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  closeSkillBtn: {
    backgroundColor: color.defalt,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeSkillText: {
    color: '#fff',
    fontWeight: '600',
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  reviewNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 6,
  },
  reviewRatingTextSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#000',
  },
  reviewHeadingText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  reviewBodyText: {
    fontSize: 14,
    color: color.gry,
    marginTop: 2,
  },
});