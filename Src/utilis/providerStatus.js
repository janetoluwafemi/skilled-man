import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASIC_URL} from '../Screens/Signin/Signin';

const getProviderId = async () => {
  const currentId = String(global.id || '').trim();
  if (currentId) {
    return currentId;
  }

  const storedUser = await AsyncStorage.getItem('user');
  if (!storedUser) {
    return '';
  }

  const user = JSON.parse(storedUser);
  const providerId = user?.id ?? user?.provider_id ?? user?.user_id;
  if (providerId) {
    global.id = String(providerId);
    return String(providerId);
  }

  return '';
};

const getBookings = async ({status, searchTerm = ''} = {}) => {
  const providerId = await getProviderId();
  if (!providerId) {
    return [];
  }

  const formData = new FormData();
  formData.append('provider_id', providerId);
  if (status) {
    formData.append('status', status);
  }
  if (searchTerm.trim()) {
    formData.append('searchTerm', searchTerm.trim());
  }

  const response = await fetch(`${BASIC_URL}provider_status.php`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || 'Unable to fetch bookings.');
  }

  if (Array.isArray(result?.booking_request)) {
    return result.booking_request;
  }
  if (result?.booking_request && typeof result.booking_request === 'object') {
    return Object.values(result.booking_request);
  }
  if (result?.error === 'Record Not Exist.') {
    return [];
  }

  throw new Error(result?.error || 'Unexpected booking response.');
};

const updateBookingStatus = async (bookingId, status) => {
  const formData = new FormData();
  formData.append('id', String(bookingId));
  formData.append('status', status);

  const response = await fetch(`${BASIC_URL}status_update.php`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || result?.error) {
    throw new Error(result?.error || 'Unable to update booking status.');
  }

  return result;
};

export {getBookings, updateBookingStatus};
