import React, { Component } from 'react';
import { useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar,  RefreshControl, ImageBackground, TouchableOpacity, ScrollView, Platform, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStorage, put, ref as ref_storage,putFile, uploadBytes, uploadBytesResumable, getDownloadURL, listAll} from "firebase/storage";
import { getDatabase, child, set, get, ref as ref_database, query, orderBy, limit, onChildAdded, limitToLast, orderByChild, onChildRemoved, push } from "firebase/database";


const db = getDatabase();
const storage = getStorage()

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Stylist = () =>{
    const [sampleImage, setSampleImage] = useState();
    var arr = []; var empArr = []
    const [url, setUrl] = useState([]);
    var imgArr = []
    const [wtf, setWtf] = useState({imgArr})
    const overviewRef = ref_storage(storage, `gallery`);
   

    const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    }, []);

    const getSampleImage = () => {
    
        listAll(overviewRef).then((res) =>{
            res.items.forEach((imageRef) =>{
                getDownloadURL(imageRef).then((urls) =>{
                   url.push(urls)
                   setUrl(url)
                })
            })
        })
    }

    // const getSampleImage = () => {  
    //     listAll(overviewRef).then((res) => {
    //         let promises = res.items.map((imageRef) => getDownloadURL(imageRef));
    //         Promise.all(promises).then((urls) => {
    //                 url.push({
    //                     link: urls
    //                 })
    //                 setUrl(url)
    //         //    url.arr.push({link: urls})
    //         //    var ar = urls.toString().split(',')
    //         //    //console.log(ar.length)
    //         //    var ctr = 0;
    //         //   for(let i = 0; i < ar.length; i++){
    //         //     imgArr.push(ar[i])
    //         //   }
    //         console.log(url)
    //         })
    //     }).catch((err)=> {
    //         console.log(err)
    //     })
    // }


    useEffect(() => {  
        onRefresh()
        getSampleImage()
     }, [])

    
   
    return(
      
        <ScrollView
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}/>
        }>
        <View  style={styles.mainContainer}>        

          {
               url.map((i) => (
                    <View style={styles.container} key={i}>           
                    <ImageBackground style={styles.imageBg} imageStyle={{borderRadius: 30}}  source={{uri: i}} resizeMode="cover">
                            
                    </ImageBackground>
                    </View>
                ))
          }

        </View>
         
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,  
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap", 
    },

    container: {
        width: 195,
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
})
export default Stylist;