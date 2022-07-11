import React, { Component } from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import QRCode from "react-native-qrcode-svg";
import * as ImagePicker from "expo-image-picker";
import { fonts } from "react-native-elements/dist/config";
import * as firebase from "firebase/app";
import {
  getDatabase,
  ref as ref_database,
  set,
  get,
  update,
  onValue,
  orderByChild,
  onChildAdded,
  onChildChanged,
  onChildRemove,
  equalTo,
  push,
} from "firebase/database";
import { validateContextObject } from "@firebase/util";
import { database } from "@react-native-firebase/database";
import {
  getStorage,
  ref as ref_storage,
  child,
  put,
  putFile,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const ChooseService = ({ navigation, route }) => {
  const { reservationInfo } = route.params;

  const [selectHairCut, setHairCut] = useState(false);
  const [selectHairRebond, setHairRebond] = useState(false);
  const [selectBrazilianRebond, setBrazilianRebond] = useState(false);
  const [selectHairColor, setHairColor] = useState(false);
  const [selectManicure, setManicure] = useState(false);
  const [selectEyelashes, setEyelashes] = useState(false);

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
                name="alert-octagram"
                style={{ alignSelf: "center", marginBottom: 5 }}
                size={50}
              />
              <Text style={styles.modalLabelTitle}>
                You cannot choose these services!
              </Text>
              <View style={styles.forBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.btnModalText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const checkService = () => {
    if (
      selectHairCut == true &&
      selectHairRebond == true &&
      selectBrazilianRebond == true &&
      selectHairColor == true
    ) {
      setModalVisible(true);
    }else if (selectBrazilianRebond == true && selectHairColor == true) {
      setModalVisible(true)
    } else if (selectHairRebond == true && selectBrazilianRebond == true) {
      setModalVisible(true);
    } else if (selectHairRebond == true && selectHairColor == true) {
      setModalVisible(true);
    } else if (selectHairColor == true && selectHairCut == true) {
      reservationInfo.service = "Hair Color & Haircut";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectHairRebond == true && selectHairCut == true) {
      reservationInfo.service = "Hair Rebond & Haircut";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectBrazilianRebond == true && selectHairCut == true) {
      reservationInfo.service = "Hair Rebond & Haircut";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectHairCut == true && selectManicure == true) {
      reservationInfo.service = "Haircut & Manicure";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectHairCut == true && selectEyelashes == true) {
      reservationInfo.service = "Haircut & Eyelashes";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectHairRebond == true && selectHairCut == true) {
      reservationInfo.service = "Hair Rebond & Haircut";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectHairColor == true && selectManicure == true) {
      reservationInfo.service = "Hair Color & Manicure";
      navigation.navigate("Confirmation", { reservationInfo });
    } else if (selectEyelashes == true && selectManicure == true) {
      reservationInfo.service = "Eyelashes & Manicure";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (selectHairCut == true) {
      reservationInfo.service = "Haircut";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (selectHairRebond == true) {
      reservationInfo.service = "Hair Rebond";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (selectHairColor == true) {
      reservationInfo.service = "Hair Color";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (selectManicure == true) {
      reservationInfo.service = "Nail Manicure";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (selectEyelashes == true) {
      reservationInfo.service = "Eyelashes";
      navigation.navigate("Confirmation", { reservationInfo });
    }else if (
      selectHairCut == true &&
      selectManicure == true &&
      selectEyelashes == true
    ) {
      reservationInfo.service = "Haircut, Eyelashes & Manicure";
      navigation.navigate("Confirmation", { reservationInfo });
    } else {
      reservationInfo.service = "Other service";
      navigation.navigate("Confirmation", { reservationInfo });
    }
  };

  return (
    <View style={styles.main}>
      <ModalAsk />
      <ScrollView>
        <TouchableOpacity
          style={
            selectHairCut == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectHairCut == false ? setHairCut(true) : setHairCut(false);
          }}
        >
          <ImageBackground
            style={
              selectHairCut == false
                ? styles.serviceBG
                : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/bg_hair.jpg")}
          >
            <Text style={styles.serviceLabel}>Haircut : ₱ 100 - 200</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            selectHairRebond == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectHairRebond == false
              ? setHairRebond(true)
              : setHairRebond(false);
          }}
        >
          <ImageBackground
            style={
              selectHairRebond == false
                ? styles.serviceBG
                : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/gal2.jpg")}
          >
            <Text style={styles.serviceLabel}>Hair Rebond: ₱ 1000 - 1800</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            selectBrazilianRebond == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectBrazilianRebond == false
              ? setBrazilianRebond(true)
              : setBrazilianRebond(false);
          }}
        >
          <ImageBackground
            style={
              selectBrazilianRebond == false
                ? styles.serviceBG
                : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/rebond_brazil.jpg")}
          >
            <Text style={styles.serviceLabel}>
              Brazilian Rebond: ₱ 1000 - 2500
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            selectHairColor == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectHairColor == false ? setHairColor(true) : setHairColor(false);
          }}
        >
          <ImageBackground
            style={
              selectHairColor == false
              ? styles.serviceBG
              : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/hair_color.jpg")}
          >
            <Text style={styles.serviceLabel}>Hair Color: ₱ 300 - 700</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            selectManicure == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectManicure == false ? setManicure(true) : setManicure(false);
          }}
        >
          <ImageBackground
            style={
              selectManicure == false
              ? styles.serviceBG
              : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/bg_manicure.jpg")}
          >
            <Text style={styles.serviceLabel}>Manicure: ₱ 75 - 130</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            selectEyelashes == false
              ? styles.serviceContainer
              : styles.serviceContainerChosen
          }
          onPress={() => {
            selectEyelashes == false ? setEyelashes(true) : setEyelashes(false);
          }}
        >
          <ImageBackground
            style={
              selectEyelashes == false
              ? styles.serviceBG
              : styles.serviceBGSelected
            }
            imageStyle={{ borderRadius: 10 }}
            source={require("../picture/bg_eyelash.jpg")}
          >
            <Text style={styles.serviceLabel}>Keratin Lashlift: ₱ 300</Text>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={styles.proceedBtn}
        onPress={() => checkService()}
      >
        <Text style={styles.btnLabel}>Confirm Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  proceedBtn: {
    marginTop: "auto",
    width: Dimensions.get("window").width,
    backgroundColor: "#FD62A1",
    height: 40,
  },

  btnLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    marginTop: 5,
  },

  serviceLabel: {
    marginTop: "auto",
    fontFamily: "Poppins_500Medium",
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },

  serviceContainerChosen: {
    width: Dimensions.get("window").width - 20,
    height: 120,
    borderWidth: 5,
    borderColor: "#FD62A1",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 10,
  },

  serviceContainer: {
    width: Dimensions.get("window").width - 20,
    height: 120,
    borderWidth: 5,
    borderColor: "pink",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 10,
  },

  serviceBG: {
    width: Dimensions.get("window").width - 30,
    height: 110,
    opacity: 0.5,
  },

  serviceBGSelected: {
    width: Dimensions.get("window").width - 30,
    height: 110,
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
    backgroundColor: "pink",
    borderRadius: 10,
    elevation: 5,
    height: 200,
    padding: 22,
    borderWidth: 2,
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
    fontSize:
      Dimensions.get("window").width > 400
        ? 14
        : Dimensions.get("window").width < 400
        ? 13
        : 12,
    fontFamily: "Poppins_600SemiBold",
  },

  btnModal: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 10,
    width: 300,
    elevation: 5,
  },

  btnModalText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});

export default ChooseService;
