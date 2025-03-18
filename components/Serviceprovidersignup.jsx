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
  CheckBox,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";

const Serviceprovidersignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    email: "",
    accountHolderName: "",
    accountNumber: "",
    address: "",
    specialization: "",
    vehicleAvailability: false,
    confirmInfo: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [adhaarImage, setAdhaarImage] = useState(null);
  const [labourCardImage, setLabourCardImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "AC Technician", value: "ac_technician" },
    { label: "Plumber", value: "plumber" },
    { label: "Carpenter", value: "carpenter" },
    { label: "Electrician", value: "electrician" },
  ]);

  const handleImagePick = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (field === "profileImage") setProfileImage(uri);
      if (field === "adhaarImage") setAdhaarImage(uri);
      if (field === "labourCardImage") setLabourCardImage(uri);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.phoneNumber || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
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
    if (adhaarImage) {
      data.append("adhaarImage", {
        uri: adhaarImage,
        name: "adhaar.jpg",
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

    try {
      // API call
      const response = await fetch("https://chago.in/wp-json/my-api/v1/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Registration submitted successfully!");
      } else {
        Alert.alert("Error", result.message || "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Service Provider Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
      />

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
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
      />

      <Text style={styles.label}>Adhaar Upload:</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("adhaarImage")}
      >
        <Text style={styles.uploadButtonText}>
          {adhaarImage ? "Change Adhaar Image" : "Upload Adhaar Image"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Account Holder's Name"
        value={formData.accountHolderName}
        onChangeText={(text) =>
          setFormData({ ...formData, accountHolderName: text })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        keyboardType="number-pad"
        value={formData.accountNumber}
        onChangeText={(text) =>
          setFormData({ ...formData, accountNumber: text })
        }
      />

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

      <Text style={styles.label}>Profile Image:</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("profileImage")}
      >
        <Text style={styles.uploadButtonText}>
          {profileImage ? "Change Profile Image" : "Upload Profile Image"}
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

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={formData.vehicleAvailability}
          onValueChange={(newValue) =>
            setFormData({ ...formData, vehicleAvailability: newValue })
          }
        />
        <Text style={styles.checkboxLabel}>Vehicle Available</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={formData.confirmInfo}
          onValueChange={(newValue) =>
            setFormData({ ...formData, confirmInfo: newValue })
          }
        />
        <Text style={styles.checkboxLabel}>
          I confirm that all information is true
        </Text>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
});

export default Serviceprovidersignup;
