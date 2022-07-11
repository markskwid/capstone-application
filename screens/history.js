import React, { Component } from "react";
import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getStorage,
  put,
  ref as ref_storage,
  putFile,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import {
  getDatabase,
  child,
  set,
  get,
  ref as ref_database,
  query,
  orderBy,
  limit,
  onChildAdded,
  limitToLast,
  orderByChild,
  onChildRemoved,
  push,
  startAt,
  orderByValue,
} from "firebase/database";

const db = getDatabase();
const storage = getStorage();

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const HistoryList = () => {
  var arr = [];
  const [historyList, setHistory] = useState({ arr });
  const [wtf, setWtf] = useState([]);
  const getHistory = () => {
    const history = query(
      ref_database(db, "success_appointment/"),
      orderByChild("fulldate"),
      startAt("2022-02-01")
    );

    get(history).then((snap) => {
      snap.forEach((item) => {
        if (global.userType === "customer") {
          if (global.employee_id === item.val().reserveBy_id) {
            arr.push({
              id: item.key,
              ...item.val(),
            });
            setWtf([...arr]);
          } else {
            console.log("wala");
          }
        }else{
            if (global.employee_id === item.val().servicedBy_id) {
                arr.push({
                  id: item.key,
                  ...item.val(),
                });
                setWtf([...arr]);
              } else {
                console.log("wala");
              }
        }
      });
    });
  };

  const DisplayHistoryEmp = () =>{
    if (historyList.arr.length === 0) {
        return (
          <View style={styles.appointmentEmpty}>
            <MaterialCommunityIcons
              name="calendar-remove"
              style={{ marginLeft: 2 }}
              color={"gray"}
              size={300}
            />
            <Text style={styles.appointmentEmptyLabel}>
              You don't have any appointment yet
            </Text>
          </View>
        );
      } else {
        return historyList.arr.map((item) => (
          <View style={styles.reservationContainer} key={item.id}>
           
            <View style={styles.serviceType}>
            <Text style={styles.monthLabel}>{item.month} {"\n"}
            <Text style={styles.dateLabel}>{item.date}</Text></Text>
          
          </View>
          <View style={styles.reservationInfo}>
          {global.userType == 'employee' ? (  <Text style={styles.infoLabel}>{"Name: "  + item.reserveBy_name}</Text> ) : null}
           <Text style={styles.infoLabel}>{"Date: "  + item.day + ", "+ item.month +" "+ item.date +", "+ item.year}</Text>
           <Text style={styles.infoLabel}>{"Time: " + item.time}</Text>
          </View>
  
       
          <View style={styles.service}>
            {item.type.trim().length < 14 ? (<Text style={styles.serviceLabel}>1 Service </Text>) : 
            item.type.trim().length == 14 ? (<Text style={styles.serviceLabel}>2 Services</Text>) : 
            item.type.trim().length == 19 ? (<Text style={styles.serviceLabel}>3 Services</Text>) : null}
            
          </View>
          
       </View>
        ));
      }
  }

  const DisplayHistory = () => {
    if (historyList.arr.length === 0) {
      return (
        <View style={styles.appointmentEmpty}>
          <MaterialCommunityIcons
            name="calendar-remove"
            style={{ marginLeft: 2 }}
            color={"gray"}
            size={300}
          />
          <Text style={styles.appointmentEmptyLabel}>
            You don't have any appointment yet
          </Text>
        </View>
      );
    } else {
      return historyList.arr.map((item) => (
        <View style={styles.reservationContainer} key={item.id}>
         
          <View style={styles.serviceType}>
          <Text style={styles.monthLabel}>{item.month} {"\n"}
          <Text style={styles.dateLabel}>{item.date}</Text></Text>
        
        </View>
        <View style={styles.reservationInfo}>
        {global.userType == 'employee' ? (  <Text style={styles.infoLabel}>{"Name: "  + item.reserveBy_name}</Text> ) : null}
         <Text style={styles.infoLabel}>{"Date: "  + item.day + ", "+ item.month +" "+ item.date +", "+ item.year}</Text>
         <Text style={styles.infoLabel}>{"Time: " + item.time}</Text>
         <Text style={styles.infoLabel}>{"Serviced by: " + item.servicedBy_name}</Text>
        </View>

     
        <View style={styles.service}>
          {item.type.trim().length < 14 ? (<Text style={styles.serviceLabel}>1 Service </Text>) : 
          item.type.trim().length == 14 ? (<Text style={styles.serviceLabel}>2 Services</Text>) : 
          item.type.trim().length == 19 ? (<Text style={styles.serviceLabel}>3 Services</Text>) : null}
          
        </View>
        
     </View>
      ));
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <ScrollView>
        {global.userType === 'customer' ? 
         <DisplayHistory/>:
         <DisplayHistoryEmp/>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    padding: 10,
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

serviceLabel: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
},

  dateLabel: {
    textAlign: 'center',
    fontFamily: "Poppins_600SemiBold",
    fontSize: 45,
},

  
  monthLabel: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
},

  appointmentEmpty: {
    alignSelf: "center",
    opacity: 0.5,
    marginTop: 30,
  },

  appointmentEmptyLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 29,
    color: "gray",
  },

  container: {
    width: 195,
    height: 300,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: "auto",
    marginTop: 5,
    elevation: 5,
  },

  imageBg: {
    width: 193,
    height: 298,
  },

  label: {
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Poppins_600SemiBold",
    color: "#FD62A1",
    textShadowColor: "black",
  },

  bgLabel: {
    backgroundColor: "pink",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 255,
    width: "auto",
    padding: 5,
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
});
export default HistoryList;
