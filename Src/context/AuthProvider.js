import React, {createContext, useReducer, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuth: false,
  role: null, // Add the role property
};

const athReducr = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        isAuth: true,
        role: action.payload.role, // Set the role when the user logs in
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};


export const AthProvidr = ({children}) => {
  const [state, dispatch] = useReducer(athReducr, initialState);

//   const signinGoogle = async (userInfo, userRole) => {
//      userInfo = await AsyncStorage.getItem('userInfo');
//      userRole = await AsyncStorage.getItem('userRole');
//     console.log('user value in local storage', userRole);
//     console.log('role value in local storage', userRole);
//     if (userInfo && userRole) {
//         const data = JSON.parse(userInfo);
  
//         dispatch({type: 'LOGIN', payload: {user: JSON.parse(userInfo), userRole}});
//         global.email = data.email;
//         global.id = data.id;
//         global.name = data.name;
//         global.phone_number = data.phone_number;
        
//         global.state = data.state;
       
//         global.role = data.userRole;
       
//         global.profile = data.profile;
//       }
    
//   };
const signinGogl = async () => {
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userRole = await AsyncStorage.getItem('userRole');

    //   console.log('user value in local storage', userInfo);
    //   console.log('role value in local storage', userRole);

      if (userInfo && userRole) {
        const data = JSON.parse(userInfo);

        dispatch({type: 'LOGIN', payload: {user: data, userRole}});

        global.email = data.email;
        global.id = data.id;
        global.name = data.name;
        global.phone_number = data.phone_number;
        global.state = data.state;
        global.role = userRole; // Corrected this line
        global.profile = data.profile;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };


  const chkUsrAthAndRol = async () => {
    const user = await AsyncStorage.getItem('user');
    const role = await AsyncStorage.getItem('role');
    // console.log('user value in local storage', user);
    // console.log('role value in local storage', role);

    if (user && role) {
      const data = JSON.parse(user);

      dispatch({type: 'LOGIN', payload: {user: JSON.parse(user), role}});
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
  };

  useEffect(() => {
    chkUsrAthAndRol();
  }, []);

  return (
    <AuthContext.Provider value={{state, dispatch,signinGoogle: signinGogl}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
