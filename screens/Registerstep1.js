import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function Register1({ navigation }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [gender, setGender] = React.useState('');

  // Error messages
  const [errors, setErrors] = React.useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
  });

  const handleNext = async () => {
    let valid = true;
    let newErrors = { ...errors };

    // Reset errors
    newErrors.firstName = '';
    newErrors.lastName = '';
    newErrors.dateOfBirth = '';
    newErrors.gender = '';

    // Validation for empty fields
    if (!firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      valid = false;
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        newErrors.dateOfBirth = 'Date of birth must be in YYYY-MM-DD format';
        valid = false;
      } else {
        // Check if the date is a valid date
        const dateObj = new Date(dateOfBirth);
        if (isNaN(dateObj.getTime())) {
          newErrors.dateOfBirth = 'Invalid date';
          valid = false;
        }
      }
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
      valid = false;
    }

    setErrors(newErrors);

    // If all fields are valid, proceed to the next step
    if (valid) {
      try {
        await AsyncStorage.setItem(
          'registrationStep1',
          JSON.stringify({ firstName, lastName, dateOfBirth, gender })
        );
        navigation.navigate('StepTwo');
      } catch (error) {
        Alert.alert('Error', 'Failed to save data. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo_signup.png')}
      />
      <Text style={styles.title}>Step-1</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName ? (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName ? (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      {errors.dateOfBirth ? (
        <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
      ) : null}

      {/* Gender Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>
      {errors.gender ? (
        <Text style={styles.errorText}>{errors.gender}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
  title: {
    color: '#378CCF',
    fontSize: 20,
    marginBottom: 33,
    textAlign: 'center',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 60,
    padding: 10,
    marginBottom: 25,
    borderRadius: 5,
    fontSize: 14,
    color: '#2B2B2B',
    fontWeight: '400',
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#2B2B2B',
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
    marginBottom: 10,
  },
});
