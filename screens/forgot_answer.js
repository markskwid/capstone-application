import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo";
import { initializeApp, getApp } from "firebase/app";
import * as firebase from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  get,
  query,
  onValue,
  orderByChild,
  storageBucket,
  onChildChanged,
  onChildRemove,
  equalTo,
  update,
} from "firebase/database";
import { validateContextObject } from "@firebase/util";
import { getStorage } from "firebase/storage";
import { database } from "@react-native-firebase/database";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TabRouter } from "react-navigation";
import {NavigationActions} from 'react-navigation';
const db = getDatabase();

const Answer = ({ navigation, route }) => {
  const { id } = route.params;
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(false);
  const [warn, setWarn] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errPass, setErrPass] = useState(false);
  const [successful, setSuccess] = useState(false);

  useEffect(() => {
    searchQuestion();
    return() => {
     
    }
  }, []);

  const searchQuestion = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `customer/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setQuestion(snapshot.val().customer_question);
          setCorrectAnswer(snapshot.val().customer_answer);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const checkAnswer = (userAnswer) => {
    if (userAnswer === correctAnswer) {
      console.log("korek");
      setCorrect(true);
      setWarn(false);
      setTimeout(() =>  navigation.replace('Forgot Password2', {key: id}), 1000)
    } else {
      console.log("nye");
      setCorrect(false);
      setWarn(true);
    }
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.div2}>
          <Text style={styles.titleHead}>
            SECURITY QUESTION
          </Text>
          <View style={styles.questionDiv}>
              <Text style={styles.questionLabelTitle}>YOUR QUESTION</Text>
              <Text style={styles.questionLabel}>{question}</Text>
            </View>

          <View style={styles.inputCon}>
              <MaterialCommunityIcons
                name="lock-question"
                style={styles.iconMaterial}
                size={30}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your answer"
                value={answer}
                onChangeText={(value) => setAnswer(value)}
              />
            </View>

      

          {warn == true ? (
            <View style={styles.warningDiv}>
              <View style={styles.bg}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  color={"white"}
                  size={32}
                />
              </View>
              <Text style={styles.warningLabel}>Your answer is wrong</Text>
            </View>
          ) : errPass == true ? (
            <View style={styles.warningDiv}>
              <View style={styles.bg}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  color={"white"}
                  size={32}
                />
              </View>
              <Text style={styles.warningLabel}>Password didn't match!</Text>
            </View>
          ) : correct == true ? (
            <View style={styles.okDiv}>
            <View style={styles.Okbg}>
              <MaterialCommunityIcons name="check" color={"white"} size={32} />
            </View>
            <Text style={styles.warningLabel}>
              Proceeding....
            </Text>
          </View>
          ): null}

         

          <TouchableOpacity
            style={styles.forconfirmBtn}
            onPress={() => {
              checkAnswer(answer)
            }}
          >
            <Text style={styles.title}>
              SUBMIT ANSWER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  titleHead: {
    fontSize: 25,
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

  input: {
    paddingTop: 22,
    paddingLeft: 14,
    width: Dimensions.get("window").width - 100,
    height: 60,
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
  },

  inputCon: {
    width: Dimensions.get("window").width - 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    marginTop: 7,
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

  logo: {
    width: 250,
    height: 250,
  },

  warningLabel: {
    fontSize: 17,
    marginTop: 4,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginLeft: 50,
  },

  questionLabel: {
    fontSize: 15,
    marginTop: 4,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },

  questionLabelTitle: {
    fontSize: 20,
    color: "white",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },

  forEmail: {
    padding: 4,
    borderBottomWidth: 1,
    width: Dimensions.get("window").width - 100,
    marginTop: 10,
    height: 60,
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
  },

  forPassword: {
    padding: 4,
    borderBottomWidth: 1,
    width: Dimensions.get("window").width - 100,
    marginTop: 20,
    marginBottom: 10,
    height: 60,
    fontSize: 17,
    fontFamily: "Poppins_400Regular",
  },

  forconfirmBtn: {
    backgroundColor: "#FD62A1",
    height: 45,
    marginTop: 15,
    padding: 10,
    width: Dimensions.get("window").width - 70,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    elevation: 5,
  },

  warningDiv: {
    width: Dimensions.get("window").width - 70,
    backgroundColor: "#ff5656",
    height: 50,
    padding: 10,
    flexDirection: "row",
    elevation: 5,
    marginTop: 5,
  },

  okDiv: {
    width: Dimensions.get("window").width - 70,
    backgroundColor: "green",
    height: 50,
    padding: 10,
    flexDirection: "row",
    elevation: 5,
    marginTop: 5,
  },

  questionDiv: {
    width: Dimensions.get("window").width - 70,
    backgroundColor: "green",
    height: "auto",
    padding: 10,
    elevation: 5,
    marginTop: 5,
    borderWidth: 2,
    borderColor: "gray",
  },

  bgQuestion: {
    top: 0,
    bottom: 0,
    backgroundColor: "green",
    position: "absolute",
    padding: 10,
  },
  
  Okbg: {
    top: 0,
    bottom: 0,
    backgroundColor: "green",
    position: "absolute",
    padding: 10,
  },

  bg: {
    top: 0,
    bottom: 0,
    backgroundColor: "red",
    position: "absolute",
    padding: 10,
  },

  confirmBtn: {
    height: 200,
  },

  div2: {
    width: Dimensions.get("window").width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    flex: 3,
  },
});

export default Answer;
