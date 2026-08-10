import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../context/AuthProvider';
import NavigationService from './NavigationService';
import PblicRout from './PublicRoutes';
import PrivatRout from './PrivateRoute';

const MainNavigateHub = () => {
    const { state } = useAuth();

    return (
        <NavigationContainer
            ref={navigatorRef => {
                if (navigatorRef) {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }
            }}>
            {state?.role ? <PrivatRout /> : <PblicRout />}
        </NavigationContainer>
    );
};

export default MainNavigateHub;