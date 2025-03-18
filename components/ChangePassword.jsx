import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');
  const [id, setId] = useState(null);
  const [errormessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('')
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await AsyncStorage.getItem('logindetails');
        if (data !== null) {
          const result = JSON.parse(data);
          setId(result.data.id);
        }
      } catch (error) {
        console.error('Error reading value', error);
      }
    };

    getData();
  }, []);
console.log(id);


  const handleSave = async () => {
    setError(''); // Clear any previous errors

    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true)
    try {
      const response = await fetch("https://chago.in/wp-json/my-api/v1/change_user_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer faketoken",
        },
        body: JSON.stringify({
          user_id: id,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        setLoading(false)
        const result = await response.json();
        if(result.success == true ) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage(result.message)
      }else {
        setErrorMessage(result.message)
      }
      } else {
        setLoading(false)
        const error = await response.json();
        setError(error.message || "Failed to change password.");
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
      setError("Something went wrong. Please try again later.");
    }
  };

  if(errormessage) {
    return  <Text style={styles.errorText}>{errormessage}</Text>
  }



  if(loading) {
    return <Text>Loading.....</Text>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
<Text style={styles.message}>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  message: {
    color:'green',
    fontSize:22,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f8fb",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#59A8E5",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize:22,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
