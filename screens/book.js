import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  StatusBar,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import CalendarPicker from "react-native-calendar-picker";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getDatabase,
  ref,
  get,
  onValue,
  orderByChild,
  query,
} from "firebase/database";
import { CommonActions } from "@react-navigation/native";
import moment from "moment";

const db = getDatabase();
const dbRef = ref(getDatabase());
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Books = ({ navigation }) => {
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFill, setModalFill] = useState(false);
  const [service, selectService] = useState("");
  const [number, setNumber] = useState(false);
  const [available, setAvailable] = useState(false);
  const [numberOfReserve, setNumberOfReserve] = useState("Available");
  const [time, selectTime] = useState(null);

  const [hairSelected, setHair] = useState(false);
  const [eyeSelected, setEye] = useState(false);
  const [nailSelected, setNail] = useState(false);

  const [choose, setChoose] = useState(false);

  const [hairType, setHairType] = useState("");
  const [eyeType, setEyeType] = useState("");
  const [nailType, setNailType] = useState("");

  const [endDay, setEndDay] = useState(false);
  const [resetColor, setColor] = useState(false);

  var totalArr = [];
  const [total, setTotal] = useState({ totalArr });
  const [avail, setAvail] = useState("");

  const [dateFomat, setDate] = useState('');

  var timeArr = [];
  const [timeSlot, setTimeSlot] = useState({ timeArr });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  function setEmpty() {
    setSelectedStartDate("");
    selectTime(null);
    setHair("");
    setEye("");
    setNail("");
  }

  if (selectedStartDate != "") {
    get(query(ref(db, "reservation/"), orderByChild("date"))).then((child) => {
      if (child.val().date === selectedStartDate.toString().split(" ")[2]) {
        console.log("meron");
      }
    });
  }

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{ name: "Confirmation" }],
  });
  useEffect(() => {
    //getAppointment()
    selectTime(time);
    setAvailable(true);

    const unsubscribe = navigation.addListener("focus", () => {
      setSelectedStartDate("");
    });
    return unsubscribe;
  }, [time, service, navigation]);

  function getAvailable() {
    var ctr = 0;
    var str = selectedStartDate.toString().split(" ")[2];
    get(query(ref(db, "reservation/"), orderByChild("date"))).then((child) => {
      if (child.val().date === selectedStartDate.toString().split(" ")[2]) {
        console.log("meron");
      }
    });
  }

  function getAppointment() {
    var data = [];
    var ctr = 0;
    if (selectedStartDate != null) {
      setAvailable(true);

      const starCountRef = ref(db, "reservation/");
      onValue(starCountRef, (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().date === selectedStartDate.toString().split(" ")[2]) {
            data.push(child.val().time);
            ctr++;
            setNumberOfReserve(ctr);

            if (data.includes(time)) {
              setNumber(true);
            } else {
              setNumber(false);
            }
          } else {
            console.log("waley");
            setNumberOfReserve(ctr);
          }
        });
      });
    }
  }

  const [state, setState] = useState({
    categes: [
      {
        id: "9:00 AM - 10:00 AM",
        btn_time: "9:00 AM - 10:00 AM",
        backgroundcolor: "pink",
      },
      {
        id: "10:00 AM - 11:00 AM",
        btn_time: "10:00 AM - 11:00 AM",
        backgroundcolor: "pink",
      },
      {
        id: "11:00 AM - 12:00 PM",
        btn_time: "11:00 AM - 12:00 PM",
        backgroundcolor: "pink",
      },
      {
        id: "12:00 PM - 1:00 PM",
        btn_time: "12:00 PM - 1:00 PM",
        backgroundcolor: "pink",
      },
      {
        id: "1:00 PM - 2:00 PM",
        btn_time: "1:00 PM - 2:00 PM",
        backgroundcolor: "pink",
      },
      {
        id: "2:00 PM - 3:00 PM",
        btn_time: "2:00 PM - 3:00 PM",
        backgroundcolor: "pink",
      },
      {
        id: "3:00 PM - 4:00 PM",
        btn_time: "3:00 PM - 4:00 PM",
        backgroundcolor: "pink",
      },
      {
        id: "4:00 PM - 5:00 PM",
        btn_time: "4:00 PM - 5:00 PM",
        backgroundcolor: "pink",
      },
    ],
  });

  function getMonth(monthStr) {
    return pad(new Date(monthStr + "-1-01").getMonth() + 1)
  }

  function pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  formatDate()
  const reservationInfo = {
    type: hairType + " " + eyeType + " " + nailType,
    month: selectedStartDate.toString().split(" ")[1],
    date: selectedStartDate.toString().split(" ")[2],
    year: selectedStartDate.toString().split(" ")[3],
    day: selectedStartDate.toString().split(" ")[0],
    time: time,
    reserveBy_id: global.employee_id,
    reserveBy_name: global.employeeName,
    reserveBy_email: global.employeeEmail,
    reserveBy_contact: global.employeeContact,
    message: "",
    image: "null",
    fulldate: dateFomat,
    service: ''
  };

  const convertDate = () => {
    var dateString =  selectedStartDate.toString().split(" ")[3] + "-" + getMonth(selectedStartDate.toString().split(" ")[1]) + "-" + selectedStartDate.toString().split(" ")[2]
    var dateObj = new Date(dateString);
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');
    setDate(momentString)
  }

  const changeBackground = (item) => {
    let categes = JSON.parse(JSON.stringify(state.categes));

    for (let x = 0; x < state.categes.length; x++) {
      if (state.categes[x].id == item.id) {
        categes[x].backgroundcolor = "#FD62A1";

        setState({
          categes: categes,
        });
      } else if (item === "0") {
        categes[x].backgroundcolor = "pink";
        setNumber(false);
        selectTime(null);
        setState({
          categes: categes,
        });
      } else if (item === "01") {
        categes[x].backgroundcolor = "#FD62A1";
        setState({
          categes: categes,
        });
      } else {
        categes[x].backgroundcolor = "pink";

        setState({
          categes: categes,
        });
      }
    }
  };

  const ModalFill = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFill}
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
                {endDay == true
                  ? "The time you choose is over, please select another"
                  : "Please choose the date and time of your reservation."}
              </Text>
              <View style={styles.forBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => setModalFill(!modalFill)}
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
                {choose == true
                  ? "Please select the type of service you want."
                  : "The time is already taken by the other customer, please select another."}
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

  const [availableDate, setAvailDay] = useState(true);

  function searchAvail(date, month, year) {
    const dbRef = ref(db, "reservation");
    var ctr = 0;
    onValue(
      dbRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().month === month &&
            childSnapshot.val().date === date &&
            childSnapshot.val().year === year
          ) {
            console.log("maoy", time);
            ctr++;
            timeArr.push(childSnapshot.val().time);
          }

          if (ctr == 8) {
            setNumberOfReserve("Not Available");
            setAvailDay(false);
          } else if (ctr <= 7) {
            setNumberOfReserve("Available");
            setAvailDay(true);
          }
        });
      },
      {
        onlyOnce: true,
      }
    );
  }

  function formatAMPM() {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + " " + ampm;
    return strTime;
  }

  const ifTime = (time) => {
    const dbRef = ref(db, "reservation");
    var data = [];
    onValue(
      dbRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().month ===
              selectedStartDate.toString().split(" ")[1] &&
            childSnapshot.val().date ===
              selectedStartDate.toString().split(" ")[2] &&
            childSnapshot.val().year ===
              selectedStartDate.toString().split(" ")[3]
          ) {
            data.push(childSnapshot.val().time);

            if (data.includes(time)) {
              console.log("meron");
              setNumber(true);
            } else {
              console.log("umay");
              setNumber(false);
            }
          }
        });
      },
      {
        onlyOnce: true,
      }
    );
  };

  const isValidDate = function(date) {
    console.log(new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
  }
 
  const onDateChange = (date, type) => {
    //function to handle the date change
    setSelectedStartDate(date);
    console.log(date.toString().split(" ")[1]);
    var splitDate = date.toString().split(" ")[2];
    var splitMonth = date.toString().split(" ")[1];
    var splitYear = date.toString().split(" ")[3].trim();
    searchAvail(splitDate, splitMonth.toString().trim(), splitYear);

    var dateString =  date.toString().split(" ")[3] + "-" + getMonth(date.toString().split(" ")[1]) + "-" + date.toString().split(" ")[2]
    var dateObj = new Date(dateString);
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('yyy-MM-DD');
    setDate(momentString)
    isValidDate(momentString)
    changeBackground("0");
  };

  const validateReservation = () => {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date();
    // var dateString =  selectedStartDate.toString().split(" ")[3] + "-" + getMonth(selectedStartDate.toString().split(" ")[1]) + "-" + selectedStartDate.toString().split(" ")[2]
    // var dateObj = new Date(dateString);
    // var momentObj = moment(dateObj);
    // var momentString = momentObj.format('YYYY-MM-DD');

    var monthName = months[d.getMonth()];
    const dateNow = monthName + " " + d.getDate() + " " + d.getFullYear();
    const dateSelected =
      selectedStartDate.toString().split(" ")[1] +
      " " +
      parseInt(selectedStartDate.toString().split(" ")[2]) +
      " " +
      selectedStartDate.toString().split(" ")[3];
    console.log(dateSelected, dateNow);
    // console.log(getMonth(selectedStartDate.toString().split(" ")[1]))
    if (available === false || number === true) {
      setModalVisible(true);
    } else if (
      selectedStartDate === undefined ||
      selectedStartDate === "" ||
      time === null
    ) {
      setModalFill(true);
    } else {
      if (
        hairSelected == false &&
        nailSelected == false &&
        eyeSelected == false
      ) {
        setModalVisible(true);
        setChoose(true);
      } else {
        setChoose(false);
        //navigation.navigate('Confirmation', {reservationInfo})
        const splitTime = time.split("-");
        const mer = splitTime[0].split(" ")[1];
        const hour = splitTime[0].split(":")[0];
        const timeNow = formatAMPM();
        console.log(timeNow, hour, mer);
        if (dateNow == dateSelected) {
          if (
            (hour < timeNow.split(" ")[0] && timeNow.split(" ")[1] == "AM") ||
            (timeNow.split(" ")[0] > hour && timeNow.split(" ")[1] == "PM") ||
            mer != timeNow.split(" ")[1] ||
            (timeNow.split(" ")[0] < 8 && timeNow.split(" ")[1] == "AM") ||
            (timeNow.split(" ")[0] > 6 && timeNow.split(" ")[1] == "PM")
          ) {
            setModalFill(true);
            setEndDay(true);
          } else {
            setEndDay(false);
            navigation.navigate("Choose Service", { reservationInfo });
            //navigation.dispatch(resetAction, {reservationInfo});
          }
        } else {
          navigation.navigate("Choose Service", { reservationInfo });
          //navigation.dispatch(resetAction);
        }
      }
    }
  };

  const minDate = new Date();
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ModalAsk />
      <ModalFill />
      <SafeAreaView style={styles.container}>
        <View style={styles.calendarContainer}>
          <CalendarPicker
            selectedDayColor="#FD62A1"
            todayBackgroundColor="pink"
            minDate={minDate}
            restrictMonthNavigation={true}
            textStyle={{
              fontFamily: "Poppins_600SemiBold",
              color: "#000000",
            }}
            onDateChange={onDateChange}
            months={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]}
          />
          <View>
            {availableDate == true ? (
              <View style={styles.availableContainer}>
                <MaterialCommunityIcons
                  name="check-circle"
                  color={"green"}
                  size={19}
                />
                <Text style={styles.availableLabel}>{numberOfReserve}</Text>
              </View>
            ) : (
              <View style={styles.availableContainer}>
                <MaterialCommunityIcons
                  name="close-circle"
                  color={"red"}
                  size={19}
                />
                <Text style={styles.availableLabel}>{numberOfReserve}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.label}>Available Slots</Text>
        <View style={styles.timeContainer}>
          {state.categes.map((item, key) => (
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 20,
                width: Dimensions.get("window").width / 2.3,
                borderWidth: 2,
                marginRight: 10,
                elevation: 5,
                marginTop: 5,
                backgroundColor: item.backgroundcolor,
              }}
              key={item.id}
              onPress={() => changeBackground(item) || ifTime(item.btn_time)}
              onPressIn={() => selectTime(item.btn_time)}
            >
              <Text style={styles.timeLabel}>
                {" "}
                {item.btn_time.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {number == true ? (
          <View style={styles.availableContainer}>
            <MaterialCommunityIcons
              name="close-circle"
              color={"red"}
              size={19}
            />
            <Text style={styles.availableLabel}>Not Available</Text>
          </View>
        ) : availableDate == false ? (
          <View style={styles.availableContainer}>
            <MaterialCommunityIcons
              name="close-circle"
              color={"red"}
              size={19}
            />
            <Text style={styles.availableLabel}>Not Available</Text>
          </View>
        ) : (
          <View style={styles.availableContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              color={"green"}
              size={19}
            />
            <Text style={styles.availableLabel}>Available</Text>
          </View>
        )}

        <Text style={styles.label}>Available Service</Text>
        <View style={styles.serviceContainer}>
          <TouchableOpacity
            style={
              hairSelected == true
                ? styles.serviceButtonSelected
                : styles.serviceButton
            }
            onPress={() =>
              hairSelected == false ? setHair(true) : setHair(false)
            }
            onPressIn={() =>
              hairType === "" ? setHairType("Hair") : setHairType("")
            }
          >
            <Image
              style={styles.serviceLogo}
              source={require("../picture/icon1.png")}
            />
            <Text style={styles.timeLabel}>Hair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              eyeSelected == true
                ? styles.serviceButtonSelected
                : styles.serviceButton
            }
            onPress={() =>
              eyeSelected == false ? setEye(true) : setEye(false)
            }
            onPressIn={() =>
              eyeType === "" ? setEyeType("Eyelashes") : setEyeType("")
            }
          >
            <Image
              style={styles.serviceLogo}
              source={require("../picture/eye.png")}
            />
            <Text style={styles.timeLabel}>Eyelashes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              nailSelected == true
                ? styles.serviceButtonSelected
                : styles.serviceButton
            }
            onPress={() =>
              nailSelected == false ? setNail(true) : setNail(false)
            }
            onPressIn={() =>
              nailType === "" ? setNailType("Nail") : setNailType("")
            }
          >
            <Image
              style={styles.serviceLogo}
              source={require("../picture/manicure.png")}
            />
            <Text style={styles.timeLabel}>Nail</Text>
          </TouchableOpacity>
          {/* {services.service.map((itemService, key) => (
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 20,
              width: 120,
              borderWidth: 2,
              marginRight: 11,
              elevation: 5,
              marginTop: 10,
              backgroundColor: itemService.backgroundColor,
            }}
            key={itemService.id}
            onPress={() => changeBackgroundService(itemService) || selectService(itemService.service_name)}>
           {itemService.id == "1" ? (<Image style={styles.serviceLogo} source={require('../picture/icon1.png')}/>) : 
          itemService.id == "2" ? (<Image style={styles.serviceLogo} source={require('../picture/eye.png')}/>) : 
          (<Image style={styles.serviceLogo} source={require('../picture/manicure.png')}/>)}
            <Text style={styles.timeLabel}>{itemService.service_name}</Text>
          </TouchableOpacity>
        ))} */}
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() =>
              console.log(reservationInfo) || validateReservation()
            }
          >
            <Text style={styles.confirmLabel}>Confirm Reservation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },

  serviceLogo: {
    width: 70,
    height: 70,
    alignSelf: "center",
  },

  availableContainer: {
    marginLeft: 5,
    flexDirection: "row",
    width: 140,
    padding: 10,
  },

  availableLabel: {
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 10,
  },

  confirmBtn: {
    backgroundColor: "#FD62A1",
    padding: 10,
  },

  timeButton: {
    padding: 10,
    borderRadius: 20,
    width: 180,
    borderWidth: 2,
    marginRight: 16,
    elevation: 5,
    marginLeft: 5,
    marginTop: 5,
  },

  timeButtonSelected: {
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 20,
    width: 180,
    borderWidth: 2,
    marginRight: 16,
    elevation: 5,
    marginLeft: 5,
    marginTop: 5,
  },

  serviceButton: {
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 20,
    width: Dimensions.get("window").width / 3.4,
    borderWidth: 2,
    marginRight: 11,
    elevation: 5,
    marginTop: 10,
  },

  serviceButtonSelected: {
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 20,
    width: Dimensions.get("window").width / 3.4,
    borderWidth: 2,
    marginRight: 11,
    elevation: 5,
    marginTop: 10,
  },

  confirmLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },

  timeLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    textAlign: "center",
  },

  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginLeft: 10,
  },

  selectedDate: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },

  timeContainer: {
    padding: 10,
    paddingLeft: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  serviceContainer: {
    padding: 10,
    flexDirection: "row",
    marginBottom: 20,
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

export default Books;
