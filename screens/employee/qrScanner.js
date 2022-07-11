import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  Button, Modal, TouchableOpacity, Image, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera } from 'expo-camera';
import { getDatabase, ref as ref_database, child as child_database, set, get, push } from "firebase/database";
import { getStorage,  ref as ref_storage, child as child_storage, put, putFile, uploadBytes, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const dbRef = ref_database(getDatabase()); 
const db = getDatabase()

const qrScanner = ({navigation}) =>{
    const [hasPermission, setPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned');
    const [scan, setScan] = useState(false)
    const [date, setDate] = useState('')
    const [type, setType] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [image, setImage] = useState('a')
    const [imageName, setImageName] = useState('a')
    const [id, setID] = useState('')
    const info = {
      id: '',
      date: date,
      type: type,
      message: message,
    }
    var arr = []
    var arrReserve = []
    const [reservation, setReservation] = useState({
       arrReserve
    })
    const [appoint, setAppoint] = useState()
    

    useEffect(()=>{
      askForPermission();     
      setScan(true)
      
      return(() => {
        setScanned(false)
      })
   }, []);

    const askForPermission = () =>{
        (async () =>{
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted')
        })();
    }
    
    function pushAppointment(){
     console.log(text)     
   
      get(child_database(dbRef, `reservation/${text}`)).then((snapshot) => {
        if (snapshot.exists()) {
          push(ref_database(db, 'success_appointment'), snapshot.val())
        } else {
          console.log("No data available");
        } 
      }).catch((error) => {
        console.error(error);
      });
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


    function confirmDone(){
      /*
      set(ref(getDatabase(), 'reservation/' + text), null)
       .then(() => {
       console.log('yes yes yow')
       })
       .catch((error) => {
       console.log('taena')
       });
       */
       pushAppointment()
       setModalVisible(false)
       setModalSuccess(true)
    }

    const ShowModal = () =>{
   
          return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            blurRadius={50}
          >
          <View style={styles.modalView}>
                      
          <View style={styles.modalBody}>
          <MaterialCommunityIcons name="account-question" style={{alignSelf: 'center', elevation: 10}} color={'#950245'} size={160} />
        <View style={styles.modalContainer}>
          <Text style={styles.modalLabelTitle}>Are you sure?</Text>
          <Text style={styles.modalLabel}>Confirming means the appointment is done.</Text>
          <TouchableOpacity style={styles.btnModal} 
          onPress={confirmDone}>                   
              <Text style={styles.btnModalText}>CONFIRM AS DONE</Text>     
            </TouchableOpacity>
            </View>
                              
          </View>
        </View>                   
      </Modal>
      )
      
    }

    const ShowModalSuccess = () => {
      return(
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalSuccess}
        blurRadius={50}
      >
      <View style={styles.modalView}>
                  
      <View style={styles.modalBody}>
      <MaterialCommunityIcons name="checkbox-marked-circle-outline" style={{alignSelf: 'center', elevation: 10}} color={'#950245'} size={160} />
    <View style={styles.modalContainer}>
      <Text style={styles.modalLabelTitle}>Great!</Text>
      <TouchableOpacity style={styles.btnModal} 
      onPress={() => setModalSuccess(false) || navigation.navigate("Home_Employee")}>                   
          <Text style={styles.btnModalText}>CONFIRM AS DONE</Text>     
        </TouchableOpacity>
        </View>
                          
      </View>
    </View>                   
  </Modal>
  )
    }

    const Scanner = () => {
      return(
        <View style={styles.mainContainer}>
          <ModalAsk/>
         <View style={styles.barCodeBox}>
             <Camera 
             onBarCodeScanned={scanned ? undefined : handleBarCode}
             style={{ height:  Dimensions.get('window').height,
               width: Dimensions.get('window').width}}/>       
          </View>
        </View>
     )
    }

    const goTo = () => {
      setTimeout(() => navigation.navigate('Reservation Info', {id: text}), 0)
      setScanned(false)
    }

    const AppointmentList = () =>{  
        storeAppoint()
        setImages()
        return(    
           reservation.arrReserve.map((item)=>(
            <View style={styles.container}  key={item.id}>
              <ShowModal/>
              <ShowModalSuccess/>
               <View style={styles.serviceContainer}>
              
                 <View style={styles.serviceTypeContainer}>
                   {item.type == "Hair" ? (
                    <Image style={styles.serviceType} source={require('../../picture/icon1.png')}/>
                    ): item.type == 'Eyelashes' ? (
                      <Image style={styles.serviceType} source={require('../../picture/eye.png')}/>
                    ):  <Image style={styles.serviceType} source={require('../../picture/manicure.png')}/>}
                </View>

                <View style={styles.forInfo}>
                   <Text style={styles.lbl}>{"Name: "+ item.reserveBy_name}</Text>
                   <Text style={styles.lbl}>{"Type: "+ item.type.replace(/ (?=[^\s])/g, ", ")}</Text>
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
                  <Text style={message}>{item.message}</Text>
                </View>
              </View>
                      
                <TouchableOpacity style={styles.btnScan} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnLabel}>Confirm as Done</Text>
                  </TouchableOpacity>

                   <TouchableOpacity style={styles.btnScan} onPress={() =>setScanned(false) ||  setAppoint({arrReserve: {}})}>
                    <Text style={styles.btnLabel}>Scan Again?</Text>
                  </TouchableOpacity>
               </View>
               
           ))
        )
       
    }
    console.log(reservation.arrReserve)

    function storeAppoint(){
      if(scan == true){       
        get(child_database(dbRef, `reservation/${text}`)).then((snapshot) => {
            if (snapshot.exists()) {
                reservation.arrReserve.push({
                    id: snapshot.key,
                    ...snapshot.val() 
                })
                setImage(snapshot.val().image)
                setMessage(snapshot.val().message)
                setDate("Date: " + snapshot.val().day + snapshot.val().month + " " + snapshot.val().date + ", "+ snapshot.val().year)
                setType('Type: ' + snapshot.val().type)
               
            } else {
              console.log('no data', text);
            }
          }).catch((error) => {
            console.error(error);
          });
          setScan(false)
      }
     
    }

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
             <MaterialCommunityIcons name="alert-decagram" style={{alignSelf: "center", marginBottom: 5}}color={'red'} size={70} />
             <Text style={styles.modalLabelTitle}>We cannot find this reservation!</Text>
              <View style={styles.forBtnModal}>
                  <TouchableOpacity style={styles.btnModal} 
                  onPress={() => setModalVisible(!modalVisible)}>                  
                  <Text style={styles.btnModalText}>SCAN AGAIN</Text>     
                  </TouchableOpacity>
              </View>
             </View>
             
             </View>
          </View>                   
        </Modal>
      )
  }
    // request camera permission

    const handleBarCode = ({data}) =>{
        if(data.charAt(0) == '-'){
          setScanned(true);
          setText(data);
        }else{
          setModalVisible(true)
        }
    }



    if(hasPermission === null){
        return(
            <SafeAreaView style={styles.mainContainer}>
            <Text>Requesting for camera permission</Text>
           </SafeAreaView>
        );
    }

    if(hasPermission === false){
        return(
            <SafeAreaView style={styles.mainContainer}>
            <Text>No access to camera</Text>
            <Button title='Allow Camera' onPress={()=> askForPermission} />
           </SafeAreaView>
        );
    }


     //{scanned && <Button title='Scan again?' onPress={() =>setScanned(false)} color='tomato' />}
    return(
      
      <View>
        {scanned == false ? (
            <Scanner/>
        ): 
        goTo()
        }
      </View>
       
     );       
}



