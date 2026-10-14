import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';

function ActiveAudioCall({call, calleeName, onHangup, onError}) {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      onHangup();
    }
  }, [callingState, onHangup]);

  const hangup = async () => {
    try {
      await call.leave();
      onHangup();
    } catch (callError) {
      onError(callError.message || 'Unable to end the call.');
    }
  };

  return (
    <View style={styles.callPanel}>
      <Text style={styles.callTitle}>Audio call with {calleeName}</Text>
      <Text style={styles.callStatus}>
        {callingState === CallingState.JOINED ? 'Connected' : 'Calling...'}
      </Text>
      <Pressable
        accessibilityRole="button"
        style={[styles.button, styles.hangupButton]}
        onPress={hangup}
      >
        <Text style={styles.buttonText}>End call</Text>
      </Pressable>
    </View>
  );
}

export default function StreamAudioCall({
  apiKey,
  userId,
  userName,
  calleeId,
  calleeName = calleeId,
  getUserToken,
}) {
  const [client, setClient] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let streamClient;

    async function connectUser() {
      setLoading(true);
      setError('');

      try {
        if (!apiKey || !userId || !userName || !getUserToken) {
          throw new Error('Stream API key, user details, and token provider are required.');
        }

        const token = await getUserToken(userId);
        if (!token) {
          throw new Error('Your call service did not return a Stream user token.');
        }

        if (!isMounted) {
          return;
        }

        const user = {id: userId, name: userName};
        streamClient = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user,
          token,
          tokenProvider: () => getUserToken(userId),
        });

        if (isMounted) {
          setClient(streamClient);
        }
      } catch (connectionError) {
        if (isMounted) {
          setError(connectionError.message || 'Unable to connect to Stream.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    connectUser();

    return () => {
      isMounted = false;
      streamClient?.disconnectUser().catch(disconnectError => {
        console.error('Unable to disconnect the Stream user.', disconnectError);
      });
    };
  }, [apiKey, getUserToken, userId, userName]);

  const clearActiveCall = useCallback(() => {
    setActiveCall(null);
    setCalling(false);
  }, []);

  const startCall = async () => {
    if (calling) {
      return;
    }
    if (!client || !calleeId || calleeId === userId) {
      setError('Choose a different Stream user to call.');
      return;
    }

    setCalling(true);
    setError('');
    let call;

    try {
      call = client.call('default', `${userId}-${calleeId}-${Date.now()}`);
      await call.getOrCreate({
        ring: true,
        video: false,
        data: {
          members: [{user_id: userId}, {user_id: calleeId}],
        },
      });
      await call.join();
      setActiveCall(call);
    } catch (callError) {
      if (call) {
        call.leave().catch(leaveError => {
          console.error('Unable to leave the failed Stream call.', leaveError);
        });
      }
      setCalling(false);
      setError(callError.message || 'Unable to start the audio call.');
    }
  };

  if (loading) {
    return <ActivityIndicator accessibilityLabel="Connecting to call service" />;
  }

  if (!client) {
    return <Text accessibilityRole="alert">{error}</Text>;
  }

  return (
    <StreamVideo client={client}>
      {activeCall ? (
        <StreamCall call={activeCall}>
          <ActiveAudioCall
            call={activeCall}
            calleeName={calleeName}
            onHangup={clearActiveCall}
            onError={setError}
          />
        </StreamCall>
      ) : (
        <View>
          <Pressable
            accessibilityRole="button"
            disabled={calling || !calleeId || calleeId === userId}
            style={[styles.button, calling && styles.disabledButton]}
            onPress={startCall}
          >
            <Text style={styles.buttonText}>
              {calling ? 'Connecting...' : `Call ${calleeName}`}
            </Text>
          </Pressable>
          {!!error && <Text accessibilityRole="alert">{error}</Text>}
        </View>
      )}
    </StreamVideo>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#287A50',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  callPanel: {
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  callTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  callStatus: {
    fontSize: 16,
  },
  hangupButton: {
    backgroundColor: '#C62828',
  },
});
