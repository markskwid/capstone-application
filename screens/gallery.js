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
  Modal,
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
  onValue,
} from "firebase/database";

const db = getDatabase();
const storage = getStorage();

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Gallery = () => {
  const [sampleImage, setSampleImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  var arr = [];
  var empArr = [];
  const [url, setUrl] = useState([]);
  var imgArr = [];
  const [wtf, setWtf] = useState([]);
  const overviewRef = ref_storage(storage, `gallery`);

  const [imageName, setImageName] = useState("");
  const [imageInfo, setImageInfo] = useState("");
  const [imagePosted, setImagePosted] = useState("");

  var img_arr = [];
  const [images, setImages] = useState({ img_arr });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const getSampleImage = () => {
    listAll(overviewRef).then((res) => {
      res.items.forEach((imageRef) => {
        getDownloadURL(imageRef).then((urls) => {
          url.push(urls);
          setUrl(url);
          setWtf([...url]);
        });
      });
    });
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
                {imageName}
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  textAlign: "center",
                }}
              >
                {imagePosted}
              </Text>
            </View>

            <View style={{marginTop: 10, padding: 20}}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium_Italic",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                {imageInfo}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnModalDismiss}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnModalText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const getImageInfo = (img_id) => {
    const starCountRef = ref_database(db, "gallery/" + img_id);
    onValue(starCountRef, (snapshot) => {
      setImageName(snapshot.val().image_name);
      setImagePosted(snapshot.val().image_posted);
      setImageInfo(snapshot.val().image_description);
    });
  };

  const getImages = () => {
    const commentsRef = ref_database(db, "gallery/");
    onChildAdded(commentsRef, (data) => {
      img_arr.push({
        id: data.key,
        ...data.val(),
      });
      setWtf([...img_arr]);
    });
  };

  const DisplayImages = () => {
    return images.img_arr.map((image) => (
      <TouchableOpacity
        style={styles.container}
        key={image.id}
        onPress={() => setModalVisible(true) || getImageInfo(image.id)}
      >
        <ImageBackground
          style={styles.imageBg}
          imageStyle={{ borderRadius: 30 }}
          source={{ uri: image.download_url }}
        ></ImageBackground>
      </TouchableOpacity>
    ));
  };

  useEffect(() => {
    onRefresh();
    getImages();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ModalShow />
      <View style={styles.mainContainer}>
        <DisplayImages />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 3,
  },

  container: {
    width: Dimensions.get("window").width / 2.1,
    height: 300,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: "auto",
    marginTop: 5,
    elevation: 5,
  },

  imageBg: {
    width: "100%",
    height: "100%",
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
    padding: 10,
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
    width: Dimensions.get("window").width - 50,
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
export default Gallery;
