import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
} from "react-native";
import { initializeApp } from "firebase/app";
import { useState, useRef, useEffect } from "react";
import * as firebase from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  set,
  get,
  Database,
  update,
  onValue,
  orderByChild,
  onChildAdded,
  limitToFirst,
  query,
  equalTo,
  push,
} from "firebase/database";
import { validateContextObject } from "@firebase/util";
import database from "@react-native-firebase/database";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { fonts } from "react-native-elements/dist/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const dbRef = ref(getDatabase());
const db = getDatabase();
const auth = getAuth();

export default function signup({ navigation }) {
  const keyboardVerticalOffset = Platform.OS === "android" ? 10 : 50;
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [disable, setDisable] = useState(true);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [errorName, setErrorName] = useState(false);
  const [errorAddress, setErrorAdd] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPass] = useState(false);
  const [errorConfirmPass, setErrorConfirmPass] = useState(false);
  const [errorQuestion, setErrorQuestion] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState(false);
  const [exists, setExists] = useState(false);
  const [label, setLabel] = useState("eye-off-outline");

  var arr = [];
  const [key, setKey] = useState({
    arr,
  });

  function showPassword() {
    if (label == "eye-off-outline") {
      return true;
    } else {
      return false;
    }
  }

  const tryAuth = () => {
    createUserWithEmailAndPassword(auth, email, confirmPass)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: fullName,
        })
          .then(() => {
            setDisable(false);
            push(ref(db, "information/"), {
              customer_id: user.uid,
              customer_phone: contact,
              customer_address: address,
              fullname: fullName,
              email: email,
              customer_password: confirmPass,
            });
            console.log("yes yes yow");
          })
          .catch((error) => {
            console.log(error);
          });
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("email sent!");
          setModalVisible(true);
          setExists(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (
          errorCode === "auth/invalid-email" ||
          errorCode === "auth/email-already-in-use"
        ) {
          setExists(true);
        }
      });
  };

  function addUser() {
    push(ref(db, "information/"), {
      customer_id: "awdawd",
    });
    setModalVisible(true);
  }

  const [meron, setMeron] = useState([]);

  // function checkEmail() {
  //   const dbRef = ref(getDatabase());
  //   get(child(dbRef, `customer`))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         snapshot.forEach((child) => {
  //           meron.push(child.val().customer_email)
  //           setMeron(meron)
  //         });

  //         // if (ems.includes(userEmail)) {
  //         //   setMeron(1);
  //         // } else {
  //         //   setMeron(0);
  //         // }
  //         // console.log(meron);
  //       } else {
  //         console.log("No data available");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  function checkUser() {
    var letters = /^[A-Za-z ]+$/;
    var emailReg = /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+.com/;
    if (
      fullName.length == 0 ||
      fullName === null ||
      fullName.length <= 5 ||
      !letters.test(fullName)
    ) {
      setErrorName(true);
    } else {
      setErrorName(false);
      if (address.length == 0 || address === null || address.length <= 5) {
        setErrorAdd(true);
      } else {
        setErrorAdd(false);
        if (
          contact.length == 0 ||
          contact === null ||
          contact.length <= 5 ||
          contact.length > 11 ||
          contact.slice(0, 2) != "09"
        ) {
          setErrorPhone(true);
        } else {
          setErrorPhone(false);
          if (
            email.length == 0 ||
            email === null ||
            email.length <= 5 ||
            !emailReg.test(email)
          ) {
            setErrorEmail(true);
          } else {
            setErrorEmail(false);
            if (
              password.length == 0 ||
              password === null ||
              password.length < 8 ||
              password.length >= 18
            ) {
              setErrorPass(true);
            } else {
              setErrorPass(false);
              if (password != confirmPass) {
                setErrorConfirmPass(true);
              } else {
                setErrorConfirmPass(false);
                tryAuth();
              } //confirmpass
              //pass
            } // exists
          } //email
        } //phone
      } // address
    }
  }

  useEffect(() => {
    setErrorName(false);
    setErrorAdd(false);
    setErrorPhone(false);
  }, []);

  const sports = [
    {
      label: "In what city were you born?",
      value: "In what city were you born?",
      color: "black",
      fontFamily: "Poppins_600SemiBold",
    },
    {
      label: "What is the name of your favorite pet?",
      value: "What is the name of your favorite pet?",
      color: "black",
      fontFamily: "Poppins_600SemiBold",
    },
    {
      label: "What is the name of your first school",
      value: "What is the name of your first school",
      color: "black",
      fontFamily: "Poppins_600SemiBold",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.header}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={styles.inputContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          blurRadius={30}
        >
          <View style={styles.modalView}>
            <View style={styles.modalBody}>
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                style={{ alignSelf: "center", elevation: 10 }}
                color={"#950245"}
                size={160}
              />
              <View style={styles.modalContainer}>
                <Text style={styles.modalLabelTitle}>Great!</Text>
                <Text style={styles.modalLabel}>
                  Verification has been sent to your email, please check it.
                </Text>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() =>
                    setModalVisible(!modalVisible) ||
                    navigation.replace("Login")
                  }
                >
                  <Text style={styles.btnModalText}>GO TO LOGIN </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.title}>SIGN UP</Text>
        <View
          style={errorName == false ? styles.inputCon : styles.inputConError}
        >
          <MaterialCommunityIcons
            name="account"
            style={
              errorName == false
                ? styles.iconMaterial
                : styles.iconMaterialError
            }
            size={30}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            editable={disable}
            onChangeText={(text) => setFullName(text)}
          />
        </View>

        <View
          style={errorAddress == false ? styles.inputCon : styles.inputConError}
        >
          <MaterialCommunityIcons
            name="home"
            style={
              errorAddress == false
                ? styles.iconMaterial
                : styles.iconMaterialError
            }
            size={30}
          />
          <TextInput
            style={styles.input}
            placeholder="Home Address"
            value={address}
            editable={disable}
            onChangeText={(text) => setAddress(text)}
          />
        </View>

        <View
          style={errorPhone == false ? styles.inputCon : styles.inputConError}
        >
          <MaterialCommunityIcons
            name="cellphone"
            style={
              errorPhone == false
                ? styles.iconMaterial
                : styles.iconMaterialError
            }
            size={30}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={11}
            placeholder="Phone Number"
            value={contact}
            editable={disable}
            onChangeText={(text) => setContact(text)}
          />
        </View>

        <View
          style={errorEmail == false ? styles.inputCon : styles.inputConError}
        >
          <MaterialCommunityIcons
            name="email"
            style={
              errorEmail == false
                ? styles.iconMaterial
                : styles.iconMaterialError
            }
            size={30}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            editable={disable}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View
          style={
            errorPassword == false ? styles.inputCon : styles.inputConError
          }
        >
          <MaterialCommunityIcons
            name="lock"
            style={
              errorPassword == false
                ? styles.iconMaterial
                : styles.iconMaterialError
            }
            size={30}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            editable={disable}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={showPassword()}
          />
          <TouchableOpacity
            style={styles.showPass}
            onPress={() =>
              setLabel(
                label == "eye-outline" ? "eye-off-outline" : "eye-outline"
              )
            }
          >
            <MaterialCommunityIcons
              name={label}
              style={styles.iconMaterial}
              size={30}
            />
          </TouchableOpacity>
        </View>

        {password.length >= 8 ? (
          <View
            style={
              errorPassword == false ? styles.inputCon : styles.inputConError
            }
          >
            <MaterialCommunityIcons
              name="lock"
              style={
                errorPassword == false
                  ? styles.iconMaterial
                  : styles.iconMaterialError
              }
              size={30}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPass}
              editable={disable}
              onChangeText={(text) => setConfirmPass(text)}
              secureTextEntry={showPassword()}
            />
            <TouchableOpacity
              style={styles.showPass}
              onPress={() =>
                setLabel(
                  label == "eye-outline" ? "eye-off-outline" : "eye-outline"
                )
              }
            >
              <MaterialCommunityIcons
                name={label}
                style={styles.iconMaterial}
                size={30}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {errorName == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>
              Please enter your proper name
            </Text>
          </View>
        ) : errorAddress == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>
              Please enter your proper address
            </Text>
          </View>
        ) : errorPhone == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>
              Please enter your proper contact
            </Text>
          </View>
        ) : errorEmail == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>
              Please enter your proper email
            </Text>
          </View>
        ) : errorPassword == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>
              Please enter a proper password
            </Text>
          </View>
        ) : errorConfirmPass == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>Password didn't match</Text>
          </View>
        ) : exists == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>Email is already used!</Text>
          </View>
        ) : errorQuestion == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>Please select a question!</Text>
          </View>
        ) : errorAnswer == true ? (
          <View style={styles.warningDiv}>
            <View style={styles.bg}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                color={"white"}
                size={32}
              />
            </View>
            <Text style={styles.warningLabel}>Please input your answer</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.btn}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 23,
              fontFamily: "Poppins_600SemiBold",
            }}
            onPress={checkUser}
          >
            CONFIRM
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },

  inputAndroid: {
    color: "black",
    paddingTop: 26,
    paddingHorizontal: 15,
    paddingBottom: 7,
    fontFamily: "Poppins_400Regular",
    fontSize: 17,
  },
  placeholderColor: "#bfbfbf",
  underline: { borderTopWidth: 0 },
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    flex: 5,
  },

  selector: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, //
  },

  title: {
    marginTop: StatusBar.currentHeight + 40,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },

  showPass: {
    color: "black",
    position: "absolute",
    right: 0,
    bottom: 6.5,
    opacity: 0.4,
  },

  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },

  inputContainer: {
    padding: 20,
  },

  inputCon: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    marginTop: 7,
  },

  inputConSelector: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    borderBottomWidth: 1,
  },

  inputConSelectorError: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "red",
  },

  inputConError: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "red",
    marginTop: 7,
  },

  iconMaterial: {
    alignSelf: "center",
    elevation: 10,
    marginTop: 13,
    color: "black",
  },

  iconMaterialError: {
    alignSelf: "center",
    elevation: 10,
    marginTop: 13,
    color: "red",
  },

  iconMaterialErrorQuestion: {
    alignSelf: "center",
    elevation: 10,
    marginTop: 13,
    color: "red",
  },

  input: {
    paddingTop: 22,
    paddingLeft: 14,
    width: Dimensions.get("window").width - 100,
    height: 60,
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
  },

  btn: {
    backgroundColor: "#FD62A1",
    height: 45,
    marginTop: 20,
    padding: 10,
    width: 300,
    borderRadius: 5,
    elevation: 5,
    alignSelf: "center",
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
    backgroundColor: "pink",
    borderRadius: 10,
    elevation: 5,
    height: "auto",
    borderWidth: 2,
    borderColor: "#FD62A1",
    padding: 22,
    width: Dimensions.get("window").width - 30,
  },

  modalLabel: {
    fontSize: 16,
    marginTop: 2,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },

  modalLabelTitle: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
  },

  btnModal: {
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 20,
    width: 200,
    elevation: 5,
  },

  btnModalText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },

  warningLabel: {
    fontSize: 17,
    marginTop: 4,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginLeft: 50,
  },

  warningDiv: {
    width: "auto",
    backgroundColor: "#ff5656",
    height: 50,
    padding: 10,
    flexDirection: "row",
    elevation: 5,
    marginTop: 10,
  },

  bg: {
    top: 0,
    bottom: 0,
    backgroundColor: "red",
    position: "absolute",
    padding: 10,
  },
});
