import React from 'react';
import {StyleSheet, View, Dimensions ,
  Platform} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ComplteTab from './CompleteTab';
import OngoingTabs from './OngoingTab';
import AlTabs from './AllTab';
import color from '../../Assets/colors/colors';

const { height } = Dimensions.get('window');
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;

const getResponsiveSize = (small, medium, large) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
};

const Tab = createMaterialTopTabNavigator();

const MyWorkTab = props => {
    return (
        <View style={styles.wrapper}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: color.defalt,
                    tabBarInactiveTintColor: '#64748B',
                    tabBarPressColor: '#EFF6FF',
                    tabBarLabelStyle: {
                        fontSize: getResponsiveSize(13, 14, 15),
                        fontWeight: '700',
                        textTransform: 'none',
                    },
                    tabBarStyle: {
                        backgroundColor: '#F8FAFC',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        marginTop: getResponsiveSize(4, 6, 8),
                        paddingHorizontal: 12,
                    },
                    tabBarIndicatorStyle: {
                        height: 3,
                        backgroundColor: color.defalt,
                        borderRadius: 3,
                    },
                }}>
                <Tab.Screen
                    name="Complete"
                    component={ComplteTab}
                    initialParams={{ ...props }}
                    options={{ title: 'Complete' }}
                />
                <Tab.Screen
                    name="Ongoing"
                    component={OngoingTabs}
                    initialParams={{ ...props }}
                    options={{ title: 'Ongoing' }}
                />
                <Tab.Screen
                    name="AllTab"
                    component={AlTabs}
                    initialParams={{ ...props }}
                    options={{ title: 'All' }}
                />
            </Tab.Navigator>
        </View>
    );
};

export default MyWorkTab;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
});