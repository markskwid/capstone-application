import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  TextInput, Modal, TouchableOpacity, ScrollView, Platform, Image, KeyboardAvoidingView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'expo-image-picker';
import { fonts } from 'react-native-elements/dist/config';
import * as firebase from "firebase/app";
import { getDatabase, ref as ref_database, set, get, update, onValue, orderByChild, onChildAdded, onChildChanged, onChildRemove, equalTo, push } from "firebase/database";
import { validateContextObject } from '@firebase/util';
import {database} from '@react-native-firebase/database';
import QR from './qrCode';
import { getStorage,  ref as ref_storage, child, put, putFile, uploadBytes, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const db = getDatabase(); 

const Confirmation = ({navigation, route}) =>{
    const {reservationInfo} = route.params;
  
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('')
    const [message, setMessage] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [qr, setQr] = useState('')
    const qrValue = {
        key: qr
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
          const filename = result.uri.substring(result.uri.lastIndexOf('/')+1); 
          setImage(result.uri);
          setImageName(filename)
         
        }
    }

    const uploadImage = async () =>{
      
      const metadata = {
        contentType: 'image/jpg',
      };
      const response = await fetch(image);
      const blob = await response.blob();
     
     const storage = getStorage();
     const imageRef = ref_storage(storage, "reservation/" + imageName);
     uploadBytes(imageRef, blob).then((snapshot) => {
         console.log('Uploaded a blob or file!', imageName);
     });
 }

    function addReservation(){ 
        reservationInfo.image = imageName
        reservationInfo.message = message    
        if(imageName != ''){
          uploadImage()
          var id = push(ref_database(db, 'reservation/'), reservationInfo).key
          setQr(id)
          console.log(qr)
          setModalVisible(true)
        }else{
          var id = push(ref_database(db, 'reservation/'), reservationInfo).key
          setQr(id)
          console.log(qr)
          setModalVisible(true)
        }     
      }
    
      const imagesCallback = (callback) => {
        callback.then((photos) => {
          console.log(photos);
          alert(photos);
        }).catch((e) => console.log(e))
      };
      const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
      const noCameraPermissionComponent = <Text style={styles.emptyStay}>No access to camera</Text>;

      const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{number}</Text>
        </View>
      );
    
    return(
       <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <SafeAreaView style={styles.mainContainer}>
          
          <ScrollView>
         
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              blurRadius={50}
            >
             <View style={styles.modalView}>
                         
            <View style={styles.modalBody}>
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" style={{alignSelf: 'center', elevation: 10}} color={'#950245'} size={140} />
          <View style={styles.modalContainer}>
            <Text style={styles.modalLabelTitle}>Great!</Text>
            <Text style={styles.modalLabel}>Your appointment has been added!</Text>
             <View>
              <TouchableOpacity style={styles.btnModal} 
                onPress={() => setTimeout(() => navigation.replace('Your QR Code', {qrValue}), 1000) || setModalVisible(false)}>                 
                  <Text style={styles.btnModalText}>GET YOUR QR CODE NOW</Text>     
                </TouchableOpacity>
             </View>
           </View>
                                
            </View>
          </View>                   
        </Modal>
         <View style={styles.serviceInfo}>
          
            <View style={styles.serviceContainer}>
               {reservationInfo.type.trim() == "Hair" ? (
                    <Image style={styles.serviceType} source={require('../picture/icon1.png')}/>
               ): reservationInfo.type.trim() == 'Eyelashes' ? (
                <Image style={styles.serviceType} source={require('../picture/eye.png')}/>
               ):  <Image style={styles.serviceType} source={require('../picture/manicure.png')}/>}
            </View>

           <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>
                   <Text style={styles.itMustbeBold}>Date: </Text> {reservationInfo.day + ", " + reservationInfo.month + " " + reservationInfo.date + ", " + reservationInfo.year }{"\n"}
                   <Text style={styles.itMustbeBold}>Time: </Text> {reservationInfo.time}{"\n"}
                   <Text style={styles.itMustbeBold}>Service: </Text> {reservationInfo.service}{"\n"}
                   <Text style={styles.itMustbeBold}>Contact: </Text>{global.employeeContact}
                </Text>
           </View>
         </View>
        
         <Text style={styles.lblConsult}>Consultation: </Text>
        <View style={styles.consultationContainerImage}>
            {image && <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius: 20,  marginLeft: 5 }} />}
            <TouchableOpacity style={styles.btn} title="Pick an image from camera roll" onPress={pickImage}>
            {image === null ? (
               <MaterialCommunityIcons name="plus" style={{alignSelf: 'center', marginTop: 20, elevation: 10}} color={'gray'} size={100} />
            ): ( <MaterialCommunityIcons name="restore" style={{alignSelf: 'center', marginTop: 20, elevation: 10}} color={'gray'} size={100} />)}
            </TouchableOpacity>

        </View>

        <Text style={styles.lblConsult}>Message: </Text>
     
       
          <View style={styles.consultationContainer}>
            
            <TextInput 
              multiline={true}
              numberOfLines={4}
              style={styles.multiText}
              placeholder='Input your message here...'
              value={message}
              onChangeText={(text) => setMessage(text)}/>
        </View>
       
          </ScrollView>
         
         <TouchableOpacity style={styles.confirmBtn}
          onPress={addReservation}>
             <Text style={styles.lbl}>Confirm Reservation</Text>
         </TouchableOpacity>
        </SafeAreaView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 20,
    },

    serviceInfo: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        padding: 10,
    },

    multiText: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        height: 150,
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
    },

    consultationContainer: {
        padding: 10,
    },

    consultationContainerImage: {
        padding: 5,
        flexDirection: 'row'
    },

    btn:{
        width: 150,
        height: 150,
        backgroundColor: 'pink',
        marginLeft:  10,
        borderWidth: 1,
        borderColor: '#FD62A1',
        borderRadius: 20,
        elevation: 5,
    },

    dateInfo: {
        padding: 20,
    },

    dateLabel :{
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },

    lblConsult: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        padding: 10,
    },

    itMustbeBold: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },

    lbl: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        textAlign: "center",
    },

    serviceContainer: {
        backgroundColor: 'pink',
        borderWidth: 2,
        borderColor: '#FD62A1',
        padding: 12,
        borderRadius: 20,
        alignContent: 'center',
        elevation: 5,
    },

    serviceType:{
        width: 100,
        height: 100,
        alignSelf: 'center',
    },

    confirmBtn: {
        backgroundColor: '#FD62A1',
        width: Dimensions.get('window').width,
        height: 100,
        marginTop: 'auto',
        padding: 15,
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

    
  modalView:{
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight + 180,   
   
  },

  check:{
    height: 150,
    width: 150,
  },

  modalHead: {
    backgroundColor: 'pink',
    width: 300,
    height: 160,
  },

  modalBody:{
    alignSelf: 'center',
    backgroundColor: 'pink',
    borderRadius: 10,
    elevation: 5,
    height: 330,
   padding: 22,
   borderWidth: 2,
   width: Dimensions.get('window').width - 30,
  },

  modalLabel:{
    fontSize: 16,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: "Poppins_600SemiBold",
  },

  modalLabelTitle:{
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold'
  },

  btnModal: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#FD62A1',
    padding: 10,
    borderRadius: 10,
    width: 300,
    elevation: 5,
  },

  btnModalText: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  }
})
export default Confirmation;