import React, { Component } from "react";
import { useState, useReducer, useEffect } from "react";
import {
  StyleSheet,
  RefreshControl,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
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
} from "firebase/database";
import { validateContextObject } from "@firebase/util";
import { database } from "@react-native-firebase/database";
import { fonts } from "react-native-elements/dist/config";
import {
  getStorage,
  put,
  ref as ref_storage,
  putFile,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

const db = getDatabase();
const storage = getStorage();
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const HomeScreen = ({ navigation }) => {
  var arr = [];
  const [reservation, setReservation] = useState({ arr });
  const [reserve, setReserve] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState("a");
  const [errProfile, setErrProfile] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  function setProfile() {
    // Create a reference to the file we want to download

    const starsRef = ref_storage(storage, "profile/" + global.employeeProfile);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        //console.log(url)
        setImage(url);
        setErrProfile(false);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            setErrProfile(true);
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            setErrProfile(true);
            break;
          case "storage/canceled":
            // User canceled the upload
            setErrProfile(true);
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            setErrProfile(true);
            break;
        }
      });
  }

  //   function getLimitAppointment(){
  //     get(query(ref_database(db, 'reservation/'), limitToFirst(2))).then((child) =>{
  //       child.forEach((childSnap) => {
  //           if(global.userType === 'customer'){
  //             if(childSnap.val().reserveBy_id === global.employee_id){
  //                reservation.arr.push({
  //                     id: childSnap.key,
  //                     ...childSnap.val()
  //                 })
  //                 setReserve([...arr])
  //               }else{
  //                   console.log('tanginamo wala eh')
  //               }
  //           }else{
  //             if(global.employeeSchedule == "Monday to Tuesday"){
  //                 if(childSnap.val().day === 'Mon' || childSnap.val().day === 'Tue'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }else if(global.employeeSchedule == 'Wednesday - Thursday'){
  //                 if(childSnap.val().day === 'Wed' || childSnap.val().day === 'Thu'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }else if(global.employeeSchedule == 'Wednesday - Thursday'){
  //                 if(childSnap.val().day === 'Wed' || childSnap.val().day === 'Thu'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }else if(global.employeeSchedule == 'Thursday - Friday'){
  //                 if(childSnap.val().day === 'Thu' || childSnap.val().day === 'Fri'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }else if(global.employeeSchedule == 'Friday - Saturday'){
  //                 if(childSnap.val().day === 'Fri' || childSnap.val().day === 'Sat'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }else if(global.employeeSchedule == 'Monday - Tuesday'){
  //                 if(childSnap.val().day === 'Mon' || childSnap.val().day === 'Wed'){
  //                     arr.push({
  //                         id: childSnap.key,
  //                         ...childSnap.val()
  //                     })
  //                     setReserve([...arr])
  //                 }else{
  //                     console.log('wala')
  //                 }
  //             }

  //           }
  //       })
  //     });
  //   }

  //   function logOutUser(){
  //       if(global.userType == 'customer'){
  //         global.employee_id = '',
  //         global.employeeName = '';
  //         global.employeeEmail = '';
  //         global.employeePassword ='';
  //         global.employeeContact ='';
  //         global.employeeAddress ='';
  //         global.employeeProfile = null;
  //         global.userType = '';

  //       }else{
  //         global.employee_id = '',
  //         global.employeeName = '';
  //         global.employeeEmail = '';
  //         global.employeePassword ='';
  //         global.employeeContact = '';
  //         global.employeeSchedule = '';
  //         global.userType ='';

  //       }
  //   }

  const addEmail = () => {
    const commentsRef = ref(db, "post-comments/");
    onChildAdded(commentsRef, (data) => {
      addCommentElement(
        postElement,
        data.key,
        data.val().text,
        data.val().author
      );
    });
  };

  function realTimeUpdate() {
    const commentsRef = ref_database(db, "reservation/");
    onChildAdded(commentsRef, (data) => {
      if (global.userType == "customer") {
        if (global.employee_id === data.val().reserveBy_id) {
          console.log(data.val());
          arr.push({
            id: data.key,
            ...data.val(),
          });
        }
      } else {
        if (global.employeeSchedule == "Monday - Tuesday") {
          if (data.val().day === "Mon" || data.val().day === "Tue") {
            console.log(data.val());
            arr.push({
              id: data.key,
              ...data.val(),
            });
          } else {
            console.log("wala");
          }
        } else if (global.employeeSchedule == "Wednesday - Thursday") {
          if (data.val().day === "Wed" || data.val().day === "Thu") {
            console.log(data.val());
            arr.push({
              id: data.key,
              ...data.val(),
            });
          } else {
            console.log("wala");
          }
        } else if (global.employeeSchedule == "Thursday - Friday") {
          if (data.val().day === "Thu" || data.val().day === "Fri") {
            console.log(data.val());
            arr.push({
              id: data.key,
              ...data.val(),
            });
          } else {
            console.log("wala");
          }
        }
      }
      // customer
    });

    onChildRemoved(commentsRef, (data) => {
      if (global.userType == "customer") {
        if (global.employee_id === data.val().reserveBy_id) {
          console.log(data.val());
          setReservation((prevState) => ({
            // You can also get the current state passing a callback to this.setState
            arr: prevState.arr.filter(
              (reservation) => reservation.id !== data.key
            ),
          }));
        }
      } else {
        if (global.employeeSchedule == "Wednesday - Thursday") {
          if (data.val().day === "Wed" || data.val().day === "Thu") {
            console.log(data.val());
            setReservation((prevState) => ({
              // You can also get the current state passing a callback to this.setState
              arr: prevState.arr.filter(
                (reservation) => reservation.id !== data.key
              ),
            }));
          } else {
            console.log("wala");
          }
        } else if (global.employeeSchedule == "Wednesday - Thursday") {
          if (data.val().day === "Wed" || data.val().day === "Thu") {
            console.log(data.val());
            setReservation((prevState) => ({
              // You can also get the current state passing a callback to this.setState
              arr: prevState.arr.filter(
                (reservation) => reservation.id !== data.key
              ),
            }));
          } else {
            console.log("wala");
          }
        } else if (global.employeeSchedule == "Thursday - Friday") {
          if (data.val().day === "Thu" || data.val().day === "Fri") {
            console.log(data.val());
            setReservation((prevState) => ({
              // You can also get the current state passing a callback to this.setState
              arr: prevState.arr.filter(
                (reservation) => reservation.id !== data.key
              ),
            }));
          } else {
            console.log("wala");
          }
        }
      } // customer
    });
  }

  function getAppointment() {
    get(child(ref_database(db), `reservation/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            if (global.userType == "customer") {
              if (child.val().reserveBy_id === global.employee_id) {
                arr.push({
                  id: child.key,
                  ...child.val(),
                });

                //console.log(arr)
                setReserve([...arr]);
              } else {
                console.log("wala");
              }
            } else {
              if (global.employeeSchedule == "Monday - Tuesday") {
                if (child.val().day === "Mon" || child.val().day === "Tue") {
                  arr.push({
                    id: child.key,
                    ...child.val(),
                  });
                  setReserve([...arr]);
                } else {
                  console.log("wala");
                }
              } else if (global.employeeSchedule == "Wednesday - Thursday") {
                if (child.val().day === "Wed" || child.val().day === "Thu") {
                  arr.push({
                    id: child.key,
                    ...child.val(),
                  });
                  setReserve([...arr]);
                } else {
                  console.log("wala");
                }
              } else if (global.employeeSchedule == "Thursday - Friday") {
                if (child.val().day === "Thu" || child.val().day === "Fri") {
                  arr.push({
                    id: child.key,
                    ...child.val(),
                  });
                  setReserve([...arr]);
                } else {
                  console.log("wala");
                }
              } else if (global.employeeSchedule == "Friday - Saturday") {
                if (child.val().day === "Fri" || child.val().day === "Sat") {
                  arr.push({
                    id: child.key,
                    ...child.val(),
                  });
                  setReserve([...arr]);
                } else {
                  console.log("wala");
                }
              }
            }
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    onRefresh();
    realTimeUpdate();
    //getAppointment()
    setProfile();
    //getLimitAppointment()
    setModalVisible(false);
  }, []);

  const signOutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          navigation.replace("Login");
        }, 2000);
        console.log("sign out success");
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const ModalAsk = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        blurRadius={30}
      >
        <View style={homescreen.modalView}>
          <View style={homescreen.modalBody}>
            <View style={homescreen.modalContainer}>
              <Text style={homescreen.modalLabelTitle}>
                Are you sure you want to logout?
              </Text>
              <View style={homescreen.forBtnModal}>
                <TouchableOpacity
                  style={homescreen.btnModal}
                  onPress={() =>
                    setModalVisible(!modalVisible) || signOutUser()
                  }
                >
                  <Text style={homescreen.btnModalText}>Confirm Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={homescreen.btnModalDismiss}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={homescreen.btnModalText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const Appointment = () => {
    if (global.userType == "customer") {
      return reservation.arr.map((item) => (
        <View style={homescreen.reservationContainer} key={item.id}>
          <View style={homescreen.serviceType}>
            <Text style={homescreen.monthLabel}>
              {item.month} {"\n"}
              <Text style={homescreen.dateLabel}>{item.date}</Text>
            </Text>
          </View>
          <View style={homescreen.reservationInfoCustomer}>
            <Text>
              <Text style={homescreen.infoLabel}>Date: </Text>
              <Text style={homescreen.valueLabel}>
                {item.day +
                  ", " +
                  item.month +
                  " " +
                  item.date +
                  ", " +
                  item.year}
              </Text>
            </Text>
            <Text>
              <Text style={homescreen.infoLabel}>Time: </Text>
              <Text style={homescreen.valueLabel}>{item.time}</Text>
            </Text>
          </View>

          <View style={homescreen.service}>
            {item.type.trim().length < 14 ? (
              <Text style={homescreen.serviceLabel}>1 Service </Text>
            ) : item.type.trim().length == 14 ? (
              <Text style={homescreen.serviceLabel}>2 Services</Text>
            ) : item.type.trim().length == 19 ? (
              <Text style={homescreen.serviceLabel}>3 Services</Text>
            ) : null}
          </View>
        </View>
      ));
    } else {
      return reservation.arr.map((item) => (
        <View style={homescreen.reservationContainer} key={item.id}>
          <View style={homescreen.serviceType}>
            <Text style={homescreen.monthLabel}>
              {item.month} {"\n"}
              <Text style={homescreen.dateLabel}>{item.date}</Text>
            </Text>
          </View>

          <View style={homescreen.reservationInfo}>
            <Text>
              <Text style={homescreen.infoLabel}>Name: </Text>
              <Text style={homescreen.valueLabel}>{item.reserveBy_name}</Text>
            </Text>
            <Text>
              <Text style={homescreen.infoLabel}>Date: </Text>
              <Text style={homescreen.valueLabel}>
                {item.day +
                  ", " +
                  item.month +
                  " " +
                  item.date +
                  ", " +
                  item.year}
              </Text>
            </Text>
            <Text>
              <Text style={homescreen.infoLabel}>Time: </Text>
              <Text style={homescreen.valueLabel}>{item.time}</Text>
            </Text>
          </View>

          <View style={homescreen.service}>
            {item.type.trim().length < 14 ? (
              <Text style={homescreen.serviceLabel}>1 Service </Text>
            ) : item.type.trim().length == 14 ? (
              <Text style={homescreen.serviceLabel}>2 Services</Text>
            ) : item.type.trim().length == 19 ? (
              <Text style={homescreen.serviceLabel}>3 Services</Text>
            ) : null}
          </View>
        </View>
      ));
    }
  };

  return (
    <SafeAreaView style={homescreen.container_header}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ width: Dimensions.get("window").width }}
      >
        {modalVisible == true ? <ModalAsk /> : null}
        <View style={homescreen.header}>
          <Text
            style={{
              fontSize:
                Dimensions.get("window").width > 400
                  ? 17
                  : Dimensions.get("window").width < 400
                  ? 16
                  : 15,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Hello, {global.employeeName.split(" ")[0]}
            {"\n"}
            {global.userType == "employee"
              ? "Let's do our job passionately"
              : "Welcome to TRENDZ"}
          </Text>
          <TouchableOpacity
            style={homescreen.profile}
            onPress={() => navigation.navigate("Edit Profile")}
          >
            {errProfile === true ? (
              <MaterialCommunityIcons
                name="account"
                style={{ alignSelf: "center" }}
                color={"#FD62A1"}
                size={35}
              />
            ) : (
              <Image style={homescreen.profile} source={{ uri: image }} />
            )}
            {/* <Image style={homescreen.profile} source={{ uri: image}}/> */}
          </TouchableOpacity>
        </View>

        <View style={homescreen.container_body}>
          <View style={homescreen.carouselScrollView}>
            <ScrollView horizontal={true}>
              <Image
                style={homescreen.carousel}
                imageStyle={{ borderRadius: 40 }}
                source={require("../../picture/F.jpg")}
              />
              <Image
                style={homescreen.carousel}
                imageStyle={{ borderRadius: 40 }}
                source={require("../../picture/F.jpg")}
              />
            </ScrollView>
          </View>

          <View style={homescreen.forButtons}>
            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() => navigation.navigate("Edit Profile")}
            >
              <MaterialCommunityIcons
                name="account"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() => navigation.navigate("Notifications")}
            >
              <MaterialCommunityIcons
                name="bell-ring-outline"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                Notifications
              </Text>
            </TouchableOpacity>

            {global.userType == "employee" ? (
              <TouchableOpacity
                style={homescreen.menu_button}
                onPress={() => navigation.navigate("Appointment")}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  style={{ alignSelf: "center", marginTop: 5 }}
                  color={"#FD62A1"}
                  size={55}
                />
                <Text adjustsFontSizeToFit style={homescreen.button_title}>
                  Appointment
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={homescreen.menu_button}
                onPress={() => navigation.navigate("Book Now")}
              >
                <MaterialCommunityIcons
                  name="calendar-month"
                  style={{ alignSelf: "center", marginTop: 5 }}
                  color={"#FD62A1"}
                  size={55}
                />
                <Text adjustsFontSizeToFit style={homescreen.button_title}>
                  Booking
                </Text>
              </TouchableOpacity>
            )}

            {global.userType == "employee" ? (
              <TouchableOpacity
                style={homescreen.menu_button}
                onPress={() => navigation.navigate("QR Scanner")}
              >
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  style={{ alignSelf: "center", marginTop: 5 }}
                  color={"#FD62A1"}
                  size={55}
                />
                <Text adjustsFontSizeToFit style={homescreen.button_title}>
                  QR Scanner
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={homescreen.menu_button}
                onPress={() => navigation.navigate("Appointment")}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  style={{ alignSelf: "center", marginTop: 5 }}
                  color={"#FD62A1"}
                  size={55}
                />
                <Text adjustsFontSizeToFit style={homescreen.button_title}>
                  Appointment
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() => {
                global.userType == "customer"
                  ? navigation.navigate("Services")
                  : navigation.navigate("Salon Inventory");
              }}
            >
              <MaterialCommunityIcons
                name="hand-heart"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                {global.userType == "customer" ? "Services" : "Inventory"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() => navigation.navigate("Salon Gallery")}
            >
              <MaterialCommunityIcons
                name="image"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() => navigation.navigate("History")}
            >
              <MaterialCommunityIcons
                name="history"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homescreen.menu_button}
              onPress={() =>
                setTimeout(() => {
                  setModalVisible(true);
                }, 1000)
              }
            >
              <MaterialCommunityIcons
                name="logout-variant"
                style={{ alignSelf: "center", marginTop: 5 }}
                color={"#FD62A1"}
                size={55}
              />
              <Text adjustsFontSizeToFit style={homescreen.button_title}>
                Logout
              </Text>
            </TouchableOpacity>

            <View style={homescreen.forReservation}>
              <Text adjustsFontSizeToFit style={homescreen.schedule}>
                {global.userType == "customer"
                  ? "Upcoming Bookings"
                  : global.employeeSchedule}
              </Text>
              <View
                style={{
                  marginLeft: "auto",
                  borderWidth: 0.8,
                  height: 1,
                  alignSelf: "center",
                  width: Dimensions.get("window").width / 2.4,
                }}
              />
            </View>

            {reservation.arr.length == 0 ? (
              <View style={homescreen.appointmentEmpty}>
                <MaterialCommunityIcons
                  name="calendar-remove"
                  style={{ alignSelf: "center" }}
                  color={"gray"}
                  size={200}
                />
                <Text
                  adjustsFontSizeToFit
                  style={homescreen.appointmentEmptyLabel}
                >
                  You don't have any appointment yet
                </Text>
              </View>
            ) : (
              <Appointment />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const homescreen = StyleSheet.create({
  container_header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    width: Dimensions.get("window").width,
  },

  container_body: {
    width: Dimensions.get("window").width,
    alignContent: "center",
    backgroundColor: "white",
    height: "auto",
  },

  reservationContainer: {
    width: Dimensions.get("window").width - 20,
    marginTop: 5,
    height: 120,
    borderRadius: 25,
    backgroundColor: "pink",
    elevation: 5,
    padding: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "gray",
  },

  serviceImage: {
    height: 70,
    width: 70,
    alignSelf: "center",
  },

  reservationInfo: {
    marginLeft: 10,
    marginTop: 5,
    padding: 5,
  },

  reservationInfoCustomer: {
    marginLeft: 10,
    marginTop: 15,
    padding: 5,
  },

  service: {
    marginLeft: "auto",
    marginRight: 10,
    backgroundColor: "violet",
    height: 20,
    width: 80,
    borderRadius: 50,
  },

  infoLabel: {
    fontSize: 15,
    marginTop: 1,
    fontFamily: "Poppins_600SemiBold",
  },

  serviceType: {
    width: 100,
    backgroundColor: "#FD62A1",
    justifyContent: "center",
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
  },

  monthLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },

  dateLabel: {
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    fontSize: 40,
  },

  serviceLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },

  forButtons: {
    width: Dimensions.get("window").width,
    height: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  forReservation: {
    width: Dimensions.get("window").width - 7,
    height: "auto",
    flexDirection: "row",
    padding: 2,
    flexWrap: "wrap",
    marginTop: 15,
  },

  line: {
    borderBottomWidth: 1,
    width: Dimensions.get("window").width / 4,
    height: 14,
    marginLeft: "auto",
  },

  button_title: {
    fontSize:
      Dimensions.get("window").width > 400
        ? 11
        : Dimensions.get("window").width < 400
        ? 10
        : 10,
    marginTop: 7,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },

  schedule: {
    fontFamily: "Poppins_600SemiBold",
    fontSize:
      Dimensions.get("window").width > 400
        ? 17
        : Dimensions.get("window").width < 400
        ? 16
        : 15,
    paddingHorizontal: 5,
  },

  valueLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
  },

  menu_button: {
    backgroundColor: "pink",
    width: Dimensions.get("window").width / 4.4,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FD62A1",
    marginRight: "auto",
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
    marginLeft: "auto",
  },

  carousel: {
    height: 260,
    borderRadius: 40,
    backgroundColor: "red",
    width: Dimensions.get("window").width - 20,
    flex: 1,
  },

  carouselScrollView: {
    height: 260,
    borderRadius: 40,
    backgroundColor: "red",
    width: Dimensions.get("window").width - 20,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 5,
  },

  modalView: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight + 300,
  },

  check: {
    height: 150,
    width: 150,
  },

  modalHead: {
    backgroundColor: "pink",
    width: 300,
    height: 160,
  },

  modalBody: {
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#676767",
    borderRadius: 10,
    elevation: 5,
    padding: 22,
    width: Dimensions.get("window").width - 30,
  },

  forBtnModal: {
    padding: 10,
  },

  modalLabel: {
    fontSize: 16,
    marginTop: 2,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },

  modalLabelTitle: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },

  btnModal: {
    alignSelf: "center",
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 10,
    width: 300,
    elevation: 5,
    marginLeft: 5,
  },

  btnModalDismiss: {
    marginTop: 15,
  },

  btnModalText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },

  appointmentEmpty: {
    alignSelf: "center",
    opacity: 0.5,
    alignContent: "center",
    marginTop: 50,
    width: Dimensions.get("window").width - 20,
  },

  appointmentEmptyLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "gray",
  },
});
export default HomeScreen;
