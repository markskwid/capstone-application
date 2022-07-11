import React, { Component, useEffect } from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Button,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Platform,
  Touchable,
  Modal,
  ToastAndroid,
  Image
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getDatabase,
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  refFromURL,
  update,
} from "firebase/database";

const db = getDatabase();

const Inventory = () => {
  var arr = [];
  const [products, setProducts] = useState({ arr });
  const [wtf, setWtf] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [image, setImage] = useState("");
  const [nameOfProd, setName] = useState("");
  const [qty, setQty] = useState(0);
  const [key, setKey] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Product has been updated!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const ModalShow = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        blurRadius={50}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                {nameOfProd}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={styles.btnQty}
                onPress={() => setQty(qty - 1)}
              >
                <MaterialCommunityIcons
                  name="minus"
                  style={{ alignSelf: "center" }}
                  color={"black"}
                  size={50}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  textAlign: "center",
                  fontSize: 45,
                  marginLeft: 40,
                  marginRight: 40,
                }}
              >
                {qty}
              </Text>

              <TouchableOpacity
                style={styles.btnQty}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="plus"
                  style={{ alignSelf: "center" }}
                  color={"black"}
                  size={50}
                  onPress={() => setQty(qty + 1)}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => updateProd()}
              >
                <Text style={styles.btnModalText}>CONFIRM CHANGES</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnModalDismiss}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnModalText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const updateProd = () => {
    const dbRef = ref(db, `inventory/${key}`);
    update(dbRef, {
      product_quantity: qty,
    })
      .then(() => {
        console.log("Updated product");
        setModalVisible(false);
        showToastWithGravityAndOffset();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getInfo = (prod_key) => {
    const starCountRef = ref(db, "inventory/" + prod_key);
    onValue(starCountRef, (snapshot) => {
      setQty(snapshot.val().product_quantity);
      setName(snapshot.val().product_name);
    });
  };

  const getItems = () => {
    const commentsRef = ref(db, "inventory/");
    onChildAdded(commentsRef, (data) => {
      arr.push({
        id: data.key,
        ...data.val(),
      });
      setWtf([...arr]);
      console.log(data.val());
    });
  };

  const { width } = Dimensions.get('window');

  const DisplayItems = () => {
    return products.arr.map((prod) => (
      <TouchableOpacity
        style={styles.productContainer}
        key={prod.id}
        onPress={() =>
          getInfo(prod.id) || setModalVisible(true) || setKey(prod.id)
        }
      >
        <View style={styles.productContainerHeader}>
          <Text style={styles.productLabel}>{prod.product_name}</Text>
        </View>
        <Image
          resizeMode="cover"
          style={{ width: "100%", height: 196, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}
          source={{ uri: prod.download_url }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalShow />
      <DisplayItems />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: "auto",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productContainer: {
    borderWidth: 1,
    width: Dimensions.get("window").width / 2.2,
    height: 240,
    borderRadius: 10,
    backgroundColor: "pink",
    marginRight: "auto",
    marginBottom: 5,
  },
  btnQuantity: {
    backgroundColor: "red",
    height: 40,
    marginLeft: 20,
  },

  productLabel: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },

  productContainerHeader: {
    backgroundColor: "#FD62A1",
    width: "100%",
    borderTopEndRadius: 9,
    borderTopLeftRadius: 9,
    padding: 10,
  },

  modalView: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight + 180,
  },

  btnQty: {
    backgroundColor: "#FD62A1",
    padding: 5,
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
  },

  modalHeader: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FD62A1",
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
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
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },

  btnModal: {
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "#FD62A1",
    padding: 10,
    borderRadius: 10,
    width: 300,
    elevation: 5,
    marginBottom: 10,
  },

  btnModalDismiss: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: 300,
    marginBottom: 10,
  },

  btnModalText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});

export default Inventory;
