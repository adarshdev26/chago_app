import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError(''); // Reset error message
    setMessage(''); // Reset success message

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const response = await fetch('https://chago.in/wp-json/my-api/v1/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identify: email, // Send email in the "identify" field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setMessage(data.message); // Display success message
          setEmail(''); // Clear email field on success
          setTimeout(() => {
            router.push('/signin');
          },1000)
        } else {
          setError(data.message || 'Something went wrong.');
        }
      } else {
        setError('There was an issue with the request. Please try again.');
      }
    } catch (error) {
      setError('Unable to process the request. Please check your network and try again.');
    }
  };

  return (
      
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/Chago-Logo 2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View>
        <Image
        style={{backgroundColor:'#59a8e5' , width:'100%'  }} 
          source={require('../../assets/images/login-bg-2.png')}
        />
      </View>
            <ImageBackground style={styles.form_BG} 
              // source={require('../../assets/images/login-bg.png')}
              // resizeMode="contain"
            >
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email address to reset your password.</Text>
      <TextInput
      required
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset My Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
      <Text style={styles.buttonText}>Back to home</Text>
      </TouchableOpacity>
     </ImageBackground>
    </View>
    
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#59A8E5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%',
  },
  form_BG: {
    backgroundColor: '#fff',
    paddingBottom: 180,
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 20,
  //   backgroundColor: '#f9f9f9',
  // },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    margin: 'auto',
    backgroundColor: '#EBF6FE',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#2B2B2B',
  },
  button: {
    backgroundColor: '#59A8E5',
    padding: 15,
    paddingLeft: 35,
    paddingRight: 35,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    marginBottom: 20,
    color: 'red',
    fontSize: 16,
  },
  successMessage: {
    marginBottom: 20,
    color: 'green',
    fontSize: 16,
  },
  text1: {
    color:'black',
    marginTop:20,
    textAlign: 'center',
    fontSize:16
  }
});
