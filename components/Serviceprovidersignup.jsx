import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Checkbox from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";

const Serviceprovidersignup = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    account_holder_name: "",
    account_number: "",
    house_no : "",
    gali_sector: "",
    pin_code :"",
    ifsc_code:"",
    address: "",
    specialization: "",
    vehicle_availability: "Yes",
    confirmInfo: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [adhaarImagefront, setAdhaarImagefront] = useState(null);
  const [adhaarImageback, setAdhaarImageback] = useState(null);
  const [labourCardImage, setLabourCardImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([
    { label: "AC Technician", value: "ac_technician" },
    { label: "Plumber", value: "plumber" },
    { label: "Carpenter", value: "carpenter" },
    { label: "Electrician", value: "electrician" },
    { label: "Car Wash", value: "carwash" },
    { label: "Painter", value: "painter" },
    { label: "Water Proofing", value: "waterproofing" },
  ]);
  const [vehicleAvailable, setVehicleAvailable] = useState(null);
  const [available, setAvailable] = useState([
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Registration submitted successfully!, you get a confirmation Mail/SMS once your account approved');
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const handleImagePick = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (field === "profileImage") setProfileImage(uri);
      if (field === "adhaarImagefront") setAdhaarImagefront(uri);
      if (field === "adhaarImageback") setAdhaarImageback(uri);
      if (field === "labourCardImage") setLabourCardImage(uri);
    }
  };

  /*const handleSubmit = async () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name ||!formData.phone || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Create form data
    const data = new FormData();
    data.append("signupdata", JSON.stringify(formData));
    if (profileImage) {
      data.append("profileImage", {
        uri: profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }
    if (adhaarImagefront) {
      data.append("adhaarImagefront", {
        uri: adhaarImagefront,
        name: "adhaarfront.jpg",
        type: "image/jpeg",
      });
    }
    if (adhaarImageback) {
      data.append("adhaarImageback", {
        uri: adhaarImageback,
        name: "adhaarback.jpg",
        type: "image/jpeg",
      });
    }
    if (labourCardImage) {
      data.append("labourCardImage", {
        uri: labourCardImage,
        name: "labourcard.jpg",
        type: "image/jpeg",
      });
    }

    setLoading(true);

    try {
    
      // API call
      const response = await fetch("https://chago.in/wp-json/my-api/v1/register/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setLoading(false)
        Alert.alert("Success", "Registration submitted successfully!");
      } else {
        setLoading(false)
        Alert.alert("Error", result.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false)
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };*/


  
  const handleSubmit = async () => {
    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    if (formData.password !== formData.confirm_password) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    const data = new FormData();
  
    // Append each field
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
  
    const addImage = (uri, name, fieldName) => {
      if (uri) {
        data.append(fieldName, {
          uri,
          name,
          type: "image/jpeg", // or image/*
        });
      }
    };
  
    addImage(profileImage, "profile.jpg", "profileImage");
    addImage(adhaarImagefront, "adhaarfront.jpg", "adhaarImagefront");
    addImage(adhaarImageback, "adhaarback.jpg", "adhaarImageback");
    addImage(labourCardImage, "labourcard.jpg", "labourCardImage");
  
    setLoading(true);
  
    try {
      const response = await fetch("https://chago.in/wp-json/my-api/v1/register/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      });
  
      const result = await response.json();
      console.log("Response JSON:", result); // <-- ADD THIS TO DEBUG
  
      if (response.ok) {
        setLoading(false);
        setFormData('');
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push('/')
        },2000)
      } else {
        setLoading(false);
        Alert.alert("Error", result.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };

  if(showSuccessMessage) {
    return (
      <Text style={styles.success}>{successMessage}</Text>
    )
  }
  

  return (
    
    <ScrollView style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
      />

       <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />

      <Text style={styles.label}>Profile Image:</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("profileImage")}
      >
        <Text style={styles.uploadButtonText}>
          {profileImage ? "Change Profile Image" : "Upload Profile Image"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={formData.confirm_password}
        onChangeText={(text) =>
          setFormData({ ...formData, confirm_password: text })
        }
      />

      <Text style={styles.label}>Adhaar Upload:(Front)</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("adhaarImagefront")}
      >
        <Text style={styles.uploadButtonText}>
          {adhaarImagefront ? "Change Adhaar Image" : "Upload Adhaar Image"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Adhaar Upload:(Back)</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("adhaarImageback")}
      >
        <Text style={styles.uploadButtonText}>
          {adhaarImageback ? "Change Adhaar Image" : "Upload Adhaar Image"}
        </Text>
      </TouchableOpacity>


      <Text style={styles.label}>Labour Card Upload:</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("labourCardImage")}
      >
        <Text style={styles.uploadButtonText}>
          {labourCardImage ? "Change Labour Card" : "Upload Labour Card"}
        </Text>
      </TouchableOpacity>

     <View style={styles.dropdown}>
     <Text style={styles.label}>Specialization</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(value) => {
          setFormData({ ...formData, specialization: value });
          setValue(value);
        }}
        setItems={setItems}
        placeholder="Select your specialization"
      />
     </View>

  

         <TextInput
        style={styles.input}
        placeholder="House No/Flat/Area"
         keyboardType="number-pad"
        value={formData.house_no}
        onChangeText={(text) =>
          setFormData({ ...formData, house_no: text })
        }
      />

       <TextInput
        style={styles.input}
        placeholder="Gali/Sector"
        value={formData.gali_sector}
        onChangeText={(text) =>
          setFormData({ ...formData, gali_sector: text })
        }
      />

      <TextInput
      style={styles.input}
      placeholder="Pincode"
      keyboardType="number-pad"
      value={formData.pin_code}
      onChangeText={(text) =>
        setFormData({ ...formData, pin_code: text })
      }
    />

<View style={styles.dropdown}>
        <Text style={styles.label}>Vehicle Available</Text>
        <DropDownPicker
          open={vehicleOpen}
          value={vehicleAvailable}
          items={available}
          setOpen={setVehicleOpen}
          setValue={(val) => {
            setFormData({ ...formData, vehicle_availability: val() });
            setVehicleAvailable(val());
          }}
          setItems={setAvailable}
        />
        </View>

      <TextInput
        style={styles.input}
        placeholder="Account Holder's Name"
        value={formData.account_holder_name}
        onChangeText={(text) =>
          setFormData({ ...formData, account_holder_name: text })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        keyboardType="number-pad"
        value={formData.account_number}
        onChangeText={(text) =>
          setFormData({ ...formData, account_number: text })
        }
      />

      <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              keyboardType="number-pad"
              value={formData.ifsc_code}
              onChangeText={(text) =>
                setFormData({ ...formData, ifsc_code: text })
              }
            />

        {/* <Checkbox
          value={formData.vehicle_availability}
          onValueChange={(newValue) =>
            setFormData({ ...formData, vehicle_availability: newValue })
          }
        /> */}
     

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={formData.confirmInfo}
          onValueChange={(newValue) =>
            setFormData({ ...formData, confirmInfo: newValue })
          }
        />
        <Text style={styles.checkboxLabel}>
          I confirm that all information is true
        </Text>
      </View>

      <Button  title={loading ? 'Loading' : 'Submit'} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: { color: "#fff", fontWeight: "bold" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: { marginLeft: 10 },
  success:{color:'green', textAlign:'center', fontSize:13, marginTop:20},
  dropdown :{marginBottom:20, marginTop:15}
});

export default Serviceprovidersignup;
