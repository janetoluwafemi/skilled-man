import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Linking,
  ScrollView,
  StatusBar,
  Platform,
  Share,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';
import * as Animatable from 'react-native-animatable';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';
import { getProviderId, hasActiveFavorite } from '../../utilis/favoriteUtils';

const { width } = Dimensions.get('window');

const ExpertDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const focus = useIsFocused();
  const initialItem = route.params?.item;

  const [expertData, setExpertData] = useState(initialItem);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [submitReviewVisible, setSubmitReviewVisible] = useState(false);
  const [singleReviewModal, setSingleReviewModal] = useState(false);
  const [allReviewsModal, setAllReviewsModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const [customAlert, setCustomAlert] = useState({ visible: false, title: '', message: '', onPress: null });
  const [selectedReview, setSelectedReview] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  const isSendingRef = useRef(false);
  const provider_id = getProviderId(expertData);

  const [isFavorite, setIsFavorite] = useState(
      expertData?.is_favorite === true ||
      expertData?.favorite_status === '1' ||
      expertData?.status === '1',
  );

  const showAlert = (title, message, onPress = null) => {
    setCustomAlert({ visible: true, title, message, onPress });
  };

  const fetchExpertProfile = useCallback(async () => {
    try {
      if (!provider_id) return;
      const response = await fetch(`${BASIC_URL}user/get_profile.php?id=${provider_id}`, { method: 'GET' });
      const result = await response.json();
      if (result && !result.error) setExpertData(prev => ({ ...prev, ...result }));
    } catch (error) { console.log('Error fetching expert profile:', error); }
  }, [provider_id]);

  useEffect(() => { if (focus) fetchExpertProfile(); }, [focus, fetchExpertProfile]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const formdata = new FormData();
        formdata.append('user_id', global.id);
        const response = await fetch(`${BASIC_URL}user/get_favorite_provider.php`, { method: 'POST', body: formdata });
        const result = await response.json();
        if (result?.favorite_providers) {
          const isFaved = hasActiveFavorite(result.favorite_providers, expertData);
          setIsFavorite(isFaved);
        }
      } catch (error) { console.log('Error checking favorite status:', error); }
    };
    if (focus) fetchFavoriteStatus();
  }, [focus, expertData]);

  const GetSkills = useCallback(async () => {
    if (!expertData?.id) return;
    try {
      const formdata = new FormData();
      formdata.append('user_id', expertData.id);
      const response = await fetch(`${BASIC_URL}get_skills.php?user_id=${expertData.id}`, { method: 'POST', body: formdata });
      const result = await response.json();
      if (result?.business) {
        const skillsArray = Object.values(result.business);
        const filteredSkills = skillsArray.filter(s => s?.select_bussiness && s.select_bussiness !== 'Select Business');
        setSkills(filteredSkills);
      }
    } catch (error) { console.log('Skill error:', error); }
  }, [expertData?.id]);

  useEffect(() => { GetSkills(); }, [GetSkills]);

  const openInGoogleMaps = () => {
    if (!expertData?.Address) {
      showAlert('Error', 'Address not available');
      return;
    }
    const encodedAddress = encodeURIComponent(expertData.Address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`).catch(() =>
        showAlert('Error', 'Unable to open Google Maps')
    );
  };

  const openSingleReview = review => { setSelectedReview(review); setSingleReviewModal(true); };
  const toggleReview = () => setReviewVisible(prev => !prev);
  const toggleSubmitReview = () => { setSubmitReviewVisible(prev => !prev); setReviewVisible(false); };

  const toggleFavourite = async () => {
    const currentFavState = isFavorite;
    setIsFavorite(!currentFavState);

    try {
      const formdata = new FormData();
      if (!currentFavState) {
        formdata.append('user_id', global.id);
        formdata.append('provider_id', provider_id);
        formdata.append('provider_name', expertData?.name);
        formdata.append('rating', expertData?.averageRating?.toFixed(2) || '0.00');
        formdata.append('total_jobs', expertData?.totaljob || expertData?.total_jobs || 0);
        formdata.append('service_name', expertData?.service_name || '');
        await fetch(`${BASIC_URL}user/favorite_providers.php`, { method: 'POST', body: formdata });
        showToast('Added to favorites');
      } else {
        formdata.append('user_id', global.id);
        formdata.append('provider_id', provider_id);
        formdata.append('status', '0');
        await fetch(`${BASIC_URL}user/favorite_status_update.php`, { method: 'POST', body: formdata });
        showToast('Removed from favorites');
      }
    } catch (error) { setIsFavorite(currentFavState); }
  };

  const handleShareProfile = async () => {
    try {
      setReviewVisible(false);
      const result = await Share.share({
        title: `${expertData?.name || 'Artisan'} on SkilledMan`,
        message: `Check out ${expertData?.name || 'this expert'} on SkilledMan! Location: ${expertData?.Address || 'Available on request'}. Contact: ${expertData?.phone_number || ''}`,
      });
      if (result.action === Share.sharedAction && !result.activityType) showToast('Profile shared!');
    } catch (error) { console.log('Error sharing profile:', error); }
  };

  const handleReportExpert = () => {
    setReviewVisible(false);
    showAlert('Report Expert', `Are you sure you want to report ${expertData?.name || 'this provider'}?`, () => {
      const subject = encodeURIComponent(`Report Provider: ${expertData?.name || ''} (ID: ${expertData?.id || ''})`);
      Linking.openURL(`mailto:support@skilledman.com?subject=${subject}`).catch(() => showToast('Unable to open mail client'));
    });
  };

  const sendRating = async () => {
    if (!rating || rating === 0) { showAlert('Rating Required', 'Please select a star rating.'); return; }
    try {
      const formdata = new FormData();
      formdata.append('bookingId', '0');
      formdata.append('user_id', String(global.id || '256'));
      formdata.append('provider_id', String(provider_id));
      formdata.append('rating', String(rating));
      formdata.append('feedback', feedback.trim());
      const response = await fetch(`${BASIC_URL}user/feedback.php`, { method: 'POST', body: formdata });
      const result = await response.json();
      if (result?.success || result?.status === 'OK') {
        showToast(result.success || 'Review submitted successfully!');
        setSubmitReviewVisible(false); setFeedback(''); setRating(0);
        fetchExpertProfile();
      } else if (result?.error) showAlert('Error', result.error);
    } catch (error) { showAlert('Error', 'Unable to submit feedback.'); }
  };

  const handleSendMessage = async () => {
    const messageText = chatMessage?.trim();
    if (!messageText) { showToast('Please type a message'); return; }
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    try {
      setSendingChat(true);
      const senderId = String(global?.id || '256');
      const receiverId = String(provider_id || '251');
      const formdata = new FormData();
      formdata.append('sender_id', senderId);
      formdata.append('receiver_id', receiverId);
      formdata.append('message', messageText);
      const response = await fetch(`${BASIC_URL}firebase/send_notification.php`, { method: 'POST', body: formdata });
      const result = await response.json();
      isSendingRef.current = false; setSendingChat(false);
      if (result?.chat_id || result?.success === 'Message sent' || result?.status === 'success') {
        showToast('Message sent!'); setChatMessage(''); setChatModalVisible(false);
        setTimeout(() => { navigation.navigate('IndividualChat', { currentuser: expertData, receiver_id: receiverId }); }, 150);
      } else { showToast(result?.error || 'Failed to send message'); }
    } catch (error) { isSendingRef.current = false; setSendingChat(false); showToast('Error sending message.'); }
  };

  const renderReviewItem = ({ item: reviewItem, index }) => (
      <TouchableOpacity activeOpacity={0.8} onPress={() => openSingleReview(reviewItem)} style={styles.reviewCard} key={`review_${index}`}>
        <View style={styles.reviewCardHeader}>
          <Image style={styles.reviewAvatar} source={{ uri: reviewItem?.profile ? `${BASIC_URL}uploads/${reviewItem.profile}` : `${BASIC_URL}uploads/dumy.png` }} />
          <View style={styles.reviewInfoCol}>
            <Text style={styles.reviewNameText} numberOfLines={1}>{reviewItem.name}</Text>
            <View style={styles.starRow}>
              <Icons.FontAwesome name="star" color="#F59E0B" size={13} />
              <Text style={styles.starValueText}>{reviewItem.rating}</Text>
            </View>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.reviewSnippet}>{reviewItem.feedback}</Text>
      </TouchableOpacity>
  );

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.headerBar}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backArrowBtn}>
            <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={toggleReview} style={styles.backArrowBtn}>
            <Icons.Feather name="more-vertical" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Expert Profile</Text>
            <Text style={styles.welcomeSubtitle}>View artisan qualifications and reviews.</Text>

            <View style={styles.heroCard}>
              <Image style={styles.heroImg} resizeMode="cover" source={{ uri: `${BASIC_URL}uploads/${expertData?.image}` }} />
              <View style={styles.heroOverlay} />
              <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{expertData?.service_name || 'Professional'}</Text></View>
            </View>

            <View style={styles.profileSummaryCard}>
              <View style={styles.profileHeaderRow}>
                <View style={styles.nameBlock}>
                  <View style={styles.nameVerifiedRow}>
                    <Text style={styles.providerName}>{expertData?.name}</Text>
                    {expertData?.verified === 'Verified' && <Icons.MaterialIcons name="verified" color={color.defalt} size={18} style={{ marginLeft: 6 }} />}
                  </View>
                  <Text style={styles.serviceSubtitle}>{expertData?.service_name}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.bookmarkBtn} onPress={toggleFavourite}>
                  <Icons.FontAwesome name="bookmark" size={20} color={isFavorite ? color.defalt : "#CBD5E1"} />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.metaRow}>
                <View style={styles.metaLeft}>
                  <Icons.Feather name="map-pin" color="#64748B" size={15} />
                  <Text style={styles.metaAddressText} numberOfLines={1}>{expertData?.Address || expertData?.address || 'Address not provided'}</Text>
                </View>
                <TouchableOpacity onPress={openInGoogleMaps}><Text style={styles.mapLinkText}>Map</Text></TouchableOpacity>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaLeft}>
                  <Icons.Feather name="phone" color="#64748B" size={15} />
                  <Text style={styles.metaText}>{expertData?.phone_number || 'N/A'}</Text>
                </View>
                <Text style={styles.expBadgeText}>{expertData?.experience || expertData?.working_experience || 0} Yrs Exp</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.statValueRow}>
                  <Icons.FontAwesome name="star" color="#F59E0B" size={15} />
                  <Text style={styles.statPrimaryText}>{expertData?.averageRating ? Number(expertData.averageRating).toFixed(2) : '0.00'}</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Jobs</Text>
                <Text style={styles.statPrimaryText}>{expertData?.totaljob || expertData?.total_jobs || 0}</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Services & Skills</Text>
            </View>

            {skills.length > 0 ? (
                <View style={styles.skillsWrapper}>
                  {skills.map((skillItem, idx) => (
                      <TouchableOpacity key={`skill_${idx}`} onPress={() => { setSelectedSkill(skillItem); setSkillModal(true); }} style={styles.skillChip}>
                        <Icons.Feather name="award" size={14} color={color.defalt} style={{ marginRight: 6 }} />
                        <Text style={styles.skillChipText}>{skillItem.select_bussiness}</Text>
                      </TouchableOpacity>
                  ))}
                </View>
            ) : (
                <View style={styles.emptyCardSmall}><Text style={styles.emptyCardText}>No specific skills listed.</Text></View>
            )}

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Reviews ({(expertData?.people_review || []).filter(r => r?.rating).length})</Text>
              <TouchableOpacity onPress={() => setAllReviewsModal(true)}><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={(expertData?.people_review || []).filter(r => r?.rating)}
                keyExtractor={(r, idx) => `review_${idx}`}
                contentContainerStyle={styles.reviewsListScroll}
                renderItem={renderReviewItem}
                ListEmptyComponent={<View style={styles.emptyCardSmall}><Text style={styles.emptyCardText}>No reviews available yet.</Text></View>}
            />

            <View style={styles.actionButtonGroup}>
              <TouchableOpacity activeOpacity={0.85} style={styles.inboxButton} onPress={() => setChatModalVisible(true)}>
                <Icons.Feather name="message-square" size={18} color="#FFFFFF" />
                <Text style={styles.inboxButtonText}>Send Direct Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Utilities Modals (Alerts, Chats, Reviews, Skills) */}
        <Modal transparent={true} visible={customAlert.visible} animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{customAlert.title}</Text>
              <Text style={styles.alertMessage}>{customAlert.message}</Text>
              <TouchableOpacity style={styles.alertButton} onPress={() => { const action = customAlert.onPress; setCustomAlert({ visible: false, title: '', message: '', onPress: null }); if (action) action(); }}>
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={chatModalVisible} onRequestClose={() => setChatModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.dialogCard}>
              <View style={styles.dialogHeader}>
                <Text style={styles.dialogTitle}>Message {expertData?.name}</Text>
                <TouchableOpacity onPress={() => setChatModalVisible(false)}><Icons.Ionicons name="close-circle" size={22} color="#94A3B8" /></TouchableOpacity>
              </View>
              <C_TxtInput numberOfLines={4} placeholder="Hi, I need assistance with..." placeholderTextColor="#94A3B8" value={chatMessage} onChangeText={setChatMessage} />
              <View style={styles.chatActionRow}>
                <BotonComp onPressFunc={handleSendMessage} BtnStyle={styles.sendChatBtn} disabled={sendingChat} btnText={sendingChat ? <ActivityIndicator size="small" color="#FFFFFF" /> : 'Send Message'} />
                <TouchableOpacity style={styles.openFullChatBtn} onPress={() => { setChatModalVisible(false); navigation.navigate('IndividualChat', { currentuser: expertData }); }}>
                  <Text style={styles.openFullChatText}>Open Full Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={submitReviewVisible} onRequestClose={() => setSubmitReviewVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.dialogCard}>
              <View style={styles.dialogHeader}>
                <Text style={styles.dialogTitle}>Leave Feedback</Text>
                <TouchableOpacity onPress={toggleSubmitReview}><Icons.Ionicons name="close-circle" size={22} color="#94A3B8" /></TouchableOpacity>
              </View>
              <View style={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={`star_${star}`} onPress={() => setRating(star)} style={{ marginHorizontal: 4 }}>
                      <Icons.FontAwesome name={star <= rating ? "star" : "star-o"} size={32} color="#F59E0B" />
                    </TouchableOpacity>
                ))}
              </View>
              <C_TxtInput numberOfLines={4} placeholder="Share your experience..." value={feedback} onChangeText={setFeedback} />
              <BotonComp onPressFunc={sendRating} BtnStyle={styles.submitFeedbackBtn} btnText="Submit Review" />
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={reviewVisible} onRequestClose={() => setReviewVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.dialogCard}>
              <View style={styles.dialogHeader}>
                <Text style={styles.dialogTitle}>Options</Text>
                <TouchableOpacity onPress={toggleReview}><Icons.Ionicons name="close-circle" size={22} color="#94A3B8" /></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.actionSheetItem} onPress={toggleSubmitReview}>
                <Icons.Feather name="edit-3" size={18} color={color.defalt} />
                <Text style={styles.actionSheetText}>Write a Review</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionSheetItem} onPress={handleShareProfile}>
                <Icons.Feather name="share-2" size={18} color={color.defalt} />
                <Text style={styles.actionSheetText}>Share Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionSheetItem} onPress={handleReportExpert}>
                <Icons.Feather name="alert-triangle" size={18} color="#EF4444" />
                <Text style={[styles.actionSheetText, { color: '#EF4444' }]}>Report Expert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={allReviewsModal} animationType="slide" onRequestClose={() => setAllReviewsModal(false)}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setAllReviewsModal(false)} style={styles.backArrowBtn}><Icons.Feather name="arrow-left" size={24} color="#0F172A" /></TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.welcomeTitle}>Client Reviews</Text>
              <FlatList
                  data={(expertData?.people_review || []).filter(r => r?.rating)}
                  keyExtractor={(r, index) => `review_full_${index}`}
                  contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: reviewItem }) => (
                      <TouchableOpacity activeOpacity={0.8} style={styles.allReviewCard} onPress={() => { setAllReviewsModal(false); openSingleReview(reviewItem); }}>
                        <Image style={styles.reviewAvatarSmall} source={{ uri: reviewItem?.profile ? `${BASIC_URL}uploads/${reviewItem.profile}` : `${BASIC_URL}uploads/dumy.png` }} />
                        <View style={styles.allReviewContent}>
                          <Text style={styles.reviewNameText}>{reviewItem.name}</Text>
                          <View style={styles.starRow}><Icons.FontAwesome name="star" color="#F59E0B" size={12} /><Text style={styles.starValueText}>{reviewItem.rating}</Text></View>
                          <Text numberOfLines={2} style={styles.reviewSnippet}>{reviewItem.feedback}</Text>
                        </View>
                        <Icons.Feather name="chevron-right" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                  )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
  );
};

export default ExpertDetails;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBar: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 12 : 8, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' },
  backArrowBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 1, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  formContainer: { paddingHorizontal: 20, paddingTop: 4 },
  welcomeTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', letterSpacing: -0.3 },
  welcomeSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 18, marginTop: 4 },
  heroCard: { width: '100%', height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 16, position: 'relative', borderWidth: 1, borderColor: '#EEF2F6' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.35)' },
  heroBadge: { position: 'absolute', bottom: 14, left: 14, backgroundColor: 'rgba(255, 255, 255, 0.92)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  heroBadgeText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  profileSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, elevation: 2, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#EEF2F6' },
  profileHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameBlock: { flex: 1 },
  nameVerifiedRow: { flexDirection: 'row', alignItems: 'center' },
  providerName: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  serviceSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  bookmarkBtn: { padding: 8, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  metaAddressText: { fontSize: 13, color: '#475569', marginLeft: 8, flex: 1 },
  metaText: { fontSize: 13, color: '#475569', marginLeft: 8 },
  mapLinkText: { fontSize: 12, fontWeight: '700', color: color.defalt },
  expBadgeText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  statsCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: '#EEF2F6', elevation: 2 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  statValueRow: { flexDirection: 'row', alignItems: 'center' },
  statPrimaryText: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginLeft: 6 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  seeAllText: { fontSize: 13, fontWeight: '700', color: color.defalt },
  skillsWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  skillChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  skillChipText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  emptyCardSmall: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: '#EEF2F6' },
  emptyCardText: { fontSize: 13, color: '#94A3B8' },
  reviewsListScroll: { paddingVertical: 4 },
  reviewCard: { width: 250, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginRight: 12, borderWidth: 1, borderColor: '#EEF2F6', elevation: 2 },
  reviewCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  reviewInfoCol: { flex: 1 },
  reviewNameText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  starRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  starValueText: { fontSize: 11, fontWeight: '700', color: '#334155', marginLeft: 4 },
  reviewSnippet: { fontSize: 12, color: '#64748B', lineHeight: 16 },
  actionButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  inboxButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: color.defalt, borderRadius: 14, paddingVertical: 16, elevation: 3 },
  inboxButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  alertOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  alertBox: { width: '100%', maxWidth: 340, backgroundColor: '#1E293B', borderRadius: 20, padding: 22, alignItems: 'center' },
  alertTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  alertMessage: { fontSize: 13.5, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  alertButton: { width: '100%', backgroundColor: '#334155', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  alertButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  dialogCard: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, elevation: 4 },
  dialogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  starRatingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 14 },
  submitFeedbackBtn: { marginTop: 16, width: '100%' },
  chatActionRow: { marginTop: 16, width: '100%', gap: 8 },
  sendChatBtn: { width: '100%', backgroundColor: color.defalt, borderRadius: 14, paddingVertical: 13 },
  openFullChatBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  openFullChatText: { fontSize: 13.5, fontWeight: '600', color: color.defalt },
  actionSheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  actionSheetText: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginLeft: 12 },
  allReviewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  reviewAvatarSmall: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  allReviewContent: { flex: 1, marginRight: 10 },
});