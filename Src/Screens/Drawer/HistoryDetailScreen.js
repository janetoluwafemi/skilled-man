import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Icons} from '../../Components/Icons';
import {BASIC_URL} from '../Signin/Signin';

const displayValue = value =>
  value === null || value === undefined || String(value).trim() === ''
    ? 'Not provided'
    : String(value);

const DetailRow = ({icon, label, value}) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Icons.Feather name={icon} size={16} color="#C07A50" />
    </View>
    <View style={styles.detailCopy}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{displayValue(value)}</Text>
    </View>
  </View>
);

const HistoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const booking = route.params?.booking || {};
  const status = displayValue(booking.status);
  const statusStyle =
    status.toLowerCase() === 'complete' || status.toLowerCase() === 'completed'
      ? styles.statusComplete
      : status.toLowerCase() === 'rejected' ||
          status.toLowerCase() === 'cancelled'
        ? styles.statusCancelled
        : styles.statusPending;

  const openAttachment = () => {
    if (!booking.file) {
      return;
    }
    const fileUrl = `${BASIC_URL}uploads/${encodeURIComponent(booking.file)}`;
    Linking.openURL(fileUrl).catch(error =>
      console.error('Unable to open booking attachment:', error),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <View style={styles.headerBar}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeading}>
          <Text style={styles.welcomeTitle}>Booking Details</Text>
          <Text style={styles.welcomeSubtitle}>
            Review the information for this service booking.
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.personRow}>
            {booking.profile ? (
              <Image
                source={{uri: `${BASIC_URL}uploads/${booking.profile}`}}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Icons.Feather name="user" size={25} color="#C07A50" />
              </View>
            )}
            <View style={styles.personCopy}>
              <Text style={styles.personName}>
                {displayValue(booking.name)}
              </Text>
              <Text style={styles.bookingNumber}>
                Booking #{displayValue(booking.booking_id)}
              </Text>
            </View>
            <View style={[styles.statusBadge, statusStyle]}>
              <Text style={[styles.statusText, {color: statusStyle.color}]}>
                {status}
              </Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <Text style={styles.serviceLabel}>SERVICE</Text>
          <Text style={styles.serviceName}>
            {displayValue(booking.service)}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Booking price</Text>
            <Text style={styles.priceValue}>
              PKR {displayValue(booking.price)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Booking information</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon="calendar"
            label="Service date"
            value={booking.service_date}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="clock"
            label="Service time"
            value={booking.service_time}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="hash"
            label="Booking ID"
            value={booking.booking_id}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="activity"
            label="Booking status"
            value={booking.status}
          />
        </View>

        <Text style={styles.sectionTitle}>Contact information</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon="user"
            label="Name"
            value={booking.name}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="phone"
            label="Phone number"
            value={booking.user_number}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="message-circle"
            label="WhatsApp"
            value={booking.user_whatsapp}
          />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="briefcase"
            label="Provider ID"
            value={booking.provider_id}
          />
        </View>

        <Text style={styles.sectionTitle}>Attachment</Text>
        <TouchableOpacity
          activeOpacity={booking.file ? 0.75 : 1}
          disabled={!booking.file}
          onPress={openAttachment}
          style={[styles.attachmentCard, !booking.file && styles.disabledCard]}>
          <View style={styles.attachmentIcon}>
            <Icons.Feather name="file-text" size={20} color="#C07A50" />
          </View>
          <View style={styles.attachmentCopy}>
            <Text style={styles.attachmentTitle}>
              {booking.file ? 'Booking attachment' : 'No attachment'}
            </Text>
            <Text style={styles.attachmentName} numberOfLines={1}>
              {displayValue(booking.file)}
            </Text>
          </View>
          {booking.file ? (
            <Icons.Feather name="external-link" size={17} color="#8791A3" />
          ) : null}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FB',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },
  pageHeading: {
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
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  summaryCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F4',
    elevation: 2,
    shadowColor: '#26334D',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#F8EDE5',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  personCopy: {
    flex: 1,
    marginHorizontal: 11,
  },
  personName: {
    color: '#172033',
    fontWeight: '700',
    fontSize: 16,
  },
  bookingNumber: {
    color: '#8993A5',
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statusPending: {
    color: '#A76A16',
    backgroundColor: '#FFF5DF',
  },
  statusComplete: {
    color: '#27815C',
    backgroundColor: '#E7F7EF',
  },
  statusCancelled: {
    color: '#B44848',
    backgroundColor: '#FCECEC',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0F1F4',
    marginVertical: 17,
  },
  serviceLabel: {
    color: '#929BAD',
    letterSpacing: 1.2,
    fontSize: 10,
    fontWeight: '700',
  },
  serviceName: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F4',
  },
  priceLabel: {
    color: '#788397',
    fontSize: 13,
  },
  priceValue: {
    color: '#C07A50',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 23,
    marginBottom: 10,
  },
  detailsCard: {
    paddingHorizontal: 15,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F4',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FBF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: {
    flex: 1,
    marginLeft: 11,
  },
  detailLabel: {
    color: '#8993A5',
    fontSize: 11,
  },
  detailValue: {
    color: '#26334D',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F0F1F4',
    marginLeft: 45,
  },
  attachmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF0F4',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledCard: {
    opacity: 0.75,
  },
  attachmentIcon: {
    height: 42,
    width: 42,
    borderRadius: 14,
    backgroundColor: '#FBF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentCopy: {
    flex: 1,
    marginHorizontal: 11,
  },
  attachmentTitle: {
    color: '#26334D',
    fontSize: 13,
    fontWeight: '700',
  },
  attachmentName: {
    color: '#8993A5',
    fontSize: 11,
    marginTop: 4,
  },
});
