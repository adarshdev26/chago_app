import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking
} from "react-native";
import Checkbox from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONT_SIZES } from '../utils/fontUtils'
//import { useFocusEffect } from '@react-navigation/native';

const Serviceprovidersignup = () => {

  const [expotoken, setExpotoken] = useState('');


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    account_holder_name: "",
    account_number: "",
    house_no: "",
    gali_sector: "",
    city: "",
    pin_code: "",
    ifsc_code: "",
    address: "",
    selected_category_id: "",
    vehicle_availability: "Yes",
    confirmInfo: false,
    token: expotoken,
    service_provider_form: "service_provider"
  });

  const [profileImage, setProfileImage] = useState(null);
  const [adhaarImagefront, setAdhaarImagefront] = useState(null);
  const [adhaarImageback, setAdhaarImageback] = useState(null);
  const [labourCardImage, setLabourCardImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([
    { label: 'AC Technician', value: '113' },
    { label: 'Car Wash', value: '117' },
    { label: 'Carpenter Services', value: '52' },
    { label: 'Chair Repair', value: '112' },
    { label: 'Electrician', value: '53' },
    { label: 'Home Cleaning and Pest Control', value: '114' },
    { label: 'Interior Designer', value: '115' },
    { label: 'Mehandi Design', value: '110' },
    { label: 'Painter & POP', value: '59' },
    { label: 'Plumber', value: '54' },
    { label: 'Scrap Management', value: '109' },
    { label: 'Water Proofing', value: '111' },
    { label: 'Welder & Aluminium Work', value: '116' },
  ]);

  const [vehicleAvailable, setVehicleAvailable] = useState(null);
  const [available, setAvailable] = useState([
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Your registration has been submitted successfully! We're now reviewing your details. You will receive a confirmation email or SMS with your account approval status within [ timeframe, e.g., 24-48 hours ].");
  //const [vehicleOpen, setVehicleOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});


  // useFocusEffect(
  //   useCallback(() => {
  //     const checkRegistration = async () => {
  //       const success = await AsyncStorage.getItem('registrationSuccess');
  //       if (success === 'true') {
  //         router.push('/'); // or replace with your target screen
  //       }
  //     };
  //     checkRegistration();
  //   }, [])
  // );


  useEffect(() => {
    const getexpotoken = async () => {
      try {
        const expotoken = await AsyncStorage.getItem('expoPushToken');
        console.log(expotoken, 'the token is')
        setExpotoken(expotoken);
      } catch (error) {
        console.error('There is no token')
      }
    }
    getexpotoken();
  }, []);


  useEffect(() => {
    if (expotoken) {
      console.log(expotoken, 'fgjfngj')
      setFormData(prevFormData => ({
        ...prevFormData,
        token: expotoken,
      }));
    }
  }, [expotoken]);





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



  const handleSubmit = async () => {

    const errors = {};

    // Required fields
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirm_password) errors.confirm_password = "Confirm password is required";
    if (!formData.account_holder_name) errors.account_holder_name = "Account holder name is required";
    if (!formData.account_number) errors.account_number = "Account number is required";
    if (!formData.ifsc_code) errors.ifsc_code = "IFSC code is required";
    if (!formData.pin_code) errors.pin_code = "PIN code is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.house_no) errors.house_no = "House No is required";
    if (!formData.gali_sector) errors.gali_sector = "Gali/Sector is required";
    if (!formData.selected_category_id) errors.selected_category_id = "Specialization is required";

    // Additional checks
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }
    if (formData.account_number && formData.account_number.length < 9) {
      errors.account_number = "Account number must be at least 9 digits";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // If no errors
    setFormErrors({});
    setLoading(true);

    setLoading(true);


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

    addImage(profileImage, "profile.jpg", "profile_image");
    addImage(adhaarImagefront, "adhaarfront.jpg", "adhaar_front_image");
    addImage(adhaarImageback, "adhaarback.jpg", "adhaar_back_image");
    addImage(labourCardImage, "labourcard.jpg", "labour_card");



    try {
      const response = await fetch("https://chago.in/wp-json/my-api/v1/register/", {
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body: data,
      });

      const result = await response.json();
      console.log("Response JSON:", result); // <-- ADD THIS TO DEBUG

      if (response.ok) {
        await AsyncStorage.setItem('registrationSuccess', 'true');
        console.log("Expo Token being submitted:", formData.token);
        setLoading(false);
        setFormData('');
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push('/Settings');

        }, 4000)
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

  if (showSuccessMessage) {
    return (
      <>
        <Text style={styles.success}>{successMessage}</Text>
        <TouchableOpacity style={styles.successButton} onPress={() => router.push('/')}>
          <Text style={styles.uploadButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </>

    )
  }




  return (

    <ScrollView style={styles.container}>
      {/* <Text>{expotoken ? expotoken.toString() : 'No token yet'}</Text> */}
      <Text style={styles.label}>Personal Details</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
      />
      {formErrors.first_name && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.first_name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
      />
      {formErrors.last_name && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.last_name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      {formErrors.email && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      {formErrors.phone && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.phone}</Text>
      )}

      <Text style={styles.label}>Profile Image:</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("profileImage")}
      >
        <Text style={styles.uploadButtonText}>
          {profileImage ? "Change Profile Image" : "Upload Profile Image"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      {formErrors.password && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.password}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={formData.confirm_password}
        onChangeText={(text) =>
          setFormData({ ...formData, confirm_password: text })
        }
      />
      {formErrors.confirm_password && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.confirm_password}</Text>
      )}

      <Text style={styles.label}>Adhaar Upload:(Front Side)</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleImagePick("adhaarImagefront")}
      >
        <Text style={styles.uploadButtonText}>
          {adhaarImagefront ? "Change Adhaar Image" : "Upload Adhaar Image"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Adhaar Upload:(Back Side)</Text>
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

      <Text style={styles.label}>Specialization</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.selected_category_id}
          onValueChange={(value) => {
            setFormData(prev => ({ ...prev, selected_category_id: value }));
          }}
        >
          <Picker.Item label="Select Specialization" value="" />
          {items.map((spec, index) => (
            <Picker.Item key={index} label={spec.label} value={spec.value} />
          ))}
        </Picker>
        {formErrors.selected_category_id && (
          <Text style={{ color: 'red', margin: 2 }}>{formErrors.selected_category_id}</Text>
        )}

      </View>


      <Text style={styles.label}>Adddress</Text>
      <TextInput
        style={styles.input}
        placeholder="House No/Flat/Area"
        keyboardType="number-pad"
        value={formData.house_no}
        onChangeText={(text) =>
          setFormData({ ...formData, house_no: text })
        }
      />
      {formErrors.house_no && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.house_no}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Gali/Sector"
        value={formData.gali_sector}
        onChangeText={(text) =>
          setFormData({ ...formData, gali_sector: text })
        }
      />
      {formErrors.gali_sector && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.gali_sector}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(text) =>
          setFormData({ ...formData, city: text })
        }
      />
      {formErrors.city && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.city}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Pincode"
        keyboardType="number-pad"
        value={formData.pin_code}
        onChangeText={(text) =>
          setFormData({ ...formData, pin_code: text })
        }
      />
      {formErrors.pin_code && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.pin_code}</Text>
      )}

      <Text style={styles.label}>Vehicle Availability</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={vehicleAvailable}
          onValueChange={(value) => {
            setVehicleAvailable(value);
            setFormData({ ...formData, vehicle_availability: value });
          }}
        >
          <Picker.Item label="Select Availability" value="" />
          {available.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Account Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Account Holder's Name"
        value={formData.account_holder_name}
        onChangeText={(text) =>
          setFormData({ ...formData, account_holder_name: text })
        }
      />
      {formErrors.account_holder_name && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.account_holder_name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        keyboardType="number-pad"
        value={formData.account_number}
        onChangeText={(text) =>
          setFormData({ ...formData, account_number: text })
        }
      />
      {formErrors.account_number && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.account_number}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="IFSC Code"
        keyboardType="number-pad"
        value={formData.ifsc_code}
        onChangeText={(text) =>
          setFormData({ ...formData, ifsc_code: text })
        }
      />
      {formErrors.ifsc_code && (
        <Text style={{ color: 'red', margin: 2 }}>{formErrors.ifsc_code}</Text>
      )}


      <View style={styles.checkboxContainer}>
        <Checkbox
          value={formData.confirmInfo}
          onValueChange={(newValue) =>
            setFormData({ ...formData, confirmInfo: newValue })
          }
        />
        <Text style={styles.checkboxLabel}>
          I confirm that all information in this document is true to the best of my knowledge and I agree to the{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://chago.in/privacy-policy/')}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://chago.in/terms-and-conditions/')}>
            Terms and Conditions
          </Text>.
        </Text>

      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>{loading ? 'Loading..' : 'Submit'}</Text>
      </TouchableOpacity>
      {/* <Button 
      title={loading ? 'SUBMITTING...' : 'Submit'} 
      onPress={handleSubmit}
       /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginLeft: 10, marginRight: 10 },
  title: { fontSize: FONT_SIZES.heading, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: { fontSize: FONT_SIZES.subheading, fontWeight: "bold", marginVertical: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
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
  submitButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 5, marginVertical: 10 },
  submitButtonText: { color: '#fff', textAlign: 'center' },
  checkboxLabel: { marginLeft: 10, fontSize: 12, textAlign: 'center', paddingVertical: 5 },
  success: { color: 'green', textAlign: 'center', fontSize: 13, marginTop: 20 },
  dropdown: { marginBottom: 20, marginTop: 15 },

  successButton: { padding: 15, borderRadius: 5, backgroundColor: '#007bff', marginTop: 20 },
  link: {
    color: '#378CCF', // Make it look like a link
    textDecorationLine: 'underline',
  },
});

export default Serviceprovidersignup;
