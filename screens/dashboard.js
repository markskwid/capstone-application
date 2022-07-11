import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView,Text, View, SafeAreaView, Dimensions, StatusBar,  TextInput, ImageBackground, TouchableOpacity, ScrollView, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, push} from "firebase/database";

const db = getDatabase();
const Dashboard = () =>{
    var arrNotif = []
    const [hasNotif, setNotif] = useState({arrNotif})
    const [refr, setRefr] = useState([])

    useEffect(() => {
        checkNotif()
    }, [])
   
    const checkNotif = () =>{
        const commentsRef = ref(db, 'announcement/');
        onChildAdded(commentsRef, (data) => {
            arrNotif.push({
                id: data.key,
                ...data.val()
            })

            setRefr([...arrNotif])
        });


        onChildRemoved(commentsRef, (data) => {
            setNotif(prevState => ({ // You can also get the current state passing a callback to this.setState
                arrNotif: prevState.arrNotif.filter(reservation => reservation.id !== data.key)
              }));
        });
    }

    const Notif = () => {
        return (
            hasNotif.arrNotif.map((item) => (
                <View style={styles.reservationContainer} key={item.id}>
                    
                    <View style={styles.serviceType}>
                    <Text style={styles.monthLabel}>{item.announcement_month}{"\n"}
                    <Text style={styles.dateLabel}>{item.announcement_date}</Text></Text>
                    
                    </View>
                    <View style={styles.reservationInfo}>
                     <View style={{flexDirection: 'row'}}>
                        <Text style={styles.infoLabelTitle}>{item.announcement_title}</Text>
                        <MaterialCommunityIcons name="bell-ring" style={{marginLeft: 5, marginTop: 3}} color={'black'} size={16} />
                     </View>
                     <View style={{flexShrink: 1, width: Dimensions.get('window').width - 180}}>
                         <Text style={styles.infoLabel}>{item.announcement_info}</Text>
                     </View>
                    </View>
                </View>
            ))
        )
    }
    return(
        <SafeAreaView>
            {
            hasNotif.arrNotif.length == 0 ? (
                 <View style={styles.appointmentEmpty}>
                 <MaterialCommunityIcons name="bell" style={{marginLeft: 2}} color={'gray'} size={300} />
                 <Text style={styles.appointmentEmptyLabel}>Notifications is empty</Text>
              </View>
            ): <Notif/>
            }
        </SafeAreaView>
      
    );
}


const styles = StyleSheet.create({
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
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 10,
        flexDirection: 'row'
    },

    cancelLabel: {
        textAlign: 'center',
        fontFamily: "Poppins_600SemiBold",
        marginLeft: 6,
        fontSize: 14,
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
        height: 130,
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
        justifyContent: 'center',
        padding: 5,
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

    infoLabelTitle: {
        fontSize: 17,
        marginTop: 1,
        fontFamily: 'Poppins_600SemiBold',
    },

    infoLabel: {
        fontSize: 15,
        marginTop: 1,
        fontFamily: 'Poppins_500Medium',
        flexShrink: 1,
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
})

export default Dashboard;