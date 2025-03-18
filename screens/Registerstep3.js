import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Redirect, router } from 'expo-router';
export default function Register3({ navigation, route }) {
  const { firstname, lastname, dob, Gender, country, state, city, pincode } = route.params;
  const [email, setemail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //const [showResult, setShowresult] = useState('')
   var role = 'subscriber';
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmpass: '',
  });

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
          setMessage(data.message)
          setTimeout(() => {
            router.push('/signin')
          },2000);
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

  if(errorMessage) {
    return <Text style={styles.errorText}>{errorMessage}</Text>
  }

  if(message) {
    return <Text style={styles.message}>{message}</Text>
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/chago-logo.svg')}
      />
      <Text>{message}</Text>
      <Text style={styles.title_1}>Register for account of three steps</Text>
      <Text style={styles.title}>Step-3</Text>

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

        {/* Phone Input */}
        <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        keyboardType="numeric" 
      />
      {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmpass}
        onChangeText={setConfirmpass}
        secureTextEntry
      />
      {errors.confirmpass ? <Text style={styles.errorText}>{errors.confirmpass}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  title: {
    color: '#378CCF',
    fontSize: 20,
    marginBottom: 33,
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
  errorText: {
    color:'red',
    fontSize:22
  }
});
