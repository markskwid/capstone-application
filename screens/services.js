import React, { Component } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  Button, ImageBackground, TouchableOpacity, ScrollView, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Services = () =>{
    return(
       <SafeAreaView style={styles.container}>
           <ScrollView>
             <View>
             <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/bg_hair.jpg')}>
                       <Text style={styles.label}>
                       <Text>Hair Cut</Text>
                        <Text style={styles.labelPrice}>{'\n'}₱ 100 - 200</Text>         
                       </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/gal2.jpg')}>
              

            <Text style={styles.label}>
                <Text>Hair Rebond</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 1000 - 1800</Text>         
             </Text>
               
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/bg_manicure.jpg')}>
            <Text style={styles.label}>
                <Text>Regular Manicure</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 75 - 130 </Text>         
             </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/rebond_brazil.jpg')}>
            <Text style={styles.label}>
                <Text>Rebond Brazilian</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 1000 - 2500 </Text>         
             </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/loreal_spa.jpg')}>
            <Text style={styles.label}>
                <Text>Rebond Brazilian</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 400 </Text>         
             </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/bg_eyelash.jpg')}>
            <Text style={styles.label}>
                <Text>Keratin Lashlift</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 300 </Text>         
             </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <ImageBackground style={styles.bg} source={require('../picture/hair_color.jpg')}>
            <Text style={styles.label}>
                <Text>Hair Color</Text>
                <Text style={styles.labelPrice}>{'\n'}₱ 300 - 700</Text>         
             </Text>
            </ImageBackground>
          </TouchableOpacity>

             </View>
           </ScrollView>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get('window').width,
        height: 'auto',  
        alignItems: 'center',
        alignContent: 'center',
    },

    bg:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 7,
        opacity: 0.8,
    },

    btn:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 7,
    },

    label:{
        fontSize: 40,
        color: 'black',
        fontFamily: "Poppins_600SemiBold",
        marginTop: 'auto',
        marginLeft: 5,
        textShadowColor: 'black',
    },

    labelPrice:{
        fontSize: 20,
        color: 'black',
        fontFamily: "Poppins_600SemiBold",
        marginLeft: 5,
        textShadowColor: 'black',
        marginBottom: 5,
    },
})

export default Services;