import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView,TextInput, Image, TouchableOpacity, Dimensions} from 'react-native';
import { initializeApp } from 'firebase/app';
import * as firebase from "firebase/app";
import { getDatabase, ref,child, get, query, onValue, orderByChild, equalTo } from "firebase/database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import {YellowBox} from 'react-native';


const firebaseConfig = {
    apiKey: "AIzaSyC8U6fT7gT4dSn7faPZuuUzdLlKpkihwlg",
    authDomain: "trendz-ph.firebaseapp.com",
    databaseURL: "https://trendz-ph-default-rtdb.firebaseio.com",
    projectId: "trendz-ph",
    storageBucket: "trendz-ph.appspot.com",
    messagingSenderId: "921243198338",
    appId: "1:921243198338:web:3e29dcaeae682c551b659b",
    measurementId: "${config.measurementId}"
};

// const firebaseApp = getApp();
// const storage = getStorage(firebaseApp, "gs://trendz-ph.appspot.com/");


let app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig)
const dbRef = ref(getDatabase());
const db = getDatabase()   
const provider = new GoogleAuthProvider();
const auth = getAuth();

function Login({navigation}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nav, setNav] = useState(false);
  const [tempPass, setTempPass] = useState('');
  const [warn, setWarning] = useState(false)
  const [login, setLogin] = useState(false)
  const [exists, setExists] = useState(false)

  const [errPass, setErrPass] = useState(false)
  const [errEmail, setErrEmail] = useState(false)
  const [verified, setVerified] = useState(false)
  const [errEmpty, setErrEmpty] = useState(false)

  var flag = true;
  var warning;
  var arr_emp = [];

  var arr_employee = []
  var arr_customers = []

  const [arrEmp, setArrEmp] = useState([])
  const [arrUser, setArrUsers] = useState([])

  const inputRef = useRef();
  const editText = useCallback(() => {
    inputRef.current.setNativeProps({ text: "" });
  }, []);

  const [label, setLabel] = useState('eye-off-outline')

  function showPassword(){
    if(label == 'eye-off-outline'){
      return true
    }else{
      return false
    }
  }

  const tryAuth = (user_email, user_password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user_email,user_password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.emailVerified)
        if(user.emailVerified === false){
          setVerified(true)
        }else{
          if (user !== null) {
            user.providerData.forEach((profile) => {
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Photo URL: " + profile.phoneNumber);
              
              global.userType = 'customer'
              global.employee_id = user.uid,
              global.employeeName = profile.displayName;
              global.employeeEmail = profile.email;
              global.employeeProfile =  profile.photoURL;
              global.employeePassword = password
              getOtherInfo(user.uid)
              navigation.replace('Home_Employee')
              
            });
          }
        }
        
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found'){
          loginEmployee(user_email, user_password)
        }else if(errorCode === 'auth/wrong-password'){
          setErrEmail(false)
          setErrPass(true)
        }
      });
  }

  const loginEmployee = (user_email, user_password) => {
    const empRef = query(ref(db, 'employee/'), orderByChild('employee_email'), equalTo(user_email));
    get(empRef).then(snap => {
      if(snap.val() === null){
          setErrEmail(true)
      }else{ 
        snap.forEach((info) => {
          if(user_password === info.val().employee_password){
            setErrEmail(false)
            global.employee_id = info.key,
            global.employeeName = info.val().employee_name;
            global.employeeEmail = info.val().employee_email;
            global.employeePassword = info.val().employee_password;
            global.employeeContact = info.val().employee_contact;
            global.employeeSchedule = info.val().employee_schedule;
            global.employeeProfile = info.val().employee_profile;
            global.userType = 'employee'
            navigation.replace("Home_Employee")
          }else{
            setErrEmail(false)
            setErrPass(true)
          }
        })
      }
    })
  }
  

  const getOtherInfo = (user_id) => {
    const customerRef = query(ref(db, 'information/'), orderByChild('customer_id'), equalTo(user_id));
    get(customerRef).then(info => {
      if(info.val() === null){
        console.log('no data')
      }else{
        info.forEach((item) => {
          global.employeeAddress = item.val().customer_address
          global.employeeContact = item.val().customer_phone
        })
      }
    })
  }

  



