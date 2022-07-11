import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView,TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { getDatabase, ref,onValue } from "firebase/database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const db = getDatabase()
const auth = getAuth()

const Forgot = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [key, setKey] = useState('')
    const [exists, setExists] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [ok, setOk] = useState(false)

    const reset = () => {
      setEmail('')
      setKey(null)
      setExists(false)
    }

    const sendEmail = () => {
      sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('sent')
        setOk(true)
        setNotFound(false)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found'){
          setNotFound(true)
        }else if(errorCode === 'auth/wrong-password'){
          setExists(true)
          setNotFound(false)
        }
        // ..
      });
    }

    const inputRef = useRef();
    const editText = useCallback(() => {
      inputRef.current.setNativeProps({ text: "" });
    }, []);

    const searchUser = (userEmail) => {
        const customerRef = ref(db, 'customer/');
        onValue(customerRef, (snapshot) => {
            snapshot.forEach((child) => {
                if(child.val().customer_email === userEmail){
                    console.log(child.val())
                    proceed(child.key)
                }else{
                    console.log('wala')
                    proceed()
                }
               
            })
        });
    }

    const proceed = (userKey) => {
       if(userKey != null){
         
          setExists(false)
          setKey(userKey)
          navigation.navigate('Question', {id: userKey})
          reset()
          editText
       }else{
        setExists(true)
       }
    }

  

    // const updatePassword = () => {
    //     const dbRef = ref(db, `customer/${key}`)
    //     update(dbRef, {customer_password: "newpassword"}).then(() => {
    //     console.log("Data updated");
    //     }).catch((e) => {
    //     console.log(e);
    //     })
    // }

    return(
        <SafeAreaView style={styles.container}>
      
        <View>
        <View style={styles.div2}>
            
            <Text style={styles.titleHead}>FORGOT PASSWORD</Text>
            <View style={styles.inputCon}>
                <MaterialCommunityIcons name="email" ref={inputRef} style={styles.iconMaterial} size={30} />
                    <TextInput style={styles.input} placeholder='Enter your email address'
                    value={email} onChangeText={(value) => setEmail(value)}/>
            </View>
            {notFound == true ? (
              <View style={styles.warningDiv}>
                <View style={styles.bg}>
                  <MaterialCommunityIcons name="alert-circle-outline" color={'white'} size={32} />
                </View>
                  <Text style={styles.warningLabel}>Wrong email!</Text>
             </View>
            ): ok == true ? (
              <View style={styles.warningDiv2}>
                <View style={styles.bg2}>
                  <MaterialCommunityIcons name="check" color={'white'} size={32} />
                </View>
                  <Text style={styles.warningLabel}>Email has been sent</Text>
             </View>) : null}
       
            <TouchableOpacity style={styles.forconfirmBtn} onPress={() => sendEmail() }>
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

    warningDiv2: {
      width: Dimensions.get('window').width - 70,
      backgroundColor: 'green',
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

    bg2: {
      top: 0,
      bottom: 0,
      backgroundColor: 'green',
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
  

export default Forgot