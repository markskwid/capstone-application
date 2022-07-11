import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView,TextInput, Button, Image, TouchableOpacity, Dimensions} from 'react-native';
import * as Font from 'expo-font';
import AppLoading  from 'expo';
import { initializeApp, getApp } from 'firebase/app';
import * as firebase from "firebase/app";
import { getDatabase, ref,child, get, query, onValue, orderByChild, storageBucket, onChildChanged, onChildRemove, equalTo, update } from "firebase/database";
import { validateContextObject } from '@firebase/util';
import { getStorage } from "firebase/storage";
import {database} from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabRouter } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const db = getDatabase()
const ForgotPassword = ({navigation, route}) => {
    const {key} = route.params
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    
    const [errPassword, setErrPass] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [ok, setOk] = useState(false)

    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });

    const reset = () => {
      setPassword('')
      setKey(null)
      setExists(false)
    }

    const inputRef = useRef();
    const editText = useCallback(() => {
      inputRef.current.setNativeProps({ text: "" });
    }, []);


    const checkPassword = () => {
        if(password === confirmPass){
            setErrPass(false)
            setEmpty(false)
            updatePassword()
        }else if (password.length == 0  || confirmPass.length == 0){
            setEmpty(true)
        }else if (password.length == 0 ){
            setEmpty(true)
        }else{
            setErrPass(true)
        }
    }

  
    const updatePassword = () => {
        const dbRef = ref(db, `customer/${key}`);
        update(dbRef, { customer_password: confirmPass })
          .then(() => {
            console.log("Data updated");
            setOk(true)
            navigation.dispatch(resetAction);
            editText
          })
          .catch((e) => {
            console.log(e);
          });
      };

    return(
        <SafeAreaView style={styles.container}>
      
        <View>
        <View style={styles.div2}>
            <Text style={styles.titleHead}>CHANGE PASSWORD</Text>
            <View style={styles.inputCon}>
                <MaterialCommunityIcons name="lock" ref={inputRef} style={styles.iconMaterial} size={30} />
                    <TextInput style={styles.input} placeholder='Enter your new password'
                    value={password} onChangeText={(value) => setPassword(value)}/>
            </View>
            {password.length != 0 ? (
               <View style={styles.inputCon}>
               <MaterialCommunityIcons name="lock" ref={inputRef} style={styles.iconMaterial} size={30} />
                   <TextInput style={styles.input} placeholder='Confirm your password'
                   value={confirmPass} onChangeText={(value) => setConfirmPass(value)}/>
                </View>
            ): null}

            {errPassword == true ? (
                 <View style={styles.warningDiv}>
                 <View style={styles.bg}>
                   <MaterialCommunityIcons
                     name="alert-circle-outline"
                     color={"white"}
                     size={32}
                   />
                 </View>
                 <Text style={styles.warningLabel}>Password didn't match!</Text>
               </View>
            ): empty == true ? (
                <View style={styles.warningDiv}>
                <View style={styles.bg}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    color={"white"}
                    size={32}
                  />
                </View>
                <Text style={styles.warningLabel}>Please input your password.</Text>
              </View>
           ): ok === true ? (
            <View style={styles.okDiv}>
                <View style={styles.Okbg}>
                <MaterialCommunityIcons name="check" color={"white"} size={32} />
                </View>
                <Text style={styles.warningLabel}>
                Proceeding....
                </Text>
            </View>
           ): null}

      
       
            <TouchableOpacity style={styles.forconfirmBtn} onPress={() => checkPassword() }>
            <Text style={styles.title}>CONFIRM</Text>
            </TouchableOpacity>

           
        </View>
        
        </View> 
    
      </SafeAreaView>      

    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: "column",
    },

    okDiv: {
        width: Dimensions.get("window").width - 70,
        backgroundColor: "green",
        height: 50,
        padding: 10,
        flexDirection: "row",
        elevation: 5,
        marginTop: 5,
      },

      Okbg: {
        top: 0,
        bottom: 0,
        backgroundColor: "green",
        position: "absolute",
        padding: 10,
      },
  
    titleHead: {
        fontSize: 25,
        textAlign: "center",
        fontFamily: "Poppins_700Bold",
      },
    
    showPass: {
      color: 'black',
      position: 'absolute',
      right: 0,
      bottom: 6.5,
      opacity: 0.4,
    },
  
    iconMaterial:{
      alignSelf: 'center', elevation: 10, marginTop: 13,
      color: 'black',
    },
  
    iconMaterialError:{
      alignSelf: 'center', elevation: 10, marginTop: 13,
      color: 'red',
    },
  
  
    input: {
      paddingTop: 22,
      paddingLeft: 14,
      width:  Dimensions.get('window').width - 100,
      height: 60,
      fontSize: 17,
      fontFamily: "Poppins_400Regular",
    },
  
    
    inputCon: {
      width: Dimensions.get('window').width - 70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      marginTop: 7,
    },
  
    inputConError: {
      width: Dimensions.get('window').width - 70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: 'red',
      marginTop: 7,
    },
  
   
    logo:{
      width: 250,
      height: 250,
      
    },
  
    warningLabel:{
      fontSize: 17,
      marginTop: 4,
      color: 'white',
      fontFamily: "Poppins_600SemiBold",
      textAlign: 'center',
      marginLeft: 50,
    },
  
    title: {
      textAlign: "center",
      fontFamily: "Poppins_600SemiBold",
      fontSize: 20,
    },
  
    forEmail: {
      padding: 4,
      borderBottomWidth: 1,
      width: Dimensions.get('window').width - 100,
      marginTop: 10,
      height: 60,
      fontSize: 17,
      fontFamily: 'Poppins_400Regular',
    },
  
    forPassword: {
      padding: 4,
      borderBottomWidth: 1,
      width: Dimensions.get('window').width - 100,
      marginTop: 20,
      marginBottom: 10,
      height: 60,
      fontSize: 17,
      fontFamily: 'Poppins_400Regular',
      
    },
  
    forconfirmBtn: {
      backgroundColor: "#FD62A1",
      height: 45,
      marginTop: 15,
      padding: 10,
      width: Dimensions.get('window').width - 70,
      borderRadius: 5,    
      textAlign: "center",   
      fontFamily: 'Poppins_400Regular',   
      elevation: 5,
    },
  
    warningDiv: {
      width: Dimensions.get('window').width - 70,
      backgroundColor: '#ff5656',
      height: 50,
      padding: 10,
      flexDirection: 'row',
      elevation: 5,
      marginTop: 5,
      
    },
  
    bg: {
      top: 0,
      bottom: 0,
      backgroundColor: 'red',
      position: 'absolute',
      padding: 10,
    },
  
    confirmBtn: {
      height: 200,
    },
  
  
    div2: {
      width: Dimensions.get('window').width,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "left",
      flex: 3,
    },
  
   
  });
  

export default ForgotPassword