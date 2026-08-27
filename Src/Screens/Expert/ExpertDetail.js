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
  StatusBar,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import StarRating from 'react-native-star-rating';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';

let DatePicker = () => null;
if (Platform.OS !== 'web') {
  try {
    DatePicker = require('react-native-date-picker').default;
  } catch (error) {
    console.log('Native date picker is unavailable in this runtime.');
  }
}

const ExpertDetails = () => {
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

  const handleBookingConfirm = () => {
    if (!price || Number(price) <= 0) {
      Alert.alert('Missing Field', 'Please enter a valid price budget.');
      return;
    }

    setModalVisible(false);

    setTimeout(() => {
      navigation.navigate('SelectPaymentMethod', {
        price: String(price).trim(),
        fullName: String(fullName || global.name || '').trim(),
        phoneNumber: String(phoneNumber || global.phone_number || '').trim(),
        address: String(address || global.address || '').trim(),
        date: date.toISOString().split('T')[0],
        provider_id,
        selectedfile,
      });
    }, 150);
  };

  const handleShareProfile = async () => {
    try {
      setReviewVisible(false);
      const result = await Share.share({
        title: `${item?.name || 'Artisan'} on SkilledMan`,
        message: `Check out ${item?.name || 'this expert'} offering ${item?.service_name || 'professional services'} on SkilledMan! Location: ${item?.Address || 'Available on request'}. Contact: ${item?.phone_number || ''}`,
      });

      if (result.action === Share.sharedAction) {
        if (!result.activityType) {
          showToast('Profile shared!');
        }
      }
    } catch (error) {
      console.log('Error sharing profile:', error);
    }
  };

  const handleReportExpert = () => {
    setReviewVisible(false);
    Alert.alert(
      'Report Expert',
      `Are you sure you want to report ${item?.name || 'this provider'} for inappropriate behavior or policy violation?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report to Support',
          style: 'destructive',
          onPress: () => {
            const subject = encodeURIComponent(`Report Provider: ${item?.name || ''} (ID: ${item?.id || ''})`);
            const body = encodeURIComponent(
              `Hello SkilledMan Support,\n\nI want to report the following expert:\n- Name: ${item?.name || ''}\n- Provider ID: ${item?.id || ''}\n- Service: ${item?.service_name || ''}\n\nReason for report:\n`
            );

            if (Platform.OS === 'web') {
              const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@skilledman.com&su=${subject}&body=${body}`;
              window.open(webGmailUrl, '_blank');
            } else {
              const mailUrl = `mailto:support@skilledman.com?subject=${subject}&body=${body}`;
              Linking.openURL(mailUrl).catch(() => {
                showToast('Unable to open mail client');
              });
            }
          },
        },
      ]
    );
  };

  const sendRating = async () => {
    if (!rating || rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('user_id', String(global.id || '255'));
      formdata.append('rating', String(rating));
      formdata.append('feedback', feedback.trim());
      formdata.append('provider_id', String(item?.id || provider_id));

      const response = await fetch(`${BASIC_URL}user/feedback.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();

      if (result?.success || result?.status) {
        showToast(result.success || 'Review submitted successfully!');
        setSubmitReviewVisible(false);
        setReviewVisible(false);
        setFeedback('');
        setRating(0);
      } else if (result?.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log('Error submitting review:', error);
      Alert.alert('Error', 'Unable to submit feedback. Check server connection.');
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });

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

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

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

  const renderReviewItem = ({ item: reviewItem, index }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openSingleReview(reviewItem)}
      style={styles.reviewCard}
      key={`review_card_${reviewItem?.id || index}_${index}`}>
      <View style={styles.reviewCardHeader}>
        <Image
          style={styles.reviewAvatar}
          resizeMode="cover"
          source={{
            uri: reviewItem?.profile
              ? `${BASIC_URL}uploads/${reviewItem.profile}`
              : `${BASIC_URL}uploads/dumy.png`,
          }}
        />
        <View style={styles.reviewInfoCol}>
          <Text style={styles.reviewNameText} numberOfLines={1}>
            {reviewItem.name}
          </Text>
          <View style={styles.starRow}>
            <Icons.FontAwesome name="star" color="#F59E0B" size={13} />
            <Text style={styles.starValueText}>{reviewItem.rating}</Text>
          </View>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.reviewSnippet}>
        {reviewItem.feedback}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleReview}
          style={styles.backArrowBtn}>
          <Icons.Feather name="more-vertical" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Expert Profile</Text>
          <Text style={styles.welcomeSubtitle}>
            View artisan qualifications, reviews, and book services.
          </Text>

          <View style={styles.heroCard}>
            <Image
              style={styles.heroImg}
              resizeMode="cover"
              source={{ uri: `${BASIC_URL}uploads/${item?.image}` }}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{item?.service_name || 'Professional'}</Text>
            </View>
          </View>

          <View style={styles.profileSummaryCard}>
            <View style={styles.profileHeaderRow}>
              <View style={styles.nameBlock}>
                <View style={styles.nameVerifiedRow}>
                  <Text style={styles.providerName}>{item?.name}</Text>
                  {item?.verified === 'Verified' && (
                    <Icons.MaterialIcons
                      name="verified"
                      color={color.defalt}
                      size={18}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
                <Text style={styles.serviceSubtitle}>{item?.service_name}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} style={styles.bookmarkBtn}>
                <Icons.Feather name="bookmark" size={18} color={color.defalt} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Icons.Feather name="map-pin" color="#64748B" size={15} />
                <Text style={styles.metaAddressText} numberOfLines={1}>
                  {item?.Address || 'Address not provided'}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={openInGoogleMaps}>
                <Text style={styles.mapLinkText}>Map</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Icons.Feather name="phone" color="#64748B" size={15} />
                <Text style={styles.metaText}>{item?.phone_number || 'N/A'}</Text>
              </View>
              <Text style={styles.expBadgeText}>{item?.experience || 0} Yrs Experience</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.statValueRow}>
                <Icons.FontAwesome name="star" color="#F59E0B" size={15} />
                <Text style={styles.statPrimaryText}>
                  {item?.averageRating ? item.averageRating.toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Completed Jobs</Text>
              <Text style={styles.statPrimaryText}>{item?.totaljob || 0}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Services & Skills</Text>
          </View>

          {skills.length > 0 ? (
            <View style={styles.skillsWrapper}>
              {skills.map((skillItem, idx) => (
                <TouchableOpacity
                  key={`skill_chip_${skillItem?.id || idx}_${idx}`}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedSkill(skillItem);
                    setSkillModal(true);
                  }}
                  style={styles.skillChip}>
                  <Icons.Feather
                    name="award"
                    size={14}
                    color={color.defalt}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.skillChipText}>
                    {skillItem.select_bussiness}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCardSmall}>
              <Text style={styles.emptyCardText}>No specific skills listed.</Text>
            </View>
          )}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>
              Reviews ({(item?.people_review || []).filter(r => r?.name && r?.rating).length})
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={openAllReviews}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={(item?.people_review || []).filter(r => r?.rating)}
            keyExtractor={(r, idx) => `review_horiz_${r?.id || idx}_${idx}`}
            contentContainerStyle={styles.reviewsListScroll}
            renderItem={renderReviewItem}
            ListEmptyComponent={
              <View style={styles.emptyCardSmall}>
                <Text style={styles.emptyCardText}>No reviews available yet.</Text>
              </View>
            }
          />

          <View style={styles.actionButtonGroup}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.inboxButton}
              onPress={() => navigation.navigate('IndividualChat', { currentuser: item })}>
              <Icons.Feather name="message-square" size={18} color={color.defalt} />
              <Text style={styles.inboxButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.bookButton}
              onPress={toggleModal}>
              <Text style={styles.bookButtonText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

          <View style={styles.headerBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleModal}
              style={styles.backArrowBtn}>
              <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Animatable.View animation="fadeInUp" duration={500} style={styles.formContainer}>
                <Text style={styles.welcomeTitle}>Request Appointment</Text>
                <Text style={styles.welcomeSubtitle}>
                  Provide booking details and budget for this service
                </Text>

                <View style={styles.cardWrapper}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Your Full Name</Text>
                    <View style={styles.inputContainer}>
                      <Icons.Feather name="user" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="e.g. John Doe"
                        placeholderTextColor="#94A3B8"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={!load}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Phone Number</Text>
                    <View style={styles.inputContainer}>
                      <Icons.Feather name="phone" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="e.g. 08012345678"
                        placeholderTextColor="#94A3B8"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!load}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Service Date</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.inputContainer}
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          setOpen(true);
                        }
                      }}>
                      <Icons.Feather name="calendar" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#94A3B8"
                        value={date.toISOString().split('T')[0]}
                        editable={Platform.OS === 'web'}
                        onChangeText={val => {
                          const parsed = new Date(val);
                          if (!isNaN(parsed.getTime())) setDate(parsed);
                        }}
                      />
                    </TouchableOpacity>

                    {Platform.OS !== 'web' && (
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
                    )}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Service Location Address</Text>
                    <View style={styles.inputContainer}>
                      <Icons.Feather name="map-pin" size={18} color="#94A3B8" style={styles.inputIconLeft} />
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="e.g. 123 Main Street"
                        placeholderTextColor="#94A3B8"
                        value={address}
                        onChangeText={setAddress}
                        editable={!load}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Price Budget (₦)</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.nairaPrefix}>₦</Text>
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="e.g. 15000"
                        placeholderTextColor="#94A3B8"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        editable={!load}
                      />
                    </View>
                  </View>

                  <View style={styles.mediaUploadRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.uploadOptionBtn}
                      onPress={handleFilePick}>
                      <Icons.Feather name="image" size={16} color={color.defalt} />
                      <Text style={styles.uploadOptionText}>Select Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.uploadOptionBtn}
                      onPress={handleCamera}>
                      <Icons.Feather name="camera" size={16} color={color.defalt} />
                      <Text style={styles.uploadOptionText}>Use Camera</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedfile && (
                    <View style={styles.selectedMediaCard}>
                      <Image source={{ uri: selectedfile.uri }} style={styles.previewImage} resizeMode="cover" />
                      <View style={styles.previewInfoRow}>
                        <Text numberOfLines={1} style={styles.previewNameText}>
                          {selectedfile.name}
                        </Text>
                        <TouchableOpacity onPress={() => setSelectedFile(null)}>
                          <Icons.Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.submitBtn}
                    onPress={handleBookingConfirm}>
                    <Text style={styles.submitBtnText}>Confirm & Proceed to Pay</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={submitReviewVisible}
        onRequestClose={() => setSubmitReviewVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Leave Feedback</Text>
              <TouchableOpacity onPress={toggleSubmitReview}>
                <Icons.Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.starRatingContainer}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                selectedStar={val => setRating(val)}
                starSize={34}
                emptyStarColor="#CBD5E1"
                fullStarColor="#F59E0B"
                halfStarColor="#F59E0B"
              />
            </View>
            <C_TxtInput
              numberOfLines={4}
              placeholder="Share your experience working with this expert..."
              placeholderTextColor="#94A3B8"
              value={feedback}
              onChangeText={setFeedback}
            />
            <BotonComp
              onPressFunc={sendRating}
              BtnStyle={styles.submitFeedbackBtn}
              btnText="Submit Review"
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={reviewVisible}
        onRequestClose={() => setReviewVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Options</Text>
              <TouchableOpacity onPress={toggleReview}>
                <Icons.Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionSheetItem} onPress={toggleSubmitReview}>
              <Icons.Feather name="edit-3" size={18} color={color.defalt} />
              <Text style={styles.actionSheetText}>Write a Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItem}
              activeOpacity={0.7}
              onPress={handleShareProfile}>
              <Icons.Feather name="share-2" size={18} color={color.defalt} />
              <Text style={styles.actionSheetText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItem}
              activeOpacity={0.7}
              onPress={handleReportExpert}>
              <Icons.Feather name="alert-triangle" size={18} color="#EF4444" />
              <Text style={[styles.actionSheetText, { color: '#EF4444' }]}>Report Expert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={singleReviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSingleReviewModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Review Detail</Text>
              <TouchableOpacity onPress={() => setSingleReviewModal(false)}>
                <Icons.Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {selectedReview && (
              <View style={styles.singleReviewBody}>
                <Image
                  style={styles.largeReviewAvatar}
                  resizeMode="cover"
                  source={{
                    uri: selectedReview?.profile
                      ? `${BASIC_URL}uploads/${selectedReview.profile}`
                      : `${BASIC_URL}uploads/dumy.png`,
                  }}
                />
                <Text style={styles.singleReviewName}>{selectedReview.name}</Text>
                <View style={styles.singleStarRow}>
                  <Icons.FontAwesome name="star" size={15} color="#F59E0B" />
                  <Text style={styles.singleStarText}>{selectedReview.rating} / 5</Text>
                </View>
                <Text style={styles.singleReviewFeedback}>{selectedReview.feedback}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={allReviewsModal}
        animationType="slide"
        onRequestClose={() => setAllReviewsModal(false)}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

          <View style={styles.headerBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAllReviewsModal(false)}
              style={styles.backArrowBtn}>
              <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <Animatable.View animation="fadeInUp" duration={500} style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Client Reviews</Text>
            <Text style={styles.welcomeSubtitle}>
              Read feedback and ratings from customers who worked with this expert.
            </Text>

            <FlatList
              data={(item?.people_review || []).filter(r => r?.rating)}
              keyExtractor={(r, index) => `review_full_${r?.id || index}_${index}`}
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: reviewItem }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.allReviewCard}
                  onPress={() => {
                    setAllReviewsModal(false);
                    openSingleReview(reviewItem);
                  }}>
                  <Image
                    style={styles.reviewAvatarSmall}
                    source={{
                      uri: reviewItem?.profile
                        ? `${BASIC_URL}uploads/${reviewItem.profile}`
                        : `${BASIC_URL}uploads/dumy.png`,
                    }}
                  />
                  <View style={styles.allReviewContent}>
                    <Text style={styles.reviewNameText}>{reviewItem.name}</Text>
                    <View style={styles.starRow}>
                      <Icons.FontAwesome name="star" color="#F59E0B" size={12} />
                      <Text style={styles.starValueText}>{reviewItem.rating}</Text>
                    </View>
                    <Text numberOfLines={2} style={styles.reviewSnippet}>
                      {reviewItem.feedback}
                    </Text>
                  </View>
                  <Icons.Feather name="chevron-right" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            />
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={skillModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSkillModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>{selectedSkill?.select_bussiness}</Text>
              <TouchableOpacity onPress={() => setSkillModal(false)}>
                <Icons.Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dialogSubtitle}>
              Experience: {selectedSkill?.working_experience} Years
            </Text>
            {selectedSkill?.certificates ? (
              <Image
                source={{ uri: `${BASIC_URL}uploads/${selectedSkill.certificates}` }}
                style={styles.certModalImg}
                resizeMode="cover"
              />
            ) : null}
            <BotonComp
              onPressFunc={() => setSkillModal(false)}
              BtnStyle={styles.closeModalBtn}
              btnText="Close"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ExpertDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
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
    marginBottom: 18,
    marginTop: 4,
  },
  heroCard: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  heroBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: {
    flex: 1,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  serviceSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  bookmarkBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  metaAddressText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
  },
  mapLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: color.defalt,
  },
  expBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statPrimaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: color.defalt,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  emptyCardSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  emptyCardText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  reviewsListScroll: {
    paddingVertical: 4,
  },
  reviewCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewInfoCol: {
    flex: 1,
  },
  reviewNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  starValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  reviewSnippet: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
  },
  inboxButtonText: {
    color: color.defalt,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  bookButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '56%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIconLeft: {
    marginRight: 10,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      borderWidth: 0,
    }),
  },
  nairaPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: color.defalt,
    marginRight: 8,
  },
  mediaUploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10,
  },
  uploadOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
  },
  uploadOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 6,
  },
  selectedMediaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  previewInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  previewNameText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  dialogSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  starRatingContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  submitFeedbackBtn: {
    marginTop: 16,
    width: '100%',
  },
  actionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionSheetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 12,
  },
  singleReviewBody: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  largeReviewAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 10,
  },
  singleReviewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  singleStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  singleStarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 6,
  },
  singleReviewFeedback: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  allReviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  allReviewContent: {
    flex: 1,
    marginRight: 10,
  },
  certModalImg: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 12,
  },
  closeModalBtn: {
    marginTop: 10,
    width: '100%',
  },
});