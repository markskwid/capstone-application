import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  Button, ImageBackground, TouchableOpacity, ScrollView, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import { fonts } from 'react-native-elements/dist/config';
import { CommonActions } from '@react-navigation/native';


const QR = ({navigation, route}) =>{
    const {qrValue} = route.params;
    let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

     
    const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Home_Employee" }],
    });
 
    return(
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.note}>Please take a screenshot of this QR Code for contact tracing</Text>
          <View style={styles.qr}>
            <View style={{alignSelf: 'center'}}>
                <QRCode
                value={qrValue.key}
                logo={{uri: base64Logo}}
                logoSize={30}
                logoBackgroundColor='transparent'
                backgroundColor={'transparent'}
                size={290}
            
                />
            </View>
           <TouchableOpacity style={styles.forconfirmBtn}
           onPress={() => {navigation.dispatch(resetAction);}}>
               <Text style={styles.lbl}>Go to Homescreen</Text>
           </TouchableOpacity>
          </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
        alignContent: 'center'
    },

    qr:{
        alignSelf: 'center'
    },

    note:{
        fontFamily: 'Poppins_600SemiBold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 50,
    },

    container: {
        width: 196,
        height: 300,
        borderWidth: 1,
        borderRadius: 30,
        marginRight: 'auto',
        marginTop: 5,
        elevation: 5,
    },

    imageBg:{
        width: 193,
        height: 298,
    },

    label: {
        textAlign: 'center',
        fontSize: 25,
        fontFamily: "Poppins_600SemiBold",
        color: '#FD62A1',
        textShadowColor: 'black',
       
        
    },

    bgLabel: {
        backgroundColor: 'pink',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginTop: 255,
        width: 'auto',
        padding: 5,
    },

    
  forconfirmBtn: {
    backgroundColor: "#FD62A1",
    height: 45,
    marginTop: 55,
    padding: 10,
    width: Dimensions.get('window').width - 70,
    borderRadius: 5,    
    textAlign: "center",   
    fontFamily: 'Poppins_400Regular',   
    elevation: 5,
  },

  lbl: {
      textAlign: 'center',
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 18,
  }

})
export default QR;