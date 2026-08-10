import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuth: false,
  role: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        isAuth: true,
        role: action.payload.role,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signInGoogle = useCallback(async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const userRole = await AsyncStorage.getItem('userRole');

      if (userInfo && userRole) {
        const data = JSON.parse(userInfo);

        dispatch({
          type: 'LOGIN',
          payload: { user: data, role: userRole },
        });

        global.email = data.email;
        global.id = data.id;
        global.name = data.name;
        global.phone_number = data.phone_number;
        global.state = data.state;
        global.role = userRole;
        global.profile = data.profile;
      }
    } catch (error) {
      console.log('Error signing in with Google:', error);
    }
  }, []);

  const checkUserAuthAndRole = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const role = await AsyncStorage.getItem('role');

      if (user && role) {
        const data = JSON.parse(user);

        dispatch({
          type: 'LOGIN',
          payload: { user: data, role },
        });

        global.email = data.email;
        global.id = data.id;
        global.name = data.name;
        global.phone_number = data.phone_number;
        global.address = data.address;
        global.state = data.state;
        global.whatsapp = data.whatsapp;
        global.role = role;
        global.working_experience = data.working_experience;
        global.profile = data.profile;
      }
    } catch (error) {
      console.log('Error checking user auth:', error);
    }
  }, []);

  useEffect(() => {
    checkUserAuthAndRole();
  }, [checkUserAuthAndRole]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        signinGoogle: signInGoogle,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AthProvidr = AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};