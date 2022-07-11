import { StyleSheet, Text, View, SafeAreaView, Platform, TextInput, ImageBackground, StatusBar, TouchableOpacity, Dimensions} from 'react-native';
import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Others = ({navigation}) =>{
    return(
       <SafeAreaView style={others_style.mainContainer}>
           <TouchableOpacity style={others_style.btn}
            onPress={() => navigation.navigate("Salon Gallery")}>
            <ImageBackground style={others_style.imageBg} imageStyle={{borderRadius: 30}} source={require('../../picture/bg.jpg')} resizeMode="cover"> 
               <View style={others_style.bgLabel}>
                 <Text style={others_style.label}>Gallery</Text>
                </View>
            </ImageBackground>         
           </TouchableOpacity>

           <TouchableOpacity style={others_style.btn}
           onPress={() => navigation.navigate("Notifications")}>
           <ImageBackground style={others_style.imageBg} imageStyle={{borderRadius: 30}} source={require('../../picture/bg3.png')} resizeMode="cover">
                <View style={others_style.bgLabel}>
                 <Text style={others_style.label}>Announcement</Text>
                </View>
            </ImageBackground>         
           </TouchableOpacity>
       </SafeAreaView>
    );
}

const others_style = StyleSheet.create({
    mainContainer:{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap", 
    },

    btn: {
        width: Dimensions.get('window').width / 2.2,
        height: 300,
        borderWidth: 1,
        borderRadius: 30,
        marginRight: 'auto',
        elevation: 5,
    },

    imageBg:{
        width: 'auto',
        height: 298,
    },

    label: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold",
        color: 'black',
        textShadowColor: 'black',
       
        
    },

    bgLabel: {
        backgroundColor: 'pink',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderTopWidth: 1,
        marginTop: 255,
        width: 'auto',
        padding: 10,
    },
})
export default Others;