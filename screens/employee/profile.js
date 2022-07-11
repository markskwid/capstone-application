import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  Button,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
} from "react-native";
import React, { Component } from "react";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getStorage,
  ref,
  put,
  putFile,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
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
  onChildRemoved,
  limitToFirst,
  push,
} from "firebase/database";
import { PieChart, BarChart, XAxis } from "react-native-svg-charts";
import { Text as Text_svg } from "react-native-svg";
import * as scale from "d3-scale";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const db = getDatabase();

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const [monthly, setMonthly] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [profile, setProfile] = useState("a");
  const [wtf, setWtf] = useState([]);
  const [errProfile, setErrProfile] = useState(false);
  // Create a reference to the file we want to download
  const storage = getStorage();
  const starsRef = ref(storage, "profile/" + global.employeeProfile);
  const arr = [];
  const [history, setHistory] = useState({
    arr,
  });
  // Get the download URL
  getDownloadURL(starsRef)
    .then((url) => {
      //console.log(url)
      setProfile(url);
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

  var arrSuccess = [];
  const [appointment, setAppointment] = useState(0);
  const [canceledApp, setCanceledApp] = useState(0);
  const [successApp, setSuccessApp] = useState(0);

  function realTimeUpdateForAppointment() {
    const commentsRef = ref_database(db, "reservation/");
    const canceledRef = ref_database(db, "canceled_appointment/");
    const successRef = ref_database(db, "success_appointment/");
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
    var monthName = months[d.getMonth()]; // "July" (or current month)
    var ctr = 0;
    var ctrCancel = 0;
    var ctrSuccess = 0;
    var monthlyCtr = 0;
    onChildAdded(commentsRef, (data) => {
      if (data.val().month == monthName && data.val().year == d.getFullYear()) {
        ctr++;
        setAppointment(ctr);
      }

      // customer
    });

    onChildAdded(canceledRef, (data) => {
      if (data.val().month == monthName && data.val().year == d.getFullYear()) {
        ctrCancel++;
        setCanceledApp(ctrCancel);
      }
    });

    onChildAdded(successRef, (data) => {
      if (data.val().month == monthName && data.val().year == d.getFullYear()) {
        ctrSuccess++;
        setSuccessApp(ctrSuccess);
      }
    });

    onChildRemoved(commentsRef, (data) => {
      if (data.val().month == monthName && data.val().year == d.getFullYear()) {
      }
    });
  }

  function getLimitHistory() {
    const dbRef = ref_database(getDatabase());
    get(child(dbRef, `success_appointment/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            if (child.val().reserveBy_id === global.employee_id) {
              arr.push({
                id: child.key,
                ...child.val(),
              });
              setWtf([...arr]);
            } else {
              console.log("wala");
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

  const [currentMonth, setMonth] = useState("");
  const [currentYear, setYear] = useState("");
  const displayMonth = () => {
    var months = [
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
    ];
    var d = new Date();
    var monthName = months[d.getMonth()]; // "July" (or current month)
    setMonth(monthName);
    setYear(d.getFullYear());
  };

  const History = () => {
    if (history.arr.length == 0) {
      return (
        <View style={profile_style.appointmentEmpty}>
          <MaterialCommunityIcons
            name="calendar-clock"
            style={{ alignSelf: "center" }}
            color={"gray"}
            size={200}
          />
          <Text style={profile_style.appointmentEmptyLabel}>
            You don't have any appointment yet
          </Text>
        </View>
      );
    } else {
      return history.arr.map((item) => (
        <View style={profile_style.reservationContainer} key={item.id}>
          <View style={profile_style.serviceType}>
            <Text style={profile_style.monthLabel}>
              {item.month} {"\n"}
              <Text style={profile_style.dateLabel}>{item.date}</Text>
            </Text>
          </View>

          <View style={profile_style.reservationInfo}>
            <Text style={profile_style.infoLabel}>
              {"Date: " +
                item.day +
                ", " +
                item.month +
                " " +
                item.date +
                ", " +
                item.year}
            </Text>
            <Text style={profile_style.infoLabel}>{"Time: " + item.time}</Text>
          </View>

          <View style={profile_style.service}>
            <Text style={profile_style.serviceLabel}>{item.type}</Text>
          </View>
        </View>
      ));
    }
  };
  const totalApp = successApp + canceledApp;
  const colors = ["#600080", "#9900cc", "#c61aff", "#d966ff", "#ecb3ff"];
  const data = [
    {
      key: 2,
      amount: (successApp / totalApp) * 100,
      svg: { fill: "#48acf7", stroke: "black" },
    },
    {
      key: 3,
      amount: (canceledApp / totalApp) * 100,
      svg: { fill: "#f5594d", stroke: "black" },
    },
  ];

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <Text_svg
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={14}
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          {data.amount.toFixed(2) + "%"}
        </Text_svg>
      );
    });
  };

  const Chart = () => {
    return (
      <View style={{ padding: 10 }}>
        <PieChart
          style={{ height: 220, elevation: 5 }}
          valueAccessor={({ item }) => item.amount}
          data={data}
          spacing={0}
          padAngle={0}
          innerRadius={0}
          outerRadius={"90%"}
        >
          <Labels />
        </PieChart>
        <View
          style={{
            flexDirection: "row",
            width: 200,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#ff5656",
              borderRadius: 50,
              alignSelf: "center",
              marginRight: 5,
            }}
          />
          <Text style={profile_style.InfoValue}>Canceled</Text>

          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#48acf7",
              borderRadius: 50,
              alignSelf: "center",
              marginRight: 5,
            }}
          />
          <Text style={profile_style.InfoValue}>Successed</Text>
        </View>
      </View>
    );
  };

  const BarGraph = () => {
    const data = [1, 80, 100, 55, 88, 22, 11, 99, 77, 20, 50, 15];
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

    return (
      <View style={{ height: 200, padding: 20 }}>
        <BarChart
          style={{ flex: 1 }}
          data={monthly}
          gridMin={0}
          svg={{ fill: "#FD62A1" }}
        />
        <XAxis
          data={monthly}
          scale={scale.scaleBand}
          formatLabel={(value, index) => index}
          labelStyle={{ color: "#FD62A1", fontFamily: "Poppins_700Bold" }}
        />
        <View style={{ flexDirection: "row" }}>
          {months.map((item) => (
            <Text style={{ marginRight: 6.8 }}>{item}</Text>
          ))}
        </View>
      </View>
    );
  };

  const Report = () => {
    return (
      <View style={profile_style.report}>
        <View style={profile_style.containerDate}>
          <Text style={profile_style.month}>{currentMonth.toUpperCase()}</Text>
          <Text style={profile_style.year}>{currentYear}</Text>
        </View>
        <Chart />
      </View>
    );
  };

  useEffect(() => {
    if (global.userType == "customer") {
      getLimitHistory();
    } else {
      realTimeUpdateForAppointment();
    }
    displayMonth();
  }, []);
  return (
    <SafeAreaView
      style={profile_style.mainContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={profile_style.personalInfo}>
        <View style={profile_style.profilePicture}>
          {errProfile === true ? (
            <MaterialCommunityIcons
              name="account"
              style={{ alignSelf: "center" }}
              color={"#FD62A1"}
              size={100}
            />
          ) : (
            <Image
              style={profile_style.profilePicture}
              source={{ uri: profile }}
            />
          )}
          {/* <Image style={profile_style.profilePicture} source={{uri: profile}}/> */}
        </View>
        <View style={profile_style.Info}>
          <Text>
            <Text style={profile_style.InfoTitle}>Name: </Text>
            <Text style={profile_style.InfoValue}>{global.employeeName}</Text>
          </Text>
          <Text>
            <Text style={profile_style.InfoTitle}>Email: </Text>{" "}
            <Text style={profile_style.InfoValue} numberOfLines={1}>
              {global.employeeEmail}
            </Text>
          </Text>
          <Text>
            <Text style={profile_style.InfoTitle}>Contact: </Text>
            <Text style={profile_style.InfoValue}>
              {global.employeeContact}
            </Text>
          </Text>
          <Text>
            <Text style={profile_style.InfoTitle}>
              {global.userType == "customer" ? "Address: " : "Schedule: "}
            </Text>
            {global.userType == "customer" ? (
              <Text style={profile_style.InfoValue} numberOfLines={1}>
               {global.employeeAddress}
              </Text>
            ) : (
              <Text style={profile_style.InfoValue}>
                {global.employeeSchedule}
              </Text>
            )}
          </Text>
        </View>
      </View>

      <View style={profile_style.forReportLabel}>
        <Text style={profile_style.reportLabel}>
          {global.userType == "customer" ? "HISTORY: " : "REPORT: "}
        </Text>
        <View style={profile_style.line} />
      </View>
      {global.userType == "customer" ? <History /> : <Report />}
    </SafeAreaView>
  );
};

const profile_style = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    width: Dimensions.get("window").width,
    height: "auto",
    alignContent: "center",
    padding: 10,
  },

  containerDate: {
    backgroundColor: "#FD62A1",
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
  },

  personalInfo: {
    padding: 10,
    flexDirection: "row",
    width: Dimensions.get("window").width,
  },

  profilePicture: {
    height: 110,
    width: 110,
    backgroundColor: "pink",
    borderRadius: 100,
  },

  Info: {
    padding: 12,
  },

  InfoTitle: {
    fontSize:
      Dimensions.get("window").width > 400
        ? 13
        : Dimensions.get("window").width < 400
        ? 12
        : 10,
    marginTop: 4,
    fontFamily: "Poppins_600SemiBold",
  },

  InfoValue: {
    fontSize:
      Dimensions.get("window").width > 400
        ? 12
        : Dimensions.get("window").width < 400
        ? 11
        : 10,
    marginRight: 10,
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
  },

  forReportLabel: {
    width: Dimensions.get("window").width - 7,
    height: "auto",
    flexDirection: "row",
    padding: 5,
    flexWrap: "wrap",
  },

  editBtn: {
    height: 40,
    margin: 10,
    width: 100,
    backgroundColor: "pink",
    padding: 5,
    elevation: 5,
    borderRadius: 10,
  },

  reportLabel: {
    fontSize: 25,
    fontFamily: "Poppins_600SemiBold",
  },

  line: {
    borderBottomWidth: 1,
    width: Dimensions.get("window").width - 175,
    height: 22,
    marginLeft: "auto",
  },

  report: {
    width: Dimensions.get("window").width - 30,
    alignSelf: "center",
    backgroundColor: "pink",
    elevation: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FD62A1",
    height: "auto",
  },

  month: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 2,
  },

  year: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 2,
  },

  label: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    alignSelf: "center",
    marginLeft: 10,
    marginTop: 10,
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
    fontSize:
      Dimensions.get("window").width > 400
        ? 14
        : Dimensions.get("window").width < 400
        ? 13
        : 10,
    marginTop: 6,
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
    fontSize: 45,
  },

  serviceLabel: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
});

export default Profile;
