
import React, { Component } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, TextInput, Button, Image, TouchableOpacity, TouchableOpacityBase} from 'react-native';

import Tabs from '../../routes/bottom_routes.js';

const home = () =>{
    return(         
       <Tabs />
    );
}

const home_emp = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: '#fff',
        textAlign: "center",
        paddingTop: Platform.OS === "android" ? 120: 0,
      },
});
export default home;