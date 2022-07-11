import React from 'react';
import Home_Employee from '../screens/employee/homescreen.js';
import Profile_Employee from '../screens/employee/profile.js';
import Others_Employee from '../screens/employee/others.js';
import Home_Customer from '../screens/customer/customer_home.js';
import SignUp from '../screens/signup.js';
import Login from '../screens/login.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Tab = createMaterialBottomTabNavigator();


const material_navigation = () =>{
    return(
        <Tab.Navigator  initialRouteName='Home_Bottom' barStyle={{ backgroundColor: '#FD62A1' }}
      >
            <Tab.Screen name="Home" component={Home_Employee} 
            
            options={{   
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={25} style={{alignSelf: "center"}} />
                ),
              }}/>

      


        <Tab.Screen name="Others" component={Others_Employee} 
            options={{
                tabBarLabel: 'Others',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="dots-horizontal-circle-outline" color={color} size={25} style={{alignSelf: "center"}} />
                ),
              }}/>

        <Tab.Screen name="Profile" component={Profile_Employee} 
            options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={25} style={{alignSelf: "center"}} />
                ),
              }}/>

              
        </Tab.Navigator>

        
    );
};


export default material_navigation;