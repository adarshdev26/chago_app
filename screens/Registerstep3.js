import React, { useState , useCallback} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Modal} from 'react-native';
import { Redirect, router } from 'expo-router';
import StepIndicator from '../components/StepIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect } from "@react-navigation/native";

export default function Register3({ navigation, route }) {
  const { firstname, lastname, dob, Gender, country, state, city, pincode } = route.params;
  const [email, setemail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  //const [showResult, setShowresult] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
   var role = 'subscriber';
   
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmpass: '',
  });


    //logged in not able to back to login screen
    useFocusEffect(
      useCallback(() => {
        const checkIfLogin = async () => {
          try {
            setLoading(true);
            const userData = await AsyncStorage.getItem('logindetails');
            if (userData) {
              router.replace('/profile'); 
            }
          } catch (error) {
            console.error('Error checking login status', error);
          } finally {
            setLoading(false);
          }
        };
  
        checkIfLogin();
      }, [])
    );


  // handle login funciton..
  const handleLogin = async () => {
    try {
      const response = await fetch('https://chago.in/wp-json/my-api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // Using the same field for email or username...
          password: password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('logindetails', JSON.stringify(data));
        const redirectUrl = await AsyncStorage.getItem('redirectAfterLogin');
        const targetRoute = redirectUrl || '/Settings';
  
        setTimeout(async () => {
          router.push(targetRoute);
          await AsyncStorage.removeItem('redirectAfterLogin');
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setModalVisible(true);
    }
  };
  


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Add more rules if necessary, e.g., numbers, uppercase, etc.
  };

  const handleNext = async () => {
    let valid = true;
    let newErrors = { ...errors };

    // Reset errors
    newErrors.email = '';
    newErrors.password = '';
    newErrors.confirmpass = '';
  
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!phone) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      // Check if the phone number is numeric and 10 digits
      newErrors.phone = 'Phone must be a 10-digit number';
      valid = false;
    }
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    // Confirm password validation
    if (!confirmpass) {
      newErrors.confirmpass = 'Confirm password is required';
      valid = false;
    } else if (password !== confirmpass) {
      newErrors.confirmpass = 'Passwords do not match';
      valid = false;
    }
  
    setErrors(newErrors);

    // If valid, proceed
    if (valid) {
      setLoading(true);
      try {
        const requestData = {
          firstname,
          lastname,
          dob,
          Gender,
          country,
          state,
          city,
          pincode,
          email,
          phone,
          password,
          role
        };

        const response = await fetch('https://chago.in/wp-json/my-api/v1/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
          await handleLogin();
          setModalVisible(true);
        }
        else{
          setErrorMessage(data.message)
          }
          // Navigate to a different screen after success
        }
       catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred while registering');
      }
    }
  };


  const handleClose = () => {
    setModalVisible(false)
  }
  return (
    <View style={styles.container}>
      <Image
            style={styles.logo}
            source={require('../assets/images/logo_signup.png')}
          />
      {/* <Text style={styles.title_1}>Register for account of three steps</Text> */}
      <Text style={styles.title}>Step-3</Text>
      
      {/* Email Label */}
      <Text style={styles.label}>
        Email <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
              </Text>
      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setemail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Phone Label */}
      <Text style={styles.label}>
       Mobile No <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
        </Text>
        {/* Phone Input */}
        <TextInput
        style={styles.input}
        placeholder="Mobile No"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        keyboardType="numeric" 
      />
      {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

        {/* Password Label */}
        <Text style={styles.label}>
       Password <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
        </Text>
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

       {/*Confirm Password Label */}
       <Text style={styles.label}>
       Confirm Password <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
        </Text>
      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmpass}
        onChangeText={setConfirmpass}
        secureTextEntry
      />
      {errors.confirmpass ? <Text style={styles.errorText}>{errors.confirmpass}</Text> : null}

      <TouchableOpacity 
      style={styles.button} 
      onPress={handleNext}
      disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>

      <StepIndicator currentStep={3} />
     

     {/* Login first Confirmation Modal */}
     {message && (
  <Modal visible={modalVisible} transparent animationType="fade">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{message}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}

{errorMessage && (
  <Modal visible={modalVisible} transparent animationType="fade">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{errorMessage}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(232, 245, 255)',
  },
  logo: {
    width: 169,
    height: 70,
    marginBottom: 20,
  },
  title_1: {
    color: '#2B2B2B',
    fontSize: 20,
    marginBottom: 90,
    textAlign: 'center',
    fontWeight: '400',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",  // Ensures the text is left-aligned
    width: "100%",      // Makes sure the label takes full width
    marginBottom: 5,
  },
  title: {
    color: '#378CCF',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#59A8E5',
    paddingVertical: 8,
    paddingHorizontal: 55,
    borderRadius: 5,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 60,
    padding: 10,
    marginBottom: 25,
    borderRadius: 5,
    fontSize: 14,
    color: '#2B2B2B',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  message:{
    color:'red'
  },
  modalContainer: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  modalContent: {width: 300,padding: 20,backgroundColor: '#fff',borderRadius: 10,alignItems: 'center',},
  modalText: {fontSize: 18,marginBottom: 20,textAlign: 'center',},
  modalButtons: {flexDirection: 'row',justifyContent: 'space-between',width: '100%',},
  cancelButton: {flex: 1,backgroundColor: 'gray',padding: 10,borderRadius: 5,marginRight: 10,alignItems: 'center',},
  confirmButton: {flex: 1,backgroundColor: 'green',padding: 10,borderRadius: 5,alignItems: 'center',},
 

});
