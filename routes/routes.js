import React from "react";
import Login from "../screens/login.js";
import SignUp from "../screens/signup.js";
import Stylist from "../screens/stylist.js";
import Gallery from "../screens/gallery.js";
import Booking from "../screens/book.js";
import QR from "../screens/qrCode.js";
import HistoryList from "../screens/history.js";
import ChooseService from "../screens/chooseService.js";
import Forgot from "../screens/forgot_pass.js";
import Inventory from "../screens/inventory.js";
import ForgotPassword from "../screens/changePass.js";
import Question from "../screens/forgot_answer.js";
import Confirmation from "../screens/confirmation";
import Appointment from "../screens/appointment";
import Dashboard from "../screens/dashboard.js";
import Services from "../screens/services.js";
import Scanned from "../screens/qrScanned";
import EditProfile from "../screens/edit_profile.js";
import QRScanner from "../screens/employee/qrScanner.js";
import CustomerHome from "../screens/customer/customer_home.js";
import { useState } from "react";
import Home_Employee from "../screens/employee/home.js";
import {
  NavigationContainer,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
const RoutePages = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="SignUp"
          options={{ headerShown: false }}
          component={SignUp}
        />

        <Stack.Screen
          name="Forgot Password2"
          options={{ headerShown: false }}
          component={ForgotPassword}
        />
        <Stack.Screen
          name="Forgot Password"
          options={{ headerShown: false }}
          component={Forgot}
        />
        <Stack.Screen
          name="Question"
          options={{ headerShown: false }}
          component={Question}
        />
        <Stack.Screen
          name="Home_Employee"
          options={{ headerShown: false }}
          component={Home_Employee}
        />

        <Stack.Screen
          name="History"
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
          component={HistoryList}
        />

        <Stack.Screen
          name="QR Scanner"
          component={QRScanner}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Salon Stylist"
          component={Stylist}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Salon Inventory"
          component={Inventory}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Salon Gallery"
          component={Gallery}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Edit Profile"
          component={EditProfile}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Book Now"
          component={Booking}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Choose Service"
          component={ChooseService}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Notifications"
          component={Dashboard}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Services"
          component={Services}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Appointment"
          component={Appointment}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Confirmation"
          component={Confirmation}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Your QR Code"
          component={QR}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />

        <Stack.Screen
          name="Reservation Info"
          component={Scanned}
          options={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#FD62A1",
            },
            headerTitleStyle: {
              fontFamily: "Poppins_600SemiBold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RoutePages;
