import React, { Component } from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { initializeApp, getApp } from "firebase/app";
import * as firebase from "firebase/app";
import {
  getDatabase,
  get,
  set,
  ref as ref_database,
  onValue,
  orderByChild,
  onChildAdded,
  onChildChanged,
  query,
  equalTo,
  update,
} from "firebase/database";
import { validateContextObject } from "@firebase/util";
import { database } from "@react-native-firebase/database";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref as ref_storage,
  child,
  put,
  putFile,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { StackActions } from "@react-navigation/native";
import {
  getAuth,
  updateProfile,
  updatePassword,
  promptForCredentials,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const dbRef = ref_database(getDatabase());
const db = getDatabase();
const storage = getStorage();
const auth = getAuth();

const storageRef = ref_storage(storage);
const usertype = () => {
  if (global.userType == "customer") {
    return true;
  } else {
    return false;
  }
};

const EditProfile = ({ navigation }) => {
  const [newName, setNewName] = useState(global.employeeName);
  const [newContact, setNewContact] = useState(global.employeeContact);
  const [newPassword, setNewPassword] = useState(global.employeePassword);
  const [empKey, setEmpKey] = useState(global.employee_id);
  const [tempImg, setTempImg] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [profile, setProfilePicture] = useState("a");
  const [errorName, setErrorName] = useState(false);
  const [errorContact, setErrorContact] = useState(false);

  function checkInput() {
    var letters = /^[\.a-zA-Z0-9 ]*$/;
    var emailReg = /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+.com/;

    if (
      newName.length === null ||
      newName.length <= 10 ||
      !letters.test(newName)
    ) {
      setErrorName(true);
    } else {
      setErrorName(false);
      if (newContact.length < 11 || newContact.slice(0, 2) != "09") {
        setErrorContact(true);
      } else {
        setErrorContact(false);
        setModalVisible(true);
      }
    }
  }

  const reAuth = () => {
    const user = auth.currentUser;
    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = EmailAuthProvider.credential(
      user.email,
      global.employeePassword
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePass();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const empUpdate = () => {
    const dbRef = ref_database(db, `employee/${global.employee_id}`);
    if (imageName != "") {
      uploadProfile();
      global.employeeProfile = imageName;
    }
    update(dbRef, {
      employee_profile: imageName != "" ? imageName : global.employeeProfile,
    })
      .then(() => {
        console.log("Data updated");
        setImage(null);
        setTimeout(() => navigation.replace("Home_Employee"), 1000);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateContact = (uid) => {
    const dbRef = ref_database(db, `information/${uid}`);
    update(dbRef, {
      customer_phone:
        newContact != global.employeeContact
          ? newContact
          : global.employeeContact,
      fullname: newName != global.employeeName ? newName : global.employeeName,
    })
      .then(() => {
        console.log("Data updated");
        global.employeeContact = newContact;
        global.employeeName =
          newName != global.employeeName ? newName : global.employeeName;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const searchContact = () => {
    const customerRef = query(
      ref_database(db, "information/"),
      orderByChild("customer_id"),
      equalTo(global.employee_id)
    );
    get(customerRef).then((info) => {
      if (info.val() === null) {
        console.log("wala ih");
      } else {
        info.forEach((item) => {
          if (item.val().customer_id === global.employee_id) {
            updateContact(item.key);
            // console.log(item.key)
          } else {
            console.log("error");
          }
        });
      }
    });
  };

  const updatePass = () => {
    const user = auth.currentUser;
    const newPasswords = newPassword;

    updatePassword(user, newPasswords)
      .then(() => {
        console.log("password changed!");
      })
      .catch((error) => {
        console.log("nope");
      });
  };

  const newProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: newName,
      photoURL: imageName != "" ? imageName : global.employeeProfile,
    })
      .then(() => {
        console.log("updated!");

        if (imageName != "") {
          uploadProfile();
          global.employeeProfile = imageName;
        }

        if (global.employeePassword != newPassword) {
          reAuth();
        }

        if (global.employeeContact != newContact || global.employeeName != newName) {
          searchContact();
        }

        global.employeeName = newName;
        navigation.reset({
          index: 0,
          routes: [{ name: "Home_Employee" }],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const ModalAsk = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        blurRadius={30}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBody}>
            <View style={styles.modalContainer}>
              <MaterialCommunityIcons
                name="account-question"
                style={{ alignSelf: "center" }}
                color={"red"}
                size={100}
              />
              <Text style={styles.modalLabelTitle}>
                Are you sure you want to edit?
              </Text>
              <View style={styles.forBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() =>
                    setModalVisible(!modalVisible) ||
                    global.userType == "customer"
                      ? newProfile()
                      : empUpdate()
                  }
                >
                  <Text style={styles.btnModalText}>Confirm Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnModalDismiss}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.btnModalText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      const filename = result.uri.substring(result.uri.lastIndexOf("/") + 1);
      setImage(result.uri);
      setImageName(filename);
      setTempImg(result.uri);
      // const metadata = {
      //   contentType: 'image/jpg',
      // };
      // const response = await fetch(result.uri);
      // const blob = await response.blob();

      //   const storage = getStorage();
      //   const imageRef = ref_storage(storage, "profile/" + filename);
      //   uploadBytes(imageRef, blob, metadata).then((snapshot) => {
      //       console.log('Uploaded a blob or file!', image);
      //     });
    }
  };

  function setProfile() {
    // Create a reference to the file we want to download

    const starsRef = ref_storage(storage, "profile/" + global.employeeProfile);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        //console.log(url)
        //setImage(url)
        setProfilePicture(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }
  console.log(
    "Image: " + image,
    "\nImageName: " + imageName,
    "\nPRofile: " + global.employeeProfile
  );

  const uploadProfile = async () => {
    const metadata = {
      contentType: "image/jpg",
    };
    const response = await fetch(image);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const imageRef = ref_storage(storage, "profile/" + imageName);
    uploadBytes(imageRef, blob, metadata);
    // uploadBytes(imageRef, blob).then((snapshot) => {
    //     console.log('Uploaded a blob or file!', imageName);
    // });
  };

  const hasProfile = () => {
    uploadProfile();
    set(ref_database(db, "customer/" + global.employee_id), {
      customer_name: newName,
      customer_email: global.employeeEmail,
      customer_password: newPassword,
      customer_address: global.employeeAddress,
      customer_contact: newContact,
      customer_profile: imageName,
      customer_question: global.employeeSecQuestion,
      customer_answer: global.employeeAnswer,
    })
      .then(() => {
        console.log("yes yes yow");
      })
      .catch((error) => {
        console.log("taena");
      });
    setTimeout(() => navigation.replace("Home_Employee"), 1000);
    global.employeeName = newName;
    global.employeePassword = newPassword;
    global.employeeContact = newContact;
    global.employeeProfile = imageName;
    setImage(null);
  };

  const hasntProfile = () => {
    set(ref_database(db, "customer/" + global.employee_id), {
      customer_name: newName,
      customer_email: global.employeeEmail,
      customer_password: newPassword,
      customer_address: global.employeeAddress,
      customer_contact: newContact,
      customer_profile: global.employeeProfile,
      customer_question: global.employeeSecQuestion,
      customer_answer: global.employeeAnswer,
    })
      .then(() => {
        console.log("yes yes yow");
      })
      .catch((error) => {
        console.log("taena");
      });
    setTimeout(() => navigation.replace("Home_Employee"), 1000);
    global.employeeName = newName;
    global.employeePassword = newPassword;
    global.employeeContact = newContact;
    global.employeeProfile = imageName;
    setImage(null);
  };

  function updateInfo() {
    if (global.userType == "customer") {
      if (imageName === "") {
      } else {
        uploadProfile();
      }
      set(ref_database(db, "customer/" + global.employee_id), {
        customer_name: newName,
        customer_email: global.employeeEmail,
        customer_password: newPassword,
        customer_address: global.employeeAddress,
        customer_contact: newContact,
        customer_profile: imageName === "" ? global.employeeProfile : imageName,
        customer_question: global.employeeSecQuestion,
        customer_answer: global.employeeAnswer,
      })
        .then(() => {
          console.log("yes yes yow");
          navigation.reset({
            index: 0,
            routes: [{ name: "Home_Employee" }],
          });
        })
        .catch((error) => {
          console.log("taena");
        });

      global.employeeName = newName;
      global.employeePassword = newPassword;
      global.employeeContact = newContact;
      global.employeeProfile =
        imageName === "" ? global.employeeProfile : imageName;
      setImage(null);
    } else {
      const dbRef = ref_database(db, `employee/${global.employee_id}`);
      uploadProfile();
      update(dbRef, { employee_profile: imageName })
        .then(() => {
          console.log("Data updated");
          setImage(null);
          setTimeout(() => navigation.replace("Home_Employee"), 1000);
          global.employeeProfile = imageName;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  /*
    get(child(dbRef, `customer/${global.employee_id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

    function setNewInfo(){
        set(ref(db, 'employee/' + global.employee_id), {
           employee_name: newName,
           employee_email: global.employeeEmail,
           employee_password: global.employeePassword,
           employee_schedule: global.employeeSchedule,
           employee_contact: global.employeeContact,
          })
          .then(() => {
          console.log('yes yes yow')
          })
          .catch((error) => {
          console.log('taena')
          });
          global.employeeName = newName;
      }

      **/

  useEffect(() => {
    if (tempImg == null) {
      setProfile();
    }
    return () => {};
  });

  return (
    <View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView>
          <ModalAsk />
          <SafeAreaView style={styles.mainContainer}>
            <ScrollView>
              <Image
                source={{ uri: tempImg == null ? profile : tempImg }}
                style={styles.changeProfile}
              />
              <TouchableOpacity
                style={styles.btn}
                title="Pick an image from camera roll"
                onPress={pickImage}
              >
                <Text style={styles.lbl}>Change Profile</Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.labelInput}>Full Name</Text>
                <TextInput
                  style={errorName === true ? styles.inputError : styles.input}
                  value={newName}
                  onChangeText={(text) => setNewName(text)}
                  editable={usertype()}
                  selectTextOnFocus={usertype()}
                />

                <Text style={styles.labelInput}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={global.employeeEmail}
                  editable={false}
                  selectTextOnFocus={false}
                />

                <Text style={styles.labelInput}>Contact Number</Text>
                <TextInput
                  style={
                    errorContact === true ? styles.inputError : styles.input
                  }
                  value={newContact}
                  onChangeText={(text) => setNewContact(text)}
                  editable={usertype()}
                  keyboardType="numeric"
                  maxLength={11}
                  selectTextOnFocus={usertype()}
                />

                <Text style={styles.labelInput}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                  editable={usertype()}
                  selectTextOnFocus={usertype()}
                />

                {/* <Text style={styles.labelInput}>Confirm Password</Text>   
                    <TextInput style={styles.input} editable={usertype()} selectTextOnFocus={usertype()}/> */}
              </View>
            </ScrollView>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ marginTop: "auto" }}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => checkInput()}
        >
          <Text style={styles.labelBtn}>Confirm Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    padding: 10,
  },

  confirmBtn: {
    alignSelf: "center",
    padding: 10,
    width: Dimensions.get("window").width + 10,
    borderWidth: 2,
    backgroundColor: "#FD62A1",
    borderColor: "#FD62A1",
    borderRadius: 10,
    textAlign: "center",
    alignContent: "center",
    marginTop: "auto",
  },

  labelBtn: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },

  inputError: {
    borderWidth: 2,
    borderColor: "red",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },

  inputContainer: {
    padding: 10,
    marginTop: 10,
  },

  lbl: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },

  labelInput: {
    fontFamily: "Poppins_600SemiBold",
  },

  changeProfile: {
    backgroundColor: "pink",
    height: 150,
    width: 150,
    alignSelf: "center",
    borderRadius: 100,
    justifyContent: "center",
  },

  container: {
    width: 196,
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

  modalView: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight + 200,
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
    borderColor: "#FD62A1",
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

  modalLabelTitleQR: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 10,
  },

  btnModalQR: {
    alignSelf: "center",
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 10,
    width: 300,
    elevation: 5,
    marginLeft: 5,
    marginTop: 10,
  },

  btnModal: {
    alignSelf: "center",

    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 10,
    width: 200,
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
});
export default EditProfile;
