import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  Button, ImageBackground, TouchableOpacity, ScrollView, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CustomerHomeScreen = ({navigation}) =>{
    return(
        <SafeAreaView style={homescreen.container_header}>
            <ScrollView>
                <View style={homescreen.header}>
                    <Text style={{fontSize: 19, fontFamily: "Poppins_600SemiBold"}}>Hello, Mark{'\n'}Welcome to Trendz</Text>
                    <TouchableOpacity style={homescreen.profile}>
                     <MaterialCommunityIcons name="account" style={{marginLeft: 2}} size={35} />
                    </TouchableOpacity>
                </View>

              <View style={homescreen.container_body}>
                  <View style={homescreen.carousel}> 
                    <ImageBackground style={homescreen.carousel} imageStyle={{borderRadius: 40}} source={require('../../picture/R.jpg')} resizeMode="cover"/>
                  
                  </View>
                   
                  <View style={homescreen.forButtons}>
                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Edit Profile")}>
                        <MaterialCommunityIcons name="account" style={{alignSelf: 'center',  marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Notifications")}>
                        <MaterialCommunityIcons name="bell-ring-outline" style={{alignSelf: 'center',  marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Dashboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Book Now")}>
                        <MaterialCommunityIcons name="book-open-variant" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Book Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                    onPress={() => navigation.navigate("QR Scanner")}>
                        <MaterialCommunityIcons name="calendar-clock" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Appointment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Services")}>
                        <MaterialCommunityIcons name="hand-heart" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Services</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Salon Gallery")}>
                        <MaterialCommunityIcons name="image" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}
                     onPress={() => navigation.navigate("Salon Stylist")}>
                        <MaterialCommunityIcons name="content-cut" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>Stylist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={homescreen.menu_button}>
                        <MaterialCommunityIcons name="dots-horizontal-circle-outline" style={{alignSelf: 'center', marginTop: 5}} color={'#FD62A1'} size={60} />
                        <Text style={homescreen.button_title}>More</Text>
                    </TouchableOpacity>
                    
                    <View style={homescreen.forReservation}>
                        <Text style={homescreen.schedule}>UPCOMING BOOKINGS</Text>
                        <View style={homescreen.line}/>
                        
                    </View>
                   

                  </View>
              </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const homescreen = StyleSheet.create({
    container_header: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    },

    container_body:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
        alignContent: 'center',
        padding: 10,
    },

    forButtons: {
        width: Dimensions.get('window').width-7,
        height: 'auto',
        flexDirection: 'row',
        padding: 2,
        flexWrap: 'wrap',
    },

    forReservation: {
        width: Dimensions.get('window').width-7,
        height: 'auto',
        flexDirection: 'row',
        padding: 2,
        flexWrap: 'wrap',
        marginTop: 15,
    },

    line: {
        borderBottomWidth: 1,
        width:  Dimensions.get('window').width - 240,
        height: 14,
        marginLeft: 'auto',
    },

    button_title: {
        fontSize: 12,
        marginTop: 7,
        textAlign: 'center',
        fontFamily: "Poppins_600SemiBold",
    },

    schedule: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
    },

    menu_button:{
        backgroundColor: 'pink',
        width: 90,
        height: 100,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FD62A1',
        marginRight: 'auto',
        marginTop: 5,
        elevation: 5,
    },

    header: {
        padding: 10,
        flexDirection: "row",
        
    },

    profile: {
        backgroundColor: "pink",
        height: 40,
        width: 40,
        borderRadius: 50,
        marginLeft: 'auto',
    },

    carousel: {
        height: 250,
        borderRadius: 40,
        backgroundColor: 'red',
        width:  Dimensions.get('window').width - 20,
        alignSelf: 'center',
        marginBottom: 10,
        elevation: 5,
    },

   
})
export default CustomerHomeScreen;