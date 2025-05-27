import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const Profiledetails = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    email: null,
    firstname: null,
    phone:null,
    city: '',
    country:null,
    gender:null,
    pincode:null,
    state:null,
  });
  //const [Error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await AsyncStorage.getItem('logindetails');
        if (data !== null) {
          const { data: userData } = JSON.parse(data);
          setUserDetails({
            username: userData.username,
            email: userData.email,
            firstname: userData.firstname,
            phone: userData.phone,
            city: userData.city,
            gender: userData.gender,
            state: userData.state,

          });
        }else{
          router.push('/signin')
        }
      } catch (error) {
       
        console.error('Error reading value', error);
      }
    };

    getData();
  }, []);



  
  const handleChangepassword =  () => {
   router.push('/resetpassword')
  };
  

 
  return (
    <View style={styles.container}>
      {userDetails ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Edit Profile:</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push('/editprofile')}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{userDetails.username}</Text>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userDetails.email}</Text>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>{userDetails.firstname}</Text>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{userDetails.phone}</Text>
            </View>



            <View style={styles.profileRow}>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.value}>{userDetails.city}</Text>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{userDetails.state}</Text>
            </View>

          </View>

          <TouchableOpacity style={styles.changePassword} onPress={handleChangepassword}>
            <Text style={styles.logoutButtonText}>Change Password</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>
        <ActivityIndicator size="large" color="#378CCF" />
        </Text>
      )}
    </View>
  );
};

export default Profiledetails;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f8fb',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editProfileButton: {
    backgroundColor: '#59A8E5',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#666',
  },
  changePassword:{
    marginTop: 30,
    backgroundColor: '#378ccf',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },


  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
