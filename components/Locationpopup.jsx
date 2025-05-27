import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const MAPPLS_API_KEY = "fd4b6fb189aa4528df8950ecf5692bb8";

export default function Locationpopup({ onLocationSelect }) {
  const [visible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Request and fetch current location with reverse geocoding
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return showModal("Permission to access location was denied");
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const response = await fetch(
        `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/rev_geocode?lat=${coords.latitude}&lng=${coords.longitude}&region=IND`
      );
      const data = await response.json();

      if (data?.results?.length) {
        const address = data.results[0].formatted_address;
        setSelectedLocation(address);
        onLocationSelect(address);
        setVisible(false);
      } else {
        showModal("Failed to retrieve location details.");
      }
    } catch (error) {
      showModal("Failed to get the location, please try again.");
    }
  };

  // Handle autosuggestion search
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://chago.in/wp-admin/admin-ajax.php?action=fetch_autosuggestions&query=${query}`
      );
      setSearchResults(response.data?.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => searchLocation(searchQuery), 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Handle selecting a suggested location
  const handleSelectLocation = (placeAddress) => {
    setSelectedLocation(placeAddress);
    setSearchQuery(placeAddress);
    setSearchResults([]);
    setVisible(false);
    onLocationSelect(placeAddress);
  };

  // Show modal with message
  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Main Location Modal */}
      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/Location.png")}
                style={styles.icon}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.modalTextHeading}>What is Your Location?</Text>
            <Text style={styles.subcopy}>To Find Nearby Service Provider.</Text>

            {!isSearchVisible ? (
              <>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={getCurrentLocation}
                >
                  <Text style={styles.buttonText}>Allow Location Access</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsSearchVisible(true)}
                >
                  <Text style={styles.manualLocationText}>
                    Enter Location Manually
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search location..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                {loading ? (
                  <ActivityIndicator
                    style={styles.loader}
                    size="large"
                    color="#0000ff"
                  />
                ) : (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleSelectLocation(item.placeAddress)}
                      >
                        <Text style={styles.resultText}>
                          {item.placeAddress}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.dropdown}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer:{marginTop:10, paddingRight:20},
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  imageContainer:{marginBottom:20},
  icon:{height:60, width:60},
  modalTextHeading: {
    color: "#000",
    fontSize: 18,
    marginBottom: 7,
    fontWeight: "700",
    textAlign:'center'
  },
  subcopy:{marginBottom:10, fontSize:12, fontWeight:400},
  loader: {
    marginBottom:30,
    marginLeft:30
  },
  closeButton: {
    marginTop:10,
    marginBottom:20,
    backgroundColor: "#378ccf",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width:'100%'
   
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  manualLocationText:{fontSize:14, fontWeight:400},
  searchInput: {
    width: 250,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginTop:10
  
  },
  locationInfo: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  locationText: {
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    maxHeight: 200, // Limit dropdown height
    marginBottom: 10,
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
  },
  modalContainer1: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  modalContent1: {width: 300,padding: 50,backgroundColor: '#fff',borderRadius: 10,alignItems: 'center',},
  modalText: {fontSize: 18,marginBottom: 20,textAlign: 'center',},
  modalButtons: {flexDirection: 'row',justifyContent: 'space-between',width: '100%',},
  cancelButton: {flex: 1,backgroundColor: 'gray',padding: 10,borderRadius: 5,marginRight: 10,alignItems: 'center',},
});