//console.log(global.flag)

  useEffect(() => {
   setWarning(false)
   ///addEmails()
   addEmails()
   return () => {
    setEmail('')
    setPassword('')
  };
  }, [])

  const [empt, setEmpt] = useState(false)

  const checkIfExist = (uid, password) => {
      get(child(dbRef, `customer/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
         if(snapshot.val().customer_email === email){
           setErrEmail(false)
           if(snapshot.val().customer_password === password){
              global.employee_id = snapshot.key,
              global.employeeName = snapshot.val().customer_name;
              global.employeeEmail = snapshot.val().customer_email;
              global.employeePassword = snapshot.val().customer_password;
              global.employeeContact = snapshot.val().customer_contact;
              global.employeeAddress = snapshot.val().customer_address;
              global.employeeProfile = snapshot.val().customer_profile;
              global.employeeSecQuestion = snapshot.val().customer_question;
              global.employeeAnswer = snapshot.val().customer_answer;
              
              navigation.replace('Home_Employee')
              console.log('Current User: ', global.userType, global.employee_id)
             setErrPass(false)
             setErrEmail(false)
             setLogin(true)
           }else{
             setErrPass(true)
           }
          
         }else{
          console.log("No data available");
          setErrEmail(true)
         }
        } else {
          // console.log("No data available");
          setErrEmail(true)
        }
      }).catch((error) => {
        console.error(error);
      });
    
    
  }



  const confirmUser = (path, userEmail, userPassword) =>{
    const xPath = "'" + path + "'"
    const dbRef = ref(getDatabase(), path);
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {      
        if(path == 'employee'){
          if(userEmail === childSnapshot.val().employee_email){
            checkIfExistEmp(childSnapshot.key, userPassword)
            setErrEmail(false)
            global.userType = snapshot.key;
            //console.log(childSnapshot.key)
          }
        }else if(path == 'customer'){
          if(userEmail === childSnapshot.val().customer_email){
            checkIfExist(childSnapshot.key, userPassword)
            setErrEmail(false)
            //console.log(childSnapshot.key)
            global.userType = snapshot.key;
          }  
        } 
      });
    }, {
      onlyOnce: true
    });
  }


  const tryCheck = (user_email, user_password) => {
    const employeeRef = query(ref(db, 'employee/'), orderByChild('employee_email'), equalTo(user_email));
    const customerRef = query(ref(db, 'customer/'), orderByChild('customer_email'), equalTo(user_email));
    console.log(customerRef)
    get(employeeRef).then(snapshot => {
      if(snapshot.val() === null){
        get(customerRef).then(snapshotEmp => {
          if(snapshotEmp.val() === null){
            console.log('wala talaga')
          }else{
            console.log('meron emp')
          }
        })
      }else{
        console.log('meron customer')
      }
     
    })
  }

  const check = (user_email, user_password) => {
    
    if(arrUser.includes(user_email)){
      console.log('meron cust')
      confirmUser('customer', user_email, user_password)
      //setErrEmpty(false)
    }else if(arrEmp.includes(user_email)){
      console.log('meron emp')
      confirmUser('employee', user_email, user_password)
      //setErrEmpty(false)
    }else if(user_email == '' && user_password == ''){
      console.log('lagay')
      setErrEmpty(true)
    }else{
      console.log('di nag exist')
      setErrEmail(true)
    }
  }



  const addEmails = (user_email, user_password) => {
    const empRef = ref(getDatabase(), 'employee');
    const userRef = ref(getDatabase(), 'customer');

    onValue(empRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        arrUser.push(childSnapshot.val().employee_email)
        setArrEmp(arrEmp)
      });
     
    },
     {
      onlyOnce: true
    });

    onValue(userRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
       arrUser.push(childSnapshot.val().customer_email)
       setArrUsers(arrUser)
        //console.log(emails)
      });

    }, {
      onlyOnce: true
    });

    
     

  }

 

  const checkIfExistEmp = (uid, password) => { 
       get(child(dbRef, `employee/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
         if(snapshot.val().employee_email === email){
           setErrEmail(false)
           if(snapshot.val().employee_password === password){
                  setErrPass(false)
                  setErrEmail(false)
                  setLogin(true)
                  global.employee_id = snapshot.key,
                  global.employeeName = snapshot.val().employee_name;
                  global.employeeEmail = snapshot.val().employee_email;
                  global.employeePassword = snapshot.val().employee_password;
                  global.employeeContact = snapshot.val().employee_contact;
                  global.employeeSchedule = snapshot.val().employee_schedule;
                  global.employeeProfile = snapshot.val().employee_profile;
                  navigation.replace('Home_Employee')
                  console.log('Current User: ', global.userType, global.employee_id)
                 
           }else{
             setErrPass(true)
           }
          
         }else{
          console.log("No data available");
          setErrEmail(true)
         }
        } else {
          // console.log("No data available");
          setErrEmail(true)
        }
      }).catch((error) => {
        console.error(error);
      });
     
    
  }

  

    return(
      <SafeAreaView style={styles.container}>
      
      <View>
      <View style={styles.div2}>
        
        <Image style={styles.logo} source={require('../picture/logo.png')} />
        <View style={styles.inputCon}>
              <MaterialCommunityIcons name="account"  style={styles.iconMaterial} size={30} />
                   <TextInput style={styles.input} ref={inputRef} placeholder='Enter your email address' 
                     value={email} onChangeText={(text) => setEmail(text)}/>
                  </View>
           <View style={styles.inputCon}>
              <MaterialCommunityIcons name="lock"  style={styles.iconMaterial} size={30} />
                   <TextInput style={styles.input} ref={inputRef} placeholder='Enter your password' 
                     value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={showPassword()}/>
                      <TouchableOpacity style={styles.showPass}
                      onPress={() => setLabel(label == 'eye-outline' ? 'eye-off-outline': 'eye-outline' )}>
                       <MaterialCommunityIcons name={label}  style={styles.iconMaterial} size={30} />
                      </TouchableOpacity>
            </View>
      {errEmail == true ?  (
         <View style={styles.warningDiv}>
         <View style={styles.bg}>
          <MaterialCommunityIcons name="alert-circle-outline" color={'white'} size={32} />
         </View>
          <Text style={styles.warningLabel}>Account doesn't exists!</Text>
        </View>
     
      ) : errPass == true ? (
        <View style={styles.warningDiv}>
         <View style={styles.bg}>
          <MaterialCommunityIcons name="alert-circle-outline" color={'white'} size={32} />
         </View>
          <Text style={styles.warningLabel}>Wrong password</Text>
        </View>
      ) : verified == true ?  (
        <View style={styles.warningDiv}>
         <View style={styles.bg}>
          <MaterialCommunityIcons name="alert-circle-outline" color={'white'} size={32} />
         </View>
          <Text style={styles.warningLabel}>Email not verified!</Text>
        </View>
    
     ): errEmpty == true ? (
      <View style={styles.warningDiv}>
       <View style={styles.bg}>
        <MaterialCommunityIcons name="alert-circle-outline" color={'white'} size={32} />
       </View>
        <Text style={styles.warningLabel}>Enter your email and password</Text>
      </View> ) : null}
         

      <TouchableOpacity style={styles.forconfirmBtn} onPress={() => tryAuth(email, password)}>
          <Text style={styles.title}>LOGIN</Text>
        </TouchableOpacity>
      
        <TouchableOpacity style={{
          marginTop: 15,
        }} 
        onPress={() => navigation.navigate('SignUp')}
        >
        
          <Text style={{
            fontSize: 15,
            fontFamily: 'Poppins_400Regular',
          }}>Doesn't have an account? Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          marginTop: 8,
        }} 
        onPress={() => navigation.navigate("Forgot Password")}
        >
        
          <Text style={{
            fontSize: 15,
            fontFamily: 'Poppins_400Regular',
          }}>Forgot Password?</Text>
        </TouchableOpacity>

     

      

      </View>
    
      </View> 
    
      </SafeAreaView>      

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
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

  bg: {
    top: 0,
    bottom: 0,
    backgroundColor: 'red',
    position: 'absolute',
    padding: 10,
  },

  
  successDiv: {
    width: Dimensions.get('window').width - 70,
    backgroundColor: 'green',
    height: 50,
    padding: 10,
    flexDirection: 'row',
    elevation: 5,
    marginTop: 5,
    
  },

  successbg: {
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


export default Login;
