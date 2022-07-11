import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Dimensions, Modal,  TextInput, StatusBar, TouchableOpacity, ScrollView, Platform, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { initializeApp } from 'firebase/app';
import * as firebase from "firebase/app";
import { getDatabase, ref as ref_database, child as child_database, set, get, update, query, onValue, onChildAdded, onChildChanged, onChildRemoved, equalTo, push, off, limitToFirst} from "firebase/database";
import { getStorage,  ref as ref_storage, put, putFile, uploadBytes, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import QRCode from 'react-native-qrcode-svg';

const dbRef = ref_database(getDatabase());
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
const db = getDatabase()
const storage = getStorage()
const Appointment = ({navigation}) =>{
    var arr = []; var emptyArr = []
    const [appointment, setAppointment] = useState({arr});
    const [empty, setEmpty] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [id, setID] = useState('')
    const [messageModal, showMessage] = useState(false)
    const [qrvalue, setQRVal] = useState('')
   

    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [contact, setContact] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profile, setProfile] = useState('a')
    const [errProfile, setErrProfile] = useState(false)
    useEffect (() =>{
        let abortController = new AbortController();
        let componentMounted = true;
        const fetchData = async () => {
            //you async action is here
             if(componentMounted) {
                realTimeUpdate()
             }
           };
        setTimeout(() =>  fetchData(), 0);
         //trySol()
        //getAppointment() 
        onRefresh()
        
        return() => {
          
            abortController.abort();
            componentMounted = false;
            setAppointment({arr: emptyArr})
        }
     }, [])

     
     function setAttachedImage(reservationPic){
        // Create a reference to the file we want to download
      
        const starsRef = ref_storage(storage, 'reservation/'+ reservationPic);

        // Get the download URL
        getDownloadURL(starsRef)
        .then((url) => {
            //console.log(url)
            setProfile(url)
        })
        .catch((error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
            case 'storage/object-not-found':
                // File doesn't exist
                setErrProfile(true)
                break;
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                setErrProfile(true)
                break;
            case 'storage/canceled':
                // User canceled the upload
                setErrProfile(true)
                break;

            // ...

            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                setErrProfile(true)
                break;
            }
        });
  }

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ":00 " + ampm;
        return strTime;
    }
    
  function deleteOldReservation(){
    const dt = new Date();
    const dateNow =   dt.toLocaleString('default', { month: 'long' }).split(' ')
    const conditionDate = dateNow[1] +" "+dateNow[2]+", "+ dateNow[4]
    //console.log(dateNow[1] +" "+dateNow[2]+", "+ dateNow[4])
    get(child(dbRef, `reservation/`)).then((snapshot) => {           
        if (snapshot.exists()) {   
        snapshot.forEach((child) => {               
           if(global.userType == 'customer'){
                if(child.val().reserveBy_id === global.employee_id){
                    if(child.val().month === dateNow[1] && child.val().date === dateNow[2] && child.val().year === dateNow[4]){
                        const timeCustomer = child.val().time.split(' ')
                        const formatTime = timeCustomer[3] + timeCustomer[4]
                    }
                    
                }else{
                    console.log('wala')
                    setEmpty(true)
                }
           }
        }) 
        } else {
        console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
  }



  const DisplayInfo = () =>{
      var arr = type.split(' ')
      return(
        <Modal
                animationType="slide"
                transparent={true}
                visible={messageModal}
                blurRadius={30}
              >
              <View style={styles.modalViewQR}>
                 <View style={styles.modalBodyforEmp}>
                 <View style={{padding: 5, backgroundColor: '#FD62A1', marginTop: 'auto'}}>
                     <Text style={{textAlign: 'center', fontFamily: "Poppins_600SemiBold", fontSize: 20, letterSpacing: 2,}}>{name.split(' ')[0] +"'s Reservation"}</Text>
                     <Text style={{textAlign: 'center', fontFamily: "Poppins_500Medium", color: 'black'}}>{email}</Text>
                     
                 </View>
               
                 <View style={styles.forCustomerReservation}>
                     <Text style={styles.lblTitle}>Image: </Text>
                    
                     {errProfile == false ? (
                         <Image style={{width: 200, height: 170, borderRadius: 15}} source={{uri: profile}}/>
                     ): (
                       <View>
                            <MaterialCommunityIcons name="image-off" color={'gray'} size={120} />
                             <Text style={{fontFamily: "Poppins_500Medium_Italic", color: 'gray'}}>No image attached</Text>
                      </View>
                     )}
                   
                 </View>

                 <View style={styles.forCustomerInfo}>
                     <Text style={styles.lblTitle}>Type: </Text>
                     <View style={{padding: 3, flexDirection: 'row'}}>
                        {arr.map((i) =>( <Text style={styles.lblService} key={i}>{i}</Text> ))}
                    </View>     
                 </View>

              
                 <View style={styles.forCustomerReservation}>
                     <Text style={styles.lblTitle}>Message: </Text>
                     <View style={styles.forMessage}>
                     <Text style={{fontFamily: "Poppins_500Medium_Italic"}}>
                         {msg == '' ? "No message..." : msg}
                     </Text>
                    </View> 
                 </View>
                 <View style={styles.forBtnModal}>              
                      <TouchableOpacity style={styles.btnModalQR} 
                          onPress={() => showMessage(!messageModal)}>                  
                          <Text style={styles.btnModalText}>Close Now</Text>     
                      </TouchableOpacity>
                  </View>
                 </View>
              </View>                             
              </Modal>
      )
  }

  const searchCustomer = (customerID) =>{
    get(child_database(dbRef, `customer/${customerID}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          //setContact(snapshot.val().customer_contact)
          //setEmail(snapshot.val().customer_email)
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
    });
  }

  const infoReservation = (reservationID) =>{
    get(child_database(dbRef, `reservation/${reservationID}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setMsg(snapshot.val().message)
          setType(snapshot.val().type)
          setEmail(snapshot.val().reserveBy_email)
          setAttachedImage(snapshot.val().image)
          setName(snapshot.val().reserveBy_name)
          console.log(type)
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
    });
  }
 
  
    function removeAppointment() {
        set(ref_database(getDatabase(), 'reservation/' + id), null)
        .then(() => {
        console.log('yes yes yow')
        })
        .catch((error) => {
        console.log('taena')
        });
    }

    
   function pushAppointment(){  
    get(child_database(dbRef, `reservation/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        push(ref_database(db, 'canceled_appointment'), snapshot.val())
        removeAppointment() 
      } else {
        console.log("No data available");
      } 
    }).catch((error) => {
      console.error(error);
    });
    //navigation.replace('Home_Employee')
  }
   

    function realTimeUpdate(){
        var ctr = 0;
        const commentsRef = ref_database(db, 'reservation/');
        onChildAdded(commentsRef, (data) => {
            if(global.userType == 'customer'){
                if(global.employee_id === data.val().reserveBy_id){
                    console.log(data.val())
                    arr.push({
                        id: data.key,
                        ...data.val()
                    })
                
                }else{
                   
                }
            } else {
                if(global.employeeSchedule == "Monday - Tuesday"){
                    if(data.val().day === 'Mon' || data.val().day === 'Tue'){
                        console.log(data.val())
                        arr.push({
                            id: data.key,
                            ...data.val()
                        })
                    }else{
                        console.log('wala')
                    }

                } else if(global.employeeSchedule == "Wednesday - Thursday"){
                    if(data.val().day === 'Wed' || data.val().day === 'Thu'){
                        console.log(data.val())
                        arr.push({
                            id: data.key,
                            ...data.val()
                        })
                    }else{
                        console.log('wala')
                    }

                } else if(global.employeeSchedule == "Thursday - Friday"){
                    if(data.val().day === 'Thu' || data.val().day === 'Fri'){
                        console.log(data.val())
                        arr.push({
                            id: data.key,
                            ...data.val()
                        })
                    }else{
                        console.log('wala')
                    }
                }
            
            }// customer
        });

        onChildRemoved(commentsRef, (data) => {
            if(global.userType == 'customer'){
                if(global.employee_id === data.val().reserveBy_id){
                    console.log(data.val())
                   setAppointment(prevState => ({ // You can also get the current state passing a callback to this.setState
                        arr: prevState.arr.filter(reservation => reservation.id !== data.key)
                      }));
                }
            }  else {
                if(global.employeeSchedule == "Wednesday - Thursday"){
                    if(data.val().day === 'Wed' || data.val().day === 'Thu'){
                        console.log(data.val())
                        setAppointment(prevState => ({ // You can also get the current state passing a callback to this.setState
                            arr: prevState.arr.filter(reservation => reservation.id !== data.key)
                          }));
                    }else{
                        console.log('wala')
                    }
                } else if(global.employeeSchedule == "Wednesday - Thursday"){
                    if(data.val().day === 'Wed' || data.val().day === 'Thu'){
                        console.log(data.val())
                        setAppointment(prevState => ({ // You can also get the current state passing a callback to this.setState
                            arr: prevState.arr.filter(reservation => reservation.id !== data.key)
                          }));
                    }else{
                        console.log('wala')
                    }

                } else if(global.employeeSchedule == "Thursday - Friday"){
                    if(data.val().day === 'Thu' || data.val().day === 'Fri'){
                        console.log(data.val())
                        setAppointment(prevState => ({ // You can also get the current state passing a callback to this.setState
                            arr: prevState.arr.filter(reservation => reservation.id !== data.key)
                          }));
                    }else{
                        console.log('wala')
                    }
                }
            
            
            }// customer
          });  
    }

//    function getAppointment(){
//     const dt = new Date();
//     const dateNow =   dt.toLocaleString('default', { month: 'long' }).split(' ')
//     const conditionDate = dateNow[1] +" "+dateNow[2]+", "+ dateNow[4]
//     //console.log(dateNow[1] +" "+dateNow[2]+", "+ dateNow[4])
//     get(child(dbRef, `reservation/`)).then((snapshot) => {           
//         if (snapshot.exists()) {   
//         snapshot.forEach((child) => {               
//            if(global.userType == 'customer'){
//                 if(child.val().reserveBy_id === global.employee_id){
                    
//                      arr.push({
//                             id: child.key,
//                             ...child.val()
//                         })
                        
//                         setReserve([...arr])
                    
//                 }else{
//                     console.log('wala')
                   
//                 }
//            }else{
//             if(global.employeeSchedule == "Monday - Tuesday"){
//                 if(child.val().day === 'Mon' || child.val().day === 'Tue'){
//                     arr.push({
//                         id: child.key,
//                         ...child.val()
//                     })
//                     setReserve([...arr])
//                 }else{
//                     console.log('wala')
                  
//                 }
//             }else if(global.employeeSchedule == 'Wednesday - Thursday'){
//                 if(child.val().day === 'Wed' || child.val().day === 'Thu'){
//                     arr.push({
//                         id: child.key,
//                         ...child.val()
//                     })
//                     setReserve([...arr])
//                 }else{
//                     console.log('wala')
                   
//                 }
//             }else if(global.employeeSchedule == 'Thursday - Friday'){
//                 if(child.val().day === 'Thu' || child.val().day === 'Fri'){
//                     arr.push({
//                         id: child.key,
//                         ...child.val()
//                     })
//                     setReserve([...arr])
//                 }else{
//                     console.log('wala')
//                 }
//             }else if(global.employeeSchedule == 'Friday - Saturday'){
//                 if(child.val().day === 'Fri' || child.val().day === 'Sat'){
//                     arr.push({
//                         id: child.key,
//                         ...child.val()
//                     })
//                     setReserve([...arr])
//                 }else{
//                     console.log('wala')
                  
//                 }
//             }
//            }
            
//         }) 
//         } else {
//         console.log("No data available");
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
//    }

  console.log(appointment.arr.length)

    const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    }, []);

    let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
    const ModalReserve = () =>{
        if(global.userType == 'customer'){
            return(
                <Modal
                animationType="slide"
                transparent={true}
                visible={messageModal}
                blurRadius={30}
              >
                <View style={styles.modalViewQR}>
                 
                   <View style={styles.modalBody}>
                   <View style={styles.modalContainer}>
                   <Text style={styles.modalLabelTitleQR}>Your QR Code for this reservation</Text>     
                   <View style={{alignSelf: 'center'}}>
                    <QRCode
                            value={qrvalue}
                            logo={{uri: base64Logo}}
                            logoSize={30}
                            logoBackgroundColor='transparent'
                            backgroundColor={'transparent'}
                            size={250}
                        />
                   </View>
                    <View style={styles.forBtnModal}>              
                        <TouchableOpacity style={styles.btnModalQR} 
                            onPress={() => showMessage(!messageModal) || setModalVisible(true)}>                  
                            <Text style={styles.btnModalText}>Cancel Reservation</Text>     
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnModalDismiss} 
                            onPress={() => showMessage(!messageModal)}>                  
                            <Text style={styles.btnModalText}>Dismiss</Text>     
                         </TouchableOpacity>
                    </View>
                   </View>
                   
                   </View>
                </View>                   
              </Modal>
            )
        }else{
            return(<DisplayInfo/>)
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
                <MaterialCommunityIcons name="alert-circle" style={{alignSelf: 'center'}} color={'red'} size={100} />
               <Text style={styles.modalLabelTitle}>Are you sure you want to remove?</Text>
                <View style={styles.forBtnModal}>
                    <TouchableOpacity style={styles.btnModal} 
                    onPress={() => setModalVisible(!modalVisible) || pushAppointment() }>                  
                    <Text style={styles.btnModalText}>Confirm Removal</Text>     
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnModalDismiss} 
                    onPress={() => setModalVisible(!modalVisible)}>                  
                    <Text style={styles.btnModalText}>Dismiss</Text>     
                    </TouchableOpacity>
                </View>
               </View>
               
               </View>
            </View>                   
          </Modal>
        )
    }


    const Appointment = () =>{
        if(appointment.arr.length == 0){
            return(
               <View style={styles.appointmentEmpty}>
                    <MaterialCommunityIcons name="calendar-remove" style={{marginLeft: 2}} color={'gray'} size={300} />
                   <Text style={styles.appointmentEmptyLabel}>You don't have any appointment yet</Text>
               </View>
            )
        }else{
            return(
                appointment.arr.map((item) =>(
                   <View key={item.id}>
                       {global.userType == 'employee' ? (
                           <TouchableOpacity style={styles.reservationContainer} key={item.id}
                           onPress={() => console.log(item.message) || showMessage(true) || infoReservation(item.id) || searchCustomer(item.reserveBy_id)}>
                            
                             <View style={styles.serviceType}>
                             <Text style={styles.monthLabel}>{item.month} {"\n"}
                             <Text style={styles.dateLabel}>{item.date}</Text></Text>
                           
                           </View>
                           <View style={styles.reservationInfo}>
                           {global.userType == 'employee' ? (  <Text style={styles.infoLabel}>{"Name: "  + item.reserveBy_name}</Text> ) : null}
                            <Text style={styles.infoLabel}>{"Date: "  + item.day + ", "+ item.month +" "+ item.date +", "+ item.year}</Text>
                            <Text style={styles.infoLabel}>{"Time: " + item.time}</Text>
                               {global.userType == 'customer' ? (
                                   <TouchableOpacity style={styles.cancelBtn}
                                   onPress={() => console.log(item.id) || setModalVisible(true) || setID(item.id)}>
                                   <MaterialCommunityIcons name="close-circle-outline" style={{marginLeft: 2}} size={20} />
                                       <Text style={styles.cancelLabel}>Cancel Appointment</Text>
                                   </TouchableOpacity>
                               ): null}
                           </View>
       
                        
                           <View style={styles.service}>
                             {item.type.trim().length < 14 ? (<Text style={styles.serviceLabel}>1 Service </Text>) : 
                             item.type.trim().length == 14 ? (<Text style={styles.serviceLabel}>2 Services</Text>) : 
                             item.type.trim().length == 19 ? (<Text style={styles.serviceLabel}>3 Services</Text>) : null}
                             
                           </View>
       
                           {item.message != '' ? (<MaterialCommunityIcons name="email" color={'black'} style={{marginBottom: 6}} size={18} />) : null}
                           
                       </TouchableOpacity>
                       ): (
                        <TouchableOpacity style={styles.reservationContainer} key={item.id}
                        onPress={() => console.log(item.message) || showMessage(true) || setQRVal(item.id)  || setID(item.id)}>
                         
                          <View style={styles.serviceType}>
                          <Text style={styles.monthLabel}>{item.month} {"\n"}
                          <Text style={styles.dateLabel}>{item.date}</Text></Text>
                        
                        </View>
                        <View style={styles.reservationInfo}>
                        {global.userType == 'employee' ? (  <Text style={styles.infoLabel}>{"Name: "  + item.reserveBy_name}</Text> ) : null}
                         <Text style={styles.infoLabel}>{"Date: "  + item.day + ", "+ item.month +" "+ item.date +", "+ item.year}</Text>
                         <Text style={styles.infoLabel}>{"Time: " + item.time}</Text>
                         <Text style={styles.infoLabel}>{"Type: " + item.type.trim().replace(/ (?=[^\s])/g, ", ")}</Text>
                        </View>
    
                     
                        <View style={styles.service}>
                          {item.type.trim().length < 14 ? (<Text style={styles.serviceLabel}>1 Service </Text>) : 
                          item.type.trim().length == 14 ? (<Text style={styles.serviceLabel}>2 Services</Text>) : 
                          item.type.trim().length == 19 ? (<Text style={styles.serviceLabel}>3 Services</Text>) : null}
                          
                        </View>
    
                        {item.message != '' ? (<MaterialCommunityIcons name="email" color={'black'} style={{marginBottom: 6}} size={18} />) : null}
                        
                     </TouchableOpacity>
                       )}
                   </View>
               ))           
            );
        }
    }
    return(
        <SafeAreaView>
            <ScrollView  refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
           
        } style={styles.container} >
                <ModalReserve/>
                <ModalAsk/>
               <Appointment />
            </ScrollView>
        </SafeAreaView>
      
    );
}


const styles = StyleSheet.create({
    container:{
        alignContent: 'center',
        paddingTop: 10,
        height: 'auto',
    },

    forCustomerInfo: {
        padding: 5,
    },

    forCustomerReservation: {
        backgroundColor: 'white',
        padding: 10,
    },

    lblService: {
        fontFamily: "Poppins_600SemiBold",
        marginLeft: 5,
        backgroundColor: '#FD62A1',
        borderRadius: 50,
        width: 80,
        paddingRight: 3,
        paddingLeft: 3,
        textAlign: 'center',
    },

    lbl: {
        fontFamily: "Poppins_600SemiBold",
    },

    lblTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        marginLeft: 5,
    },

    cancelBtn: {
        marginTop: 9,
        backgroundColor: '#ff5656',
        padding: 4,
        borderRadius: 10,
        flexDirection: 'row'
    },

    cancelLabel: {
        textAlign: 'center',
        fontFamily: "Poppins_600SemiBold",
        marginLeft: 6,
        fontSize: 13,
    },

    monthLabel: {
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 17,
    },

    userContact: {
        padding: 10,
    },

    appointmentEmpty:{
        alignSelf: 'center',
        opacity: 0.5,
        marginTop: 30,
    },

    appointmentEmptyLabel: {
        textAlign: 'center',
        fontFamily: "Poppins_600SemiBold",
        fontSize: 29,
        color: 'gray'
    },

    service: {
        marginLeft: 'auto',
        marginRight: 10,
        backgroundColor: 'violet',
        height: 20,
        width: 'auto',
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 50,
    },

    serviceMessage: {
        marginLeft: 'auto',
        marginRight: 90,
        backgroundColor: 'violet',
        height: 20,
        width: 'auto',
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 50,
    },

    forMessage: {
        width: Dimensions.get('window').width - 50,
        alignSelf: "center",
        backgroundColor: '#dfdfdf',
        padding: 10,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
    },

    titleLbl: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        
    },

    serviceLabel: {
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold'
    },

    dateLabel: {
        textAlign: 'center',
        fontFamily: "Poppins_600SemiBold",
        fontSize: 45,
    },

    statusContainer:{
        flexDirection: 'row'
    },

    statusLabel: {
        fontFamily: "Poppins_600SemiBold"
    },

    reservationContainer:{     
        width: Dimensions.get('window').width - 20,
        marginTop: 10,
        height: 150,
        borderRadius: 25,
        backgroundColor: 'pink',
        elevation: 5,
        padding: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'gray',
        alignSelf: 'center',
    },

    serviceImage: {
        height: 70,
        width: 70,
        alignSelf: 'center',
    },

    reservationInfo: {
        marginLeft: 10,
        padding: 5,
        marginTop: 15,
    },

    labelInfo:{ 
        fontFamily: "Poppins_500Medium",
        fontSize: 16,
        textAlign: 'center'
    },

    profilePic: {
        backgroundColor: 'violet',
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    infoLabel: {
        fontSize: 16,
        marginTop: 1,
        fontFamily: 'Poppins_500Medium',
    },

    serviceType: {
        width: 100,
        backgroundColor: '#FD62A1',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        elevation: 3,
    },

    modalViewQR:{
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight + 50,
        
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
        width: Dimensions.get('window').width - 30,
      },

      modalBodyforEmp: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#FD62A1',
        borderRadius: 10,
        elevation: 5,
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

      modalLabelTitleQR:{
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 10,
      },
    
      btnModalQR: {
        alignSelf: 'center', 
        backgroundColor: '#ff5656',
        padding: 10,
        borderRadius: 10,
        width: 300,
        elevation: 5,
        marginLeft: 5,
        marginTop: 10,
      },

      btnModal: {
        alignSelf: 'center',    
        backgroundColor: '#ff5656',
        padding: 10,
        borderRadius: 10,
        width: 300,
        elevation: 5,
        marginLeft: 5
      },

      btnModalDismiss: {
        marginTop: 20,
      },

    
      btnModalText: {
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
      },

})

export default Appointment;