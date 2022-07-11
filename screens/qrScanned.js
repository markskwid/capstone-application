import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  Modal, ImageBackground, TouchableOpacity, ScrollView, Platform, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStorage, put, ref as ref_storage,putFile, uploadBytes, uploadBytesResumable, getDownloadURL, listAll} from "firebase/storage";
import { getDatabase, child as child_database, set, get, ref as ref_database, query, update, orderBy, limit, onChildAdded, limitToLast, orderByChild, onChildRemoved, push } from "firebase/database";
import { deleteApp } from 'firebase/app';


const dbRef = ref_database(getDatabase());
const db = getDatabase()
const storage = getStorage()

const Scanned = ({navigation, route}) =>{
   const {id} = route.params;
   const [image, setImage] = useState('a')
   const [imageName, setImageName] = useState('a')
   var arr = []
   const [info, setInfo] = useState({arr})
   var profileArr = []
   const [profile, setProfile] = useState({profileArr})
   const [reserveBy, setReserveBy] = useState('')
   useEffect(() => {
       storeAppoint()
       storeProfile()
       setImages()
   })

   const [modalVisible, setModalVisible] = useState(false)
   const ModalAsk = () => {
    return(
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        blurRadius={30}
      >
        <View style={styles.modalView}>
         
           <View style={styles.modalBody}>
           <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="checkbox-marked-circle" style={{alignSelf: 'center'}} color={'#950245'} size={100} />
           <Text style={styles.modalLabelTitle}>You marked this appointment as done</Text>
            <View style={styles.forBtnModal}>
                <TouchableOpacity style={styles.btnModal} 
                onPress={() => setModalVisible(!modalVisible) || addData() }>                  
                <Text style={styles.btnModalText}>Confirm as Done</Text>     
                </TouchableOpacity>
            </View>
           </View>
           
           </View>
        </View>                   
      </Modal>
    )
}


   function deleteAppointment(){
     
      set(ref_database(getDatabase(), `reservation/` + id), null)
      .then(() => {
      console.log('yes yes yow')
      })
      .catch((error) => {
      console.log('taena')
      });
   }

    const addData = () =>{
      const dbApp= ref_database(db, `reservation/${id}`);
      update(dbApp, {
        servicedBy_name: global.employeeName,
        servicedBy_id: global.employee_id,
      }).then(() => {
        console.log('data added');
       setTimeout(() =>  pushAppointment(), 1000)
      })     
    }


   function pushAppointment(){  
  
     get(child_database(dbRef, `reservation/${id}`)).then((snapshot) => {
       if (snapshot.exists()) {
        push(ref_database(db, 'success_appointment'), snapshot.val())
        deleteAppointment()  
       } else {
         console.log("No data available");
       } 
     }).catch((error) => {
       console.error(error);
     });
     navigation.reset({
      index: 0,
      routes: [{ name: 'Home_Employee' }],
      })
   }

   function setImages(){
    // Create a reference to the file we want to download
  
    const starsRef = ref_storage(getStorage(), 'reservation/'+ image);

    // Get the download URL
    getDownloadURL(starsRef)
    .then((url) => {
        //console.log(url)
        setImageName(url)
    })
    .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/object-not-found':
            // File doesn't exist
            break;
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;

        // ...

        case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
    });
}

   function storeProfile(){
    get(child_database(dbRef, `customer/${reserveBy}`)).then((snapshot) => {
        if (snapshot.exists()) {
           profile.profileArr.push({
                id: snapshot.key,
                ...snapshot.val() 
            })
            console.log(profileArr)
        } else {
          console.log('no data');
        }
      }).catch((error) => {
        console.error(error);
      });  
   }

   function storeAppoint(){    
      get(child_database(dbRef, `reservation/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
              arr.push({
                  id: snapshot.key,
                  ...snapshot.val() 
              })
              console.log(arr)
              setImage(snapshot.val().image)
              setReserveBy(snapshot.val().reserveBy_id)
             // console.log(snapshot.val())
          } else {
            console.log('no data', {id});
          }
        }).catch((error) => {
          console.error(error);
        });  
  }

   const ListMe = () => {
       return(
           
        <SafeAreaView style={styles.mainContainer}>
        <ScrollView>
            <View style={styles.div1}>
                <Image style={styles.forProfile}/>

                <View style={styles.forInfo}>
                    <Text style={styles.forInfoLabel}>Name: </Text>
                    <Text style={styles.forInfoLabel}>Contact: </Text>
                    <Text style={styles.forInfoLabel}>Email: </Text>
                    <Text style={styles.forInfoLabel}>Address: </Text>
                </View> 
            </View>

            <Text style={styles.lbl}>Reservation Info:</Text>
            <View style={styles.div2}>
                <Text style={styles.forInfoLabel}>Image: </Text>
                <Image style={styles.forImage}/>

                <Text style={styles.forInfoLabel}>Message: </Text>
                <View style={styles.forMessage}/>
            </View>
        </ScrollView>
    </SafeAreaView>
            
        
       )
   }

    return(   
        info.arr.map((item)=>(
            <View style={styles.mainContainer}  key={item.id}>
              <ScrollView>
              <ModalAsk/>
               <View style={styles.serviceContainer}>
              
                 <View style={styles.serviceTypeContainer}>
                   {item.type.trim() == "Hair" ? (
                    <Image style={styles.serviceType} source={require('../picture/icon1.png')}/>
                    ): item.type == 'Eyelashes' ? (
                      <Image style={styles.serviceType} source={require('../picture/eye.png')}/>
                    ):  <Image style={styles.serviceType} source={require('../picture/manicure.png')}/>}
                </View>

                <View style={styles.forInfo}>
                   <Text style={styles.lbl}>{"Name: "+ item.reserveBy_name}</Text>
                   <Text style={styles.lbl}>{"Type: "+ item.type.trim().replace(/ (?=[^\s])/g, ", ")}</Text>
                   <Text style={styles.lbl}>{"Date: " + item.day + ", " + item.month + " " +item.date + ", " + item.year}</Text>
                   <Text style={styles.lbl}>{"Time: "+ item.time}</Text>
                </View>
              </View>

              <View style={styles.forImage}>
                <Text style={styles.forImageLabel}>Image: </Text>
                {item.image == '' ? (
                  <View>
                    <MaterialCommunityIcons name="image-off" color={'gray'} size={160} />
                    <Text style={styles.lbl}>No image attached</Text>  
                  </View>
                ) : (
                  <Image style={{width: 190, height: 190, borderRadius: 30, borderWidth: 2,}} source={{ uri: imageName}}/>
                  )}
               
              </View>


              <View style={styles.forImage}>
                <Text style={styles.forImageLabel}>Customer Message: </Text>
                <View style={styles.customerMessage}>
                  <Text style={styles.message}>{item.message == '' ? "No message...." : item.message}</Text>
                </View>
              </View>
                    
                 
              </ScrollView>
              <View style={{marginTop:'auto'}}>
                      <TouchableOpacity style={styles.btnScan} onPress={() => setModalVisible(true)}>
                      <Text style={styles.btnLabel}>Confirm as Done</Text>
                    </TouchableOpacity>
               </View>
                
               </View>
               
               
           ))
    )
}



const styles = StyleSheet.create({
    mainContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 20,
    },

    
    customerMessage:{ 
      padding: 15,
      borderWidth: 1,
      height: 200,
      borderRadius: 20,
      backgroundColor: '#e7e7e7'
    },

    message: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
    },

    forImage: {
      padding: 10,
    },

    forImageLabel: {
      fontFamily: "Poppins_700Bold",
      fontSize: 18,
    },

    forInfo: {
      padding: 10
    },

    serviceTypeContainer: {
      backgroundColor: 'pink',
      borderWidth: 2,
      borderColor: '#FD62A1',
      padding: 15,
      borderRadius: 20,
      elevation: 5,
    },
    

    serviceContainer: {
      flexDirection: 'row',
      padding: 10,
      marginTop: 10,
    },

    serviceType:{
      width: 100,
      height: 100,
      alignSelf: 'center',
  },

    barCodeBox: {
        height: 400,
        width: 400,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
      },

      lbl: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 15,
      },

      btnScan: {
        backgroundColor: '#FD62A1',
        width: Dimensions.get('window').width + 10,
        alignSelf: 'center',
        padding: 15,
        height: 100,
      },
     
      btnLabel: {
        textAlign: "center",
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
      },
      
    mainText: {
        fontSize: 20,
        fontFamily: "Poppins_600SemiBold",
        margin: 20,
    },


     
  modalView:{
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight + 280,   
   
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
   padding: 22,
   borderWidth: 2,
   
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
    marginTop: 12,
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
  },

  btnModalDismiss: {
    marginTop: 15,
  }

    
})
const styleses = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
    },

    div1: {
        width: Dimensions.get('window').width,
        height: 200,
        backgroundColor: 'yellow',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
    },

    div2: {
        width: Dimensions.get('window').width,
        backgroundColor: 'gray',
        padding: 15,
    },

    lbl: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
    },

    forInfo: { 
        padding: 15,
    },

    forInfoLabel: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        marginTop: 4,
    },

    forProfile: {
        borderRadius: 10,
        backgroundColor: 'red',
        width: 160,
        height: 160,
    },

    forImage: {
        backgroundColor: 'white',
        width: 190,
        height: 190,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'pink'
    },

    forMessage: {
        alignSelf: 'center',
        height: 150,
        width: Dimensions.get('window').width - 30,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
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
      marginTop: StatusBar.currentHeight + 300,
      
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
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: '#FD62A1',
      borderRadius: 10,
      elevation: 5,
      padding: 22,
     
    },

    forBtnModal: {    
      padding: 10,
    },
  
    modalLabel:{
      fontSize: 16,
      marginTop: 2,
      textAlign: 'center',
      fontFamily: "Poppins_600SemiBold",
    },
  
    modalLabelTitle:{
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Poppins_600SemiBold'
    },

    modalLabelTitleQR:{
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Poppins_600SemiBold',
      marginBottom: 10,
    },
  
    btnModalQR: {
      alignSelf: 'center', 
      backgroundColor: '#FD62A1',
      padding: 10,
      borderRadius: 10,
      width: 300,
      elevation: 5,
      marginLeft: 5,
      marginTop: 10,
    },

    btnModal: {
      alignSelf: 'center',
     
      backgroundColor: '#FD62A1',
      padding: 10,
      borderRadius: 20,
      width: 200,
      elevation: 5,
      marginLeft: 5
    },

    btnModalDismiss: {
      marginTop: 15,
    },

  
    btnModalText: {
      textAlign: 'center',
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 15,
    },
})
export default Scanned;