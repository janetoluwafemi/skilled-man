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
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import CstmHeader from '../../Components/CustomHeader';
import DlivrTo from '../../Components/DeliverTo';
import color from '../../Assets/colors/colors';
import {Icons} from '../../Components/Icons';
import BotonComp from '../../Components/BtnComp';
import BtnDisable from '../../Components/BtnDisable';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
// import {Modal} from 'react-native-paper';
import InputBokServices from '../../Components/InputBookService';
import {SafeAreaView} from 'react-native-safe-area-context';
import C_TxtInput from '../../Components/C_TextInput';
import StarRating from 'react-native-star-rating';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import Toast from 'react-native-simple-toast';
import {BASIC_URL} from '../Signin/Signin';
import {launchCamera} from 'react-native-image-picker';

const ExprtDetails = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item;
  console.log('dataaa on expertdetail from find expert', item);

  const provider_id = item?.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [time, settime] = useState(new Date());
  const [opentime, setOpentime] = useState(false);
  const [allReviewsModal, setAllReviewsModal] = useState(false);
  const [singleReviewModal, setSingleReviewModal] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);

  const [fullName, setFullName] = useState(global.name);
  const [phoneNumber, setPhoneNumber] = useState(global.phone_number);
  const [address, setAddress] = useState(global.address);
  const [price, setPrice] = useState('');
  const [isInboxPressed, setIsInboxPressed] = useState(false);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModal, setSkillModal] = useState(false);

  // ====================  Open Google map For expert Location   ===========================
  const openInGoogleMaps = () => {
    if (!item?.Address) {
      Alert.alert('Error', 'Address not available');
      return;
    }

    // Encode address properly
    const address = encodeURIComponent(item.Address);

    // Google Maps Search URL
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;

    Linking.openURL(googleMapsUrl).catch(err =>
      Alert.alert('Error', 'Unable to open Google Maps'),
    );
  };

  const openSingleReview = review => {
    setSelectedReview(review);
    setSingleReviewModal(true);
  };

  const openAllReviews = () => {
    setAllReviewsModal(true);
  };
  // useEffect(() => {
  //   GetSkills();
  // }, [item.id]);
  useEffect(() => {
    if (item?.id) {
      GetSkills();
    }
  }, [item?.id]);

  const GetSkills = async () => {
    try {
      const formdata = new FormData();
      formdata.append('user_id', item.id);

      const response = await fetch(
        `https://theskilledman.com/api/get_skills.php?user_id=${item.id}`,
        {
          method: 'POST',
          body: formdata,
        },
      );

      const result = await response.json();
      console.log('User Skills:', result);

      if (result?.business) {
        const skillsArray = Object.values(result.business);

        // remove "Select Business" entries
        const filteredSkills = skillsArray.filter(
          item =>
            item.select_bussiness &&
            item.select_bussiness !== 'Select Business',
        );

        setSkills(filteredSkills);
      }
    } catch (error) {
      console.log('Skill error:', error);
    }
  };

  const handleNavigate = () => {
    // Navigate to the OtherScreen and pass the map input value as a parameter
    navigation.navigate('SelectPaymentMethod', {
      price,
      fullName,
      phoneNumber,
      address,
      date,
      provider_id,
      selectedfile,
    });
    // navigation.navigate('CardDetail', {price});
  };

  // price=global.price;

  const [selectedfile, setSelectedFile] = React.useState();
  const [submitReviewVisible, setsubmitReviewVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [Feedback, setFeedback] = useState('');
  const [load, setLoad] = useState(false);

  // console.log('specfic user dataitem to get provider id', item.id);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setReviewVisible(false);
  };
  const toggleReview = () => {
    setReviewVisible(!reviewVisible);
    setModalVisible(false);
  };
  const toggleSumbitReview = () => {
    setsubmitReviewVisible(!submitReviewVisible);
    setReviewVisible(false);
  };
  const formatTime = date => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleRating = rating => {
    setRating(rating);
    const value = rating * 1; // Convert rating to desired value range
    Alert.alert('Rating', `You rated ${rating} stars. Value: ${value}%`);
  };

  const SendRating = async () => {
    Alert.alert('uncomment api code');
    // console.log('enter')
    // console.log(global.id)
    // console.log(rating)
    // console.log(item?.id)
    // console.log(Feedback)
    // try {
    //   var myHeaders = new Headers();
    //   myHeaders.append("Cookie", "PHPSESSID=3ji07or75o4005elk3c5eeek6o");

    //   var formdata = new FormData();
    //   formdata.append("user_id", global.id);
    //   formdata.append("rating", rating);
    //   formdata.append("feedback", Feedback);
    //   formdata.append("provider_id", item?.id);

    //   var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: formdata,
    //     redirect: 'follow'
    //   };
    //   const apiurl = "https://fisdemoprojects.com/skilledman/api/user/feedback.php"
    //   const response = await fetch(apiurl, requestOptions)
    //   const result = await response.json()
    //   if (result.success) {
    //     Alert.alert(result && result.success);
    //   }
    //   else if (result.error) {
    //     Alert.alert(result.error)
    //   }
    // } catch (error) {
    //   console.log("error in review", error)
    // }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (result && result[0]) {
        const file = {
          uri: result[0].uri,
          name: result[0].name,
          type: result[0].type,
        };
        setSelectedFile(file);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('Error picking document', error);
      }
    }
  };

  const hndlcamra = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });

      if (result.assets && result.assets.length > 0) {
        const camFile = result.assets[0];
        // Convert camera file to same format as gallery picker
        const file = {
          uri: camFile.uri,
          name: camFile.fileName || `IMG_${Date.now()}.jpg`, // fallback if fileName is missing
          type: camFile.type || 'image/jpeg',
        };
        setSelectedFile(file);
      }
    } catch (error) {
      console.log('Error using camera', error);
    }
  };

  useEffect(() => {
    console.log('Price after FormData append', item?.id);
    console.log('Price after FormData append', global?.id);
    console.log('price changed:', price);
    console.log('full name changed:', fullName);
    console.log('phone number changed:', phoneNumber);
    console.log('address changed:', address);
    console.log('date changed:', date);
  }, [price, fullName, phoneNumber, address, date, item?.id, global?.id]);
  const Boksrvic = async () => {
    const bookingdate = date.toISOString().split('T')[0];
    const bookingtime = formatTime(date);
    try {
      setLoad(true);
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=jmv28htgkulr4v5gmt5n7us8go');
      var formdata = new FormData();

      formdata.append('provider_id', item?.id);
      formdata.append('user_id', global?.id);
      formdata.append('servic_phone_no', phoneNumber);
      formdata.append('service_name', item?.service_name);
      formdata.append('service_date', bookingdate);
      formdata.append('address', address);
      formdata.append('service_time', bookingtime);

      formdata.append('price', price);
      console.log('Price before FormData append:', price);
      console.log('Price after FormData append', item?.id);
      console.log('Price after FormData append', global?.id);
      // formdata.append('price', price);
      if (selectedfile) {
        formdata.append('file', {
          uri: selectedfile.uri,
          name: selectedfile.name,
          type: selectedfile.type,
        });
      }

      global.pr = price;

      console.log('pricesssamoun', JSON.stringify(formdata));

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      // const apiurl ='https://fisdemoprojects.com/skilledman/api/user/book_service.php';
      const apiurl = `${BASIC_URL}user/book_service.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();

      console.log('bookingidddd', result);
      global.bookid = result.booking_id;
      console.log('bokikiki', global.bookid);
      console.log('pricessss', price);
      if (result && result.status) {
        setLoad(false);
        Toast.show(result.status);
        toggleModal();
        handleNavigate();

        // navigation.navigate('SelectPaymentMethod');
      } else if (result?.error) {
        setLoad(false);
        console.log(result, 'error in booking service');
        Alert.alert(result.error);
      }
    } catch (error) {
      setLoad(false);
      console.log('Error Book Services==>\n', error);
    }
  };
  const isAnyFieldEmpty =
    !fullName || !phoneNumber || !date || !address || !price || !selectedfile;

  // console.log('priceceece',global.price)
  const SrvicLst = ({item, index}) => {
    return (
      <View style={styles.serviceCont}>
        <Text style={styles.listStyle}>{index + 1}. </Text>
        <Text style={styles.listStyle}>{item}</Text>
      </View>
    );
  };
  const RviewLst = ({item, index}) => {
    console.log('User review data in card', item);
    return (
      <TouchableOpacity
        onPress={() => openSingleReview(item)}
        style={styles.textContainer}
        key={index}>
        <View style={styles.profileCont}>
          <Image
            style={styles.logoImg}
            resizeMode="cover"
            source={{
              uri: item?.profile
                ? `${BASIC_URL}uploads//${item.profile}`
                : `${BASIC_URL}uploads/dumy.png`,
            }}
          />

          <View style={{flex: 1}}>
            <Text style={styles.TextStyle}>{item.name}</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons.FontAwesome name="star" color={color.ylow} size={15} />
              <Text style={{marginLeft: 4, fontSize: 15, color: '#000'}}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.msgTitle}>
          {item.feedback}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={submitReviewVisible}
        onRequestClose={() => setsubmitReviewVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Opinion matters to us!</Text>
            <TouchableOpacity
              style={styles.cancelCont}
              onPress={toggleSumbitReview}>
              <Icons.FontAwesome5
                name="times"
                color={color.wite}
                size={20}
                style={styles.closeStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.iconCont}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                halfStarEnabled // Enable half-star selection
                selectedStar={handleRating}
                containerStyle={{marginVertical: 10}}
                starSize={40}
                starStyle={{marginRight: 5}}
                //iconSet="MaterialIcons"
                emptyStarColor="lightgray"
                fullStarColor="gold"
                halfStarColor="orange"
              />
            </View>
            <C_TxtInput
              styles={{fontWeight: '400'}}
              numberOfLines={5}
              placeholder="Give your feedback"
              placeholderTextColor={color.litGry}
              onChangeText={val => {
                setFeedback(val);
              }}
            />
            <BotonComp
              onPressFunc={() => {
                SendRating();
                setsubmitReviewVisible(!submitReviewVisible);
                setReviewVisible(false);
              }}
              BtnStyle={{marginTop: 25}}
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
            <Text style={styles.modalTitle}>Book Service</Text>
            <TouchableOpacity style={styles.cancelCont} onPress={toggleReview}>
              <Icons.FontAwesome5
                name="times"
                color={color.wite}
                size={20}
                style={styles.closeStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={[styles.attachCont, {...styles.revListing}]}>
              <Icons.FontAwesome5
                name="exclamation-circle"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSumbitReview}
              style={styles.attachCont}>
              <Icons.FontAwesome5
                name="edit"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachCont}>
              <Icons.Feather
                name="share-2"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Book Service</Text>
          <TouchableOpacity style={styles.cancelCont} onPress={toggleModal}>
            <Icons.FontAwesome5
              name="times"
              color={color.wite}
              size={20}
              style={styles.closeStyle}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={[styles.modalView, {paddingBottom: 20}]}>
          <View style={styles.modalBody}>
            <View>
              <Text style={styles.labelStyle}>Name</Text>
              <InputBokServices
                placeholder="Enter Full Name"
                placeholderTextColor={color.defalt}
                icon="user"
                inputstyle={styles.inputContainer}
                inputIconStyle={styles.inputIconStyle}
                value={fullName}
                onChangeText={val => {
                  setFullName(val);
                }}
              />
            </View>
            <View>
              <Text style={styles.labelStyle}>Phone Number</Text>
              <InputBokServices
                placeholder="Enter phone no"
                placeholderTextColor={color.defalt}
                icon="phone"
                keyboardType="numeric"
                inputstyle={styles.inputContainer}
                inputIconStyle={styles.inputIconStyle}
                value={phoneNumber}
                onChangeText={val => {
                  setPhoneNumber(val);
                }}
              />
            </View>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={styles.labelStyle}>Service Date</Text>

              <InputBokServices
                placeholder="Date"
                placeholderTextColor={color.defalt}
                icon="calendar"
                inputstyle={styles.inputContainer}
                // inputIconStyle={styles.inputIconStyle}
                value={date.toISOString().split('T')[0]}
                onChangeText={val => {
                  setDate(val);
                }}
              />

              <DatePicker
                modal
                open={open}
                date={date} // Pass the date to the DatePicker
                onConfirm={selectedDate => {
                  setOpen(false);
                  setDate(selectedDate); // Update the date state with the selected date
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.labelStyle}>Address</Text>
              <InputBokServices
                placeholder="Enter Address"
                placeholderTextColor={color.defalt}
                icon="map-pin"
                inputstyle={styles.inputContainer}
                inputIconStyle={styles.inputIconStyle}
                value={address}
                onChangeText={val => {
                  setAddress(val);
                }}
              />
            </View>
            <View>
              <Text style={styles.labelStyle}>Price</Text>
              <InputBokServices
                placeholder="Enter Price"
                placeholderTextColor={color.defalt}
                icon="naira-sign"
                keyboardType="numeric"
                inputstyle={styles.inputContainer}
                inputIconStyle={styles.inputIconStyle}
                value={price}
                onChangeText={val => {
                  setPrice(val);
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.attachCont}
              onPress={() => {
                handleFilePick();
              }}>
              <Icons.Entypo
                name="attachment"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />

              <Text style={styles.labelStyle}>{'Choose Image'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachCont}
              onPress={() => {
                hndlcamra();
              }}>
              <Icons.Entypo
                name="attachment"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />

              <Text style={styles.labelStyle}>{'Open Camera'}</Text>
            </TouchableOpacity>
            {selectedfile && (
              <View style={styles.selectedFileBox}>
                {/* Header */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icons.Entypo
                    name="image"
                    size={20}
                    color={color.defalt}
                    style={{marginRight: 8}}
                  />
                  <Text style={styles.selectedTitle}>Selected Image</Text>
                </View>

                {/* Image Preview */}
                <Image
                  source={{uri: selectedfile.uri}}
                  style={styles.selectedPreview}
                />

                {/* File Name */}
                <Text numberOfLines={1} style={styles.selectedFileName}>
                  {selectedfile.name}
                </Text>
              </View>
            )}
          </View>
          <BtnDisable
            onPressFunc={() => {
              if (isAnyFieldEmpty || price <= 0) {
                Alert.alert('Error', 'Please fill in all required fields');
              } else {
                // Boksrvic();
                handleNavigate();
              }
            }}
            isDisabled={isAnyFieldEmpty || price <= 0}
            load={load}
            btnText="Book Service"
          />
        </ScrollView>
      </Modal>
      <CstmHeader
        title="Detail"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView
        style={{paddingHorizontal: 20, paddingBottom: 0, maxHeight: '90%'}}>
        <View style={styles.heroContainer}>
          <Image
            style={styles.expertImg}
            resizeMode="cover"
            source={{
              uri: `${BASIC_URL}uploads/${item?.image}`,
            }}
          />

          {/* Dark Overlay */}
          <View style={styles.overlay} />

          {/* Title */}
          <Text style={styles.expertTitle}>Expert {item?.service_name}</Text>
        </View>

        <View style={styles.contentStyle}>
          <View style={styles.displayFlex}>
            <Text style={styles.nameStyle}>{item?.name}</Text>
            {item?.verified == 'Verified' ? (
              <Icons.FontAwesome5
                name={'user-check'}
                color={color.blu}
                size={16}
              />
            ) : null}
          </View>

          <Icons.FontAwesome name="bookmark" color={color.defalt} size={15} />
        </View>

        <View style={[styles.contentStyle, {alignItems: 'flex-start'}]}>
          <View style={[styles.displayFlex, {width: '65%'}]}>
            <Icons.MaterialIcons
              name="location-on"
              color={color.defalt}
              size={20}
            />
            <Text style={[styles.expStyle, {fontSize: 12}]}>
              {item?.Address}
            </Text>
          </View>
          {/* <Text style={styles.disStyle}>{Number(item?.distance)} Km away</Text> */}
          <TouchableOpacity onPress={openInGoogleMaps}>
            <Text style={[styles.disStyle]}>Get Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentStyle}>
          <View style={styles.displayFlex}>
            <Icons.FontAwesome name="phone" color={color.defalt} size={20} />
            <Text style={styles.expStyle}>{item?.phone_number}</Text>
          </View>
          <Text style={styles.expStyle}>( {item?.experience} Years Exp )</Text>
        </View>

        <View style={styles.ratingCont}>
          <View style={styles.ratContent}>
            <Text style={styles.ratTitle}>Rating</Text>
            <View style={styles.displayFlex}>
              <Icons.FontAwesome name="star" color={color.ylow} size={15} />
              <Text style={styles.totRat}>
                {item?.averageRating.toFixed(2)}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.ratContent,
              {
                borderLeftColor: color.litGry,
                borderLeftWidth: 2,
                width: '50%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                zIndex: -10,
              },
            ]}>
            <Text style={styles.ratTitle}>Total Jobs</Text>
            <Text style={[styles.totRat, {paddingRight: '13 %'}]}>
              {item?.totaljob}
            </Text>
          </View>
        </View>

        <View style={styles.contentStyle}>
          <Text style={styles.serInc}>Services</Text>
          {/* <View style={styles.displayFlex}>
            <Text style={styles.licenseStyle}>License </Text>
            <Icons.FontAwesome
              name="file-text"
              color={color.defalt}
              size={20}
            />
          </View> */}
        </View>

        <View style={styles.listCont}>
          {/* <FlatList
            data={item?.skills}
            renderItem={({item, index}) => (
              <SrvicLst
                index={index}
                item={item}
                keyExtractor={({item, index}) => `service_${index}`}
              />
            )}
          /> */}
          {skills.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                // paddingHorizontal: 20,
                marginVertical: 15,
              }}>
              {skills.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedSkill(item);
                    setSkillModal(true);
                  }}
                  style={{
                    backgroundColor: color.defalt,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                  }}>
                  <Text style={{color: 'white', fontWeight: '600'}}>
                    {item.select_bussiness}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.reviewCont}>
          <View style={styles.contentStyle}>
            <Text style={styles.serInc}>
              {
                (item?.people_review || []).filter(
                  review => review?.name && review?.rating,
                ).length
              }{' '}
              Reviews
            </Text>

            {/* <TouchableOpacity>
              <Text style={[styles.licenseStyle, {fontWeight: '400'}]}>
                See All
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={openAllReviews}>
              <Text style={[styles.licenseStyle, {fontWeight: '400'}]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={(item?.people_review || []).filter(review => review?.rating)}
            keyExtractor={(review, index) => index.toString()}
            contentContainerStyle={{paddingVertical: 10}}
            renderItem={({item, index}) => (
              <RviewLst item={item} index={index} />
            )}
          />
        </View>
        <View style={styles.btnContainer}>
          <BotonComp
            onPressFunc={() => {
              setIsInboxPressed(true); // Enable the "Book Service" button
              navigation.navigate('IndividualChat', {currentuser: item});
            }}
            btnText="Inbox"
            BtnStyle={styles.BtnStyle}
          />
          <BotonComp
            btnText="Book Service"
            BtnStyle={styles.BtnStyle}
            onPressFunc={toggleModal}
          />
        </View>
      </ScrollView>
      <Modal
        visible={singleReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSingleReviewModal(false)}>
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewModalBox}>
            {/* Header */}
            <View style={styles.reviewModalHeader}>
              <Text style={styles.reviewModalTitle}>Review Detail</Text>

              <TouchableOpacity onPress={() => setSingleReviewModal(false)}>
                <Icons.FontAwesome5 name="times" size={18} color={color.wite} />
              </TouchableOpacity>
            </View>

            {/* Review Content */}
            {selectedReview && (
              <View style={{padding: 15}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    style={{width: 80, height: 80, borderRadius: 60}}
                    resizeMode="cover"
                    source={{
                      uri: selectedReview?.profile
                        ? `${BASIC_URL}uploads//${selectedReview.profile}`
                        : `${BASIC_URL}uploads/dumy.png`,
                    }}
                  />
                  <Text
                    style={{fontSize: 18, fontWeight: '700', color: '#000'}}>
                    {selectedReview.name}
                  </Text>

                  <Text style={{marginTop: 4, fontSize: 12, color: '#000'}}>
                    Rating (⭐{selectedReview.rating})
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#000',
                  }}>
                  Review:
                </Text>
                <Text style={{fontSize: 14, color: color.gry}}>
                  {selectedReview.feedback}
                </Text>
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
            {/* Header */}
            <View style={styles.reviewModalHeader}>
              <Text style={styles.reviewModalTitle}>All Reviews</Text>

              <TouchableOpacity onPress={() => setAllReviewsModal(false)}>
                <Icons.FontAwesome5 name="times" size={18} color={color.wite} />
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              style={{flexGrow: 0}}
              // data={item?.people_review}
              data={(item?.people_review || []).filter(
                review => review?.rating,
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{padding: 15}}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.allReviewItem}
                  onPress={() => {
                    setAllReviewsModal(false);
                    openSingleReview(item);
                  }}>
                  {/* Row: Left Content + Chevron */}
                  <View style={styles.reviewRow}>
                    {/* Left Side */}
                    <View style={styles.reviewLeft}>
                      <Image
                        style={styles.logoImg}
                        resizeMode="cover"
                        source={{
                          uri: item?.profile
                            ? `${BASIC_URL}uploads//${item.profile}`
                            : `${BASIC_URL}uploads/dumy.png`,
                        }}
                      />

                      <View>
                        <Text style={styles.reviewName}>{item.name}</Text>
                        <Text style={styles.reviewRating}>
                          Rating (⭐{item.rating})
                        </Text>
                        {/* Feedback Below */}
                        <Text numberOfLines={1} style={styles.reviewFeedback}>
                          {item.feedback}
                        </Text>
                      </View>
                    </View>

                    {/* Right Chevron perfectly centered */}
                    <View style={styles.chevronBox}>
                      <Icons.Feather
                        name="chevron-right"
                        size={24}
                        color={color.gry}
                      />
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
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 15,
              padding: 20,
            }}>
            {selectedSkill && (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: color.defalt,
                    marginBottom: 10,
                  }}>
                  {selectedSkill.select_bussiness}
                </Text>

                <Text style={{marginBottom: 10, color: '#000'}}>
                  Experience: {selectedSkill.working_experience} years
                </Text>

                {selectedSkill.certificates && (
                  <Image
                    source={{
                      uri: `${BASIC_URL}uploads/${selectedSkill.certificates}`,
                    }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 10,
                      marginBottom: 15,
                    }}
                    resizeMode="cover"
                  />
                )}

                <TouchableOpacity
                  onPress={() => setSkillModal(false)}
                  style={{
                    backgroundColor: color.defalt,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#fff', fontWeight: '600'}}>Close</Text>
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
  inputContainer: {
    marginBottom: 10,
  },
  scrollView: {
    paddingHorizontal: 15,
    marginTop: 20,
  },

  inputCont: {
    marginVertical: 10,
    width: '100%',
  },
  deliverCont: {
    paddingBottom: 15,
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
    fontSize: 20,
    color: color.blak,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 5,
  },
  msgTitle: {
    fontSize: 16,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'left',
    paddingVertical: 6,
  },
  statusStyle: {
    fontSize: 14,
    color: color.rd,
    fontWeight: '400',
  },
  logoImg: {
    width: width / 6,
    height: height / 15,
    borderRadius: 10,
    marginRight: 7,
  },
  titleCont: {
    paddingBottom: 18,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
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
    fontSize: 23,
    color: color.defalt,
    marginRight: 5,
  },
  disStyle: {
    fontSize: 12,
    color: color.defalt,
    fontWeight: '600',
  },
  expStyle: {
    fontSize: 16,
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
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 1,
  },
  ratContent: {
    justifyContent: 'flex-start',
  },
  ratTitle: {
    fontSize: 18,
    color: color.gry,
    paddingBottom: 7,
  },
  totRat: {
    fontSize: 18,
    color: color.blak,
    paddingLeft: 5,
    fontWeight: '600',
    textAlign: 'center',
  },
  serInc: {
    fontSize: 18,
    color: color.defalt,
    fontWeight: '600',
  },
  licenseStyle: {
    fontSize: 18,
    color: color.defalt,
    fontWeight: '600',
    paddingRight: 6,
  },
  serviceCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  listStyle: {
    fontSize: 17,
    color: color.gry,
    fontWeight: '400',
    paddingRight: 2,
  },
  listCont: {
    marginBottom: 10,
  },
  btnContainer: {
    //position: 'absolute',
    //bottom: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    //zIndex: 1,
    // paddingHorizontal: 20,
    paddingBottom: 0,
  },
  BtnStyle: {
    width: '46%',
    marginTop: 0,
    // marginBottom: '10%',
  },

  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 100,
  },
  modalView: {
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: color.wite,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
    // marginBottom: 20,
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
    zIndex: 100,
  },
  cancelCont: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 19,
    color: color.wite,
    fontWeight: '600',
  },
  labelStyle: {
    fontSize: 19,
    color: color.blak,
    fontWeight: '600',
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
  revListing: {
    paddingHorizontal: 6,
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
    fontSize: 16,
    color: '#000',
  },

  reviewRating: {
    // marginTop: 3,
    fontSize: 12,
    color: '#000',
  },

  reviewFeedback: {
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 14,
    color: color.gry,
  },
});
