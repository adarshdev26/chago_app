import React, { useState , useEffect} from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Locationpopup({  onLocationSelect }) {
  const [visible, setVisible] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading , setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const MAPPLS_API_KEY = "fd4b6fb189aa4528df8950ecf5692bb8";




  
  // Get the current location of the user
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalMessage("Permission to access location was denied")
        setModalVisible(true)
        //alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      

      
      //const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      // Call the Mappls Reverse Geocode API
    const response = await fetch(
      `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/rev_geocode?lat=${latitude}&lng=${longitude}&region=IND`
    );
    const data = await response.json();
    console.log(data);
    if (data.results && data.results.length > 0) {
      const address = data.results[0].formatted_address;
      setLocationDetails(address);
      onLocationSelect(address);
   
      console.log("Reverse geocoded address:", address);
    } else {
      alert("Failed to retrieve location details.");
    }

      setLatitude(latitude);
      setLongitude(longitude);
      setVisible(false);
    } catch (error) {
      //console.error(error);
      //alert("Failed to get location");
      setModalMessage("Failed To Get the Location, Please Try Again..")
      setModalVisible(true)
    }
  };


  // autosuggestion search...
  const searchLocation = async (query) => {
    if (!query) {
      setSearchResults([]); 
      return;
    }
  setLoading(true)
    try {
      const response = await axios.get(
       // `https://koreabuying.com/email?query=${query}`
        `https://chago.in/wp-admin/admin-ajax.php?action=fetch_autosuggestions&query=${query}`
      );
      const result = response.data;
      setSearchResults(result.data);
      //console.log(result.suggestedLocations,'this is result')
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchLocation(searchQuery);
    }, 500); 

    return () => clearTimeout(delayDebounceFn); 
  }, [searchQuery]);


  const handleSelectLocation = (location) => {
    onLocationSelect(location);
    setSearchQuery(location.placeAddress); 
    setSearchResults([]);
    setVisible(false); 
  };

  console.log(searchResults)
 
  
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalBackground}> 
          <View style={styles.modalContainer}>
            <View style={styles.imageContainer}>
               <Image
                 source={require('../assets/images/Location.png')}
                  style={styles.icon}
                  contentFit="cover"
                  />
            </View>
            <Text style={styles.modalTextHeading}>What is Your Location?</Text>
            <Text style={styles.subcopy}>To Find Nearby Service Provider.</Text>

            {/* Button to use the current location */}
           {!isSearchVisible && (
            <>
                <TouchableOpacity
              style={styles.closeButton}
              onPress={getLocation} // Use current location
            >
              <Text style={styles.buttonText}>Allow Location Access</Text>
            </TouchableOpacity>

            </>
           )}

            {/* Search Bar */}
            <TouchableOpacity  onPress={() => setIsSearchVisible(true)}>
            <Text style={styles.manualLocationText}>Enter Location Manually</Text>
          </TouchableOpacity>
          
          {isSearchVisible && (
            <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search location..."
              value={searchQuery}
              onChangeText={(text) => {
              setSearchQuery(text);
              }}
            />

              {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelectLocation(item.placeAddress)}
                  >
                    <Text style={styles.resultText}>{item.placeAddress}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdown} // Styling for dropdown
              />
            )}

            </>
          )}
          
            {selectedLocation && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  Selected Location: {selectedLocation.placeAddress}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>


      {/* Access Location Denied.. */}
        <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