const styles = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
        alignItems: 'center',
        alignContent: 'center',
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
      fontSize: 25,
    },

    forInfo: {
      padding: 10
    },

    serviceTypeContainer: {
      backgroundColor: 'pink',
      borderWidth: 2,
      borderColor: '#FD62A1',
      padding: 12,
      borderRadius: 20,
      elevation: 5,
    },
    

    serviceContainer: {
      flexDirection: 'row',
      padding: 10,
    },

    serviceType:{
      width: 100,
      height: 100,
      alignSelf: 'center',
  },

    barCodeBox: {
        height:  Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        overflow: 'hidden',
        backgroundColor: 'tomato'
      },

      lbl: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 19,
      },

      btnScan: {
        backgroundColor: 'pink',
        marginTop: 10,
        width: 300,
        alignSelf: 'center',
        borderColor: '#FD62A1',
        borderWidth: 2,
        padding: 10,
        borderRadius: 50,
      },
     
      btnLabel: {
        textAlign: "center",
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
      },
      
    mainText: {
        fontSize: 20,
        fontFamily: "Poppins_600SemiBold",
        margin: 20,
    },


    modalView:{
      alignContent: 'center',
      justifyContent: 'center',
      marginTop: StatusBar.currentHeight + 250,
      
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
      borderColor: '#676767',
      borderRadius: 10,
      elevation: 5,
      padding: 22,
      width: Dimensions.get('window').width - 20,
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
  
    btnModal: {
      alignSelf: 'center',   
      backgroundColor: '#FD62A1',
      padding: 10,
      borderRadius: 10,
      width: 300,
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

export default qrScanner;