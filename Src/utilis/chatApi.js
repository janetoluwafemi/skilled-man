import { BASIC_URL } from '../Screens/Signin/Signin';

const postChatRequest = async (endpoint, parameters) => {
  const formData = new FormData();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(`${BASIC_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });
  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Invalid response from ${endpoint}`);
  }

  if (!response.ok || result?.success === false || result?.error) {
    throw new Error(result?.message || result?.error || `Request failed (${response.status})`);
  }

  return result;
};

export const getAllChats = ownId =>
  postChatRequest('get_all_chats.php', {own_id: ownId});

export const getChatMessages = (senderId, receiverId, ownId = senderId) =>
  postChatRequest('get_chats.php', {
    sender_id: senderId,
    receiver_id: receiverId,
    own_id: ownId,
  });

export const sendChatMessage = (senderId, receiverId, message) =>
  postChatRequest('firebase/send_notification.php', {
    sender_id: senderId,
    receiver_id: receiverId,
    message,
  });

export const blockChatUser = (userId, blockedId) =>
  postChatRequest('chat_block_user.php', {
    user_id: userId,
    blocked_id: blockedId,
  });

export const unblockChatUser = (userId, blockedId) =>
  postChatRequest('chat_unblock_user.php', {
    user_id: userId,
    blocked_id: blockedId,
  });

export const getBlockedChatUsers = userId =>
  postChatRequest('chat_blocked_users.php', {user_id: userId});

export const deleteChatMessage = (userId, chatId, deleteFor = 'me') =>
  postChatRequest('chat_delete_message.php', {
    user_id: userId,
    chat_id: chatId,
    delete_for: deleteFor,
  });

export const editChatMessage = (userId, chatId, message) =>
  postChatRequest('chat_edit_message.php', {
    user_id: userId,
    chat_id: chatId,
    message,
  });

export const clearChat = (userId, otherUserId) =>
  postChatRequest('chat_clear.php', {
    user_id: userId,
    other_user_id: otherUserId,
  });

export const reportChatUser = (reporterId, reportedId, reason, details, chatId) =>
  postChatRequest('chat_report_user.php', {
    reporter_id: reporterId,
    reported_id: reportedId,
    reason,
    details,
    chat_id: chatId,
  });

export const getChatResultItems = result => {
  const items =
    result?.chats ||
    result?.messages ||
    result?.chat ||
    result?.data?.chats ||
    result?.data?.messages ||
    result?.data?.chat ||
    result?.data ||
    [];
  if (Array.isArray(items)) return items;
  if (items && typeof items === 'object') return [items];
  return [];
};
