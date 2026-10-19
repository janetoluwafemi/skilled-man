import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icons} from './Icons';

const {width, height} = Dimensions.get('window');
const urlRegex = /(https?:\/\/[^\s]+)/g;
const ChatUserHeader = ({
  userName,
  userImage,
  onlineStatus,
  onProfilePress,
  onSearchPress,
  onBlockPress,
  onDeleteChatPress,
  onReportPress,
  onVoiceCallPress,
  voiceCallLoading = false,
  isBlocked = false,
  messages = [],
  chatTheme = 'Default Light',
  disappearingTimer = 'Off',
  onThemeChange = () => {},
  onDisappearingTimerChange = () => {},
}) => {
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(chatTheme);

  const [disappearingModalVisible, setDisappearingModalVisible] =
    useState(false);
  const [selectedDisappearingTimer, setSelectedDisappearingTimer] =
    useState(disappearingTimer);

  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('Media');

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => {
      setShowMoreOptions(false);
    }, 300);
  };

  const renderOption = (label, currentValue, onSelect) => (
    <TouchableOpacity style={styles.optionRow} onPress={() => onSelect(label)}>
      <Text style={styles.optionText}>{label}</Text>
      <View style={styles.radioCircle}>
        {currentValue === label && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  const mediaMessages = useMemo(() => {
    return messages.filter(m => m.image);
  }, [messages]);

  const docMessages = useMemo(() => {
    return messages.filter(m => m.document);
  }, [messages]);

  const linkMessages = useMemo(() => {
    return messages.reduce((acc, m) => {
      if (m.text) {
        const urls = m.text.match(urlRegex);
        if (urls) {
          urls.forEach(url => acc.push({...m, extractedUrl: url}));
        }
      }
      return acc;
    }, []);
  }, [messages]);

  const openUrl = url => {
    Linking.openURL(url).catch(() => console.log('Failed to open URL'));
  };

  return (
    <View
      style={[
        styles.headerContainer,
        chatTheme === 'Dark Mode' && {
          backgroundColor: '#111827',
          borderBottomColor: '#334155',
        },
      ]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Icons.Ionicons
          name="arrow-back"
          size={24}
          color={chatTheme === 'Dark Mode' ? '#F8FAFC' : '#0F172A'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileSection}
        activeOpacity={0.7}
        onPress={onProfilePress}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              userImage
                ? {uri: userImage}
                : require('../Assets/Images/user.jpg')
            }
            style={styles.avatar}
          />
          {onlineStatus ? <View style={styles.onlineBadge} /> : null}
        </View>

        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              chatTheme === 'Dark Mode' && {color: '#F8FAFC'},
            ]}
            numberOfLines={1}>
            {userName || 'User'}
          </Text>
          <Text
            style={[
              styles.statusText,
              chatTheme === 'Dark Mode' && {color: '#CBD5E1'},
            ]}>
            {onlineStatus ? 'Online' : 'Offline'}
            {disappearingTimer !== 'Off' && ` • ⏳ ${disappearingTimer}`}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.headerRightActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icons.Feather name="video" size={22} color={chatTheme === 'Dark Mode' ? '#F8FAFC' : '#0F172A'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          disabled={voiceCallLoading}
          onPress={onVoiceCallPress}>
          {voiceCallLoading ? (
            <ActivityIndicator size="small" color={chatTheme === 'Dark Mode' ? '#F8FAFC' : '#0F172A'} />
          ) : (
            <Icons.Feather name="phone" size={20} color={chatTheme === 'Dark Mode' ? '#F8FAFC' : '#0F172A'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setMenuVisible(true)}>
          <Icons.Feather name="more-vertical" size={22} color={chatTheme === 'Dark Mode' ? '#F8FAFC' : '#0F172A'} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    if (onSearchPress) onSearchPress();
                  }}>
                  <Text style={styles.menuText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    setMediaModalVisible(true);
                  }}>
                  <Text style={styles.menuText}>Media, links, and docs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuText}>Mute notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    setSelectedDisappearingTimer(disappearingTimer);
                    setDisappearingModalVisible(true);
                  }}>
                  <Text style={styles.menuText}>Disappearing messages</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    setSelectedTheme(chatTheme);
                    setThemeModalVisible(true);
                  }}>
                  <Text style={styles.menuText}>Chat theme</Text>
                </TouchableOpacity>
                {showMoreOptions ? (
                  <>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        closeMenu();
                        if (onBlockPress) onBlockPress();
                      }}>
                      <Text style={styles.menuText}>
                        {isBlocked ? 'Unblock' : 'Block'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        closeMenu();
                        if (onDeleteChatPress) onDeleteChatPress();
                      }}>
                      <Text style={styles.menuText}>Delete chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        closeMenu();
                        if (onReportPress) onReportPress();
                      }}>
                      <Text style={styles.menuText}>Report</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.menuItem, styles.menuItemMore]}
                    onPress={() => setShowMoreOptions(true)}>
                    <Text style={styles.menuText}>More</Text>
                    <Icons.Feather
                      name="chevron-right"
                      size={20}
                      color="#0F172A"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={mediaModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setMediaModalVisible(false)}>
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity
              onPress={() => setMediaModalVisible(false)}
              style={{padding: 4}}>
              <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>{userName}</Text>
          </View>

          <View style={styles.tabContainer}>
            {['Media', 'Links', 'Docs'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  activeMediaTab === tab && styles.activeTabBtn,
                ]}
                onPress={() => setActiveMediaTab(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    activeMediaTab === tab && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.mediaContent}>
            {activeMediaTab === 'Media' &&
              (mediaMessages.length > 0 ? (
                <View style={styles.mediaGrid}>
                  {mediaMessages.map((msg, index) => (
                    <Image
                      key={msg._id || index}
                      source={{uri: msg.image}}
                      style={styles.mediaGridImage}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Icons.Feather name="image" size={48} color="#CBD5E1" />
                  <Text style={styles.placeholderText}>
                    No media shared yet
                  </Text>
                </View>
              ))}

            {activeMediaTab === 'Links' &&
              (linkMessages.length > 0 ? (
                <View style={styles.listContainer}>
                  {linkMessages.map((msg, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.listItem}
                      onPress={() => openUrl(msg.extractedUrl)}>
                      <View style={styles.iconCircle}>
                        <Icons.Feather name="link" size={20} color="#3B82F6" />
                      </View>
                      <View style={styles.listTextContainer}>
                        <Text style={styles.listTitle} numberOfLines={1}>
                          {msg.extractedUrl}
                        </Text>
                        <Text style={styles.listSubtitle} numberOfLines={1}>
                          {msg.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Icons.Feather name="link-2" size={48} color="#CBD5E1" />
                  <Text style={styles.placeholderText}>
                    No links shared yet
                  </Text>
                </View>
              ))}

            {activeMediaTab === 'Docs' &&
              (docMessages.length > 0 ? (
                <View style={styles.listContainer}>
                  {docMessages.map((msg, index) => (
                    <TouchableOpacity
                      key={msg._id || index}
                      style={styles.listItem}
                      onPress={() => openUrl(msg.document)}>
                      <View
                        style={[
                          styles.iconCircle,
                          {backgroundColor: '#FEE2E2'},
                        ]}>
                        <Icons.Feather
                          name="file-text"
                          size={20}
                          color="#EF4444"
                        />
                      </View>
                      <View style={styles.listTextContainer}>
                        <Text style={styles.listTitle} numberOfLines={1}>
                          {msg.documentName || 'Document File'}
                        </Text>
                        <Text style={styles.listSubtitle}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Icons.Feather name="file" size={48} color="#CBD5E1" />
                  <Text style={styles.placeholderText}>
                    No documents shared yet
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}>
        <View style={styles.centerModalOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Choose Theme</Text>
            {renderOption('Default Light', selectedTheme, setSelectedTheme)}
            {renderOption('Dark Mode', selectedTheme, setSelectedTheme)}
            <View style={styles.dialogActions}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTheme(chatTheme);
                  setThemeModalVisible(false);
                }}>
                <Text style={styles.dialogBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onThemeChange(selectedTheme);
                  setThemeModalVisible(false);
                }}>
                <Text style={[styles.dialogBtnText, styles.dialogBtnPrimary]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={disappearingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDisappearingModalVisible(false)}>
        <View style={styles.centerModalOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Disappearing Messages</Text>
            <Text style={styles.dialogSubtitle}>
              Messages older than the selected time are removed from this chat.
            </Text>
            {renderOption(
              '24 hours',
              selectedDisappearingTimer,
              setSelectedDisappearingTimer,
            )}
            {renderOption(
              '7 days',
              selectedDisappearingTimer,
              setSelectedDisappearingTimer,
            )}
            {renderOption(
              'Off',
              selectedDisappearingTimer,
              setSelectedDisappearingTimer,
            )}
            <View style={styles.dialogActions}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDisappearingTimer(disappearingTimer);
                  setDisappearingModalVisible(false);
                }}>
                <Text style={styles.dialogBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onDisappearingTimerChange(selectedDisappearingTimer);
                  setDisappearingModalVisible(false);
                }}>
                <Text style={[styles.dialogBtnText, styles.dialogBtnPrimary]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatUserHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    zIndex: 1,
  },
  backBtn: {paddingRight: 8},
  profileSection: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  avatarContainer: {position: 'relative', marginRight: 12},
  avatar: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#CBD5E1'},
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userInfo: {flex: 1},
  userName: {fontSize: 16, fontWeight: '700', color: '#0F172A'},
  statusText: {fontSize: 12, color: '#64748B', marginTop: 1},
  headerRightActions: {flexDirection: 'row', alignItems: 'center'},
  actionBtn: {paddingHorizontal: 10},

  modalOverlay: {flex: 1},
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    width: width > 400 ? 250 : 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {paddingVertical: 12, paddingHorizontal: 16},
  menuItemMore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {fontSize: 15, color: '#0F172A', fontWeight: '400'},

  centerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogBox: {
    width: width * 0.85,
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  dialogSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {fontSize: 16, color: '#334155'},
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  dialogBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  dialogBtnPrimary: {
    color: '#3B82F6',
    marginLeft: 16,
  },

  fullScreenModal: {flex: 1, backgroundColor: '#F8FAFC'},
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {borderBottomColor: '#3B82F6'},
  tabText: {fontSize: 15, color: '#64748B', fontWeight: '600'},
  activeTabText: {color: '#3B82F6'},

  mediaContent: {flexGrow: 1, paddingBottom: 20},

  mediaGrid: {flexDirection: 'row', flexWrap: 'wrap', padding: 2},
  mediaGridImage: {
    width: width / 3 - 4,
    height: width / 3 - 4,
    margin: 2,
    backgroundColor: '#E2E8F0',
  },

  listContainer: {paddingVertical: 8},
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listTextContainer: {flex: 1},
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  listSubtitle: {fontSize: 14, color: '#64748B'},

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    fontWeight: '500',
  },
});
