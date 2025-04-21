import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StepIndicator from '../components/StepIndicator';
export default function Register2({ navigation }) {
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [dob, setdob] = React.useState('');
  const [Gender, setGender] = React.useState('');
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [stateOpen, setStateOpen] = useState(false);
  const [city, setCity] = useState();
  const [pincode, setPincode] = useState();



  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const step1Data = await AsyncStorage.getItem('registrationStep1');
        if (step1Data) {
          const parsedData = JSON.parse(step1Data);
          setFirstName(parsedData.firstName || '');
          setLastName(parsedData.lastName || '');
          setdob(parsedData.dateOfBirth || '');
          setGender(parsedData.gender || '');
        } else {
          console.warn('No registration data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to retrieve registration data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  const countryOptions = [
    { label: 'India', value: 'IN' },
    //{ label: 'USA', value: 'US' },
  ];

  const stateOptions = {
    IN: [
      { label: 'Punjab', value: 'punjab' },
      { label: 'Maharashtra', value: 'maharashtra' },
      { label: 'Karnataka', value: 'karnataka' },
      { label: 'Himachal Pradesh', value: 'himachal' },
    ],
    US: [
      { label: 'California', value: 'california' },
      { label: 'Texas', value: 'texas' },
      { label: 'Florida', value: 'florida' },
    ],
  };

  const [states, setStates] = useState([]);

  const [errors, setErrors] = useState({
    country: '',
    state: '',
    //city: '',
    pincode: ''
  });

  const handleCountrySelect = (value) => {
    setCountry(value);
    setState(null); 
    setStates(stateOptions[value] || []);
  };

  const handleNext = () => {
    let valid = true;
    let newErrors = { ...errors };

    // Reset errors
    newErrors.country = '';
    newErrors.state = '';
    //newErrors.city = '';
    newErrors.pincode = '';

    // Validation
    if (!country) {
      newErrors.country = 'Country is required';
      valid = false;
    }
    if (!state) {
      newErrors.state = 'State is required';
      valid = false;
    }

    // if (!city) {
    //   newErrors.city = 'City is required';
    //   valid = false;
    // }

    if (!pincode) {
      newErrors.pincode = 'Pincode is required';
      valid = false;
    }

    // If valid, proceed
    if (valid) {
      navigation.navigate('StepThree', { firstname, lastname, dob, Gender, country, state, pincode });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View style={styles.container}>
       <Image
             style={styles.logo}
             source={require('../assets/images/logo_signup.png')}
           />
      {/* <Text style={styles.title_1}>Register for account of three steps</Text> */}
      <Text style={styles.title}>Step-2</Text>

      {/* Country Dropdown */}
      <Text style={styles.label}>
      Country <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
            </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={country}
          onValueChange={handleCountrySelect}
          style={styles.dropdown}
        >
          <Picker.Item label="Select your country" value={null} />
          {countryOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}

      {/* State Dropdown */}
      {/* state label */}
      <Text style={styles.label}>
      State <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
            </Text>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={stateOpen}
          value={state}
          items={states}
          setOpen={setStateOpen}
          setValue={setState}
          placeholder="Select your state"
          disabled={!states.length} 
          style={[
            styles.dropdown,
            !states.length && { backgroundColor: '#f0f0f0' },
          ]}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>
      {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}

      {/* <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null} */}
       
       {/* Pincode input field */}
       <Text style={styles.label}>
      Pin Code <Text style={{ color: "red" , textAlign:'left'}}>*</Text>
            </Text>
      <TextInput
        style={styles.input}
        placeholder="Pin Code"
        value={pincode}
        onChangeText={setPincode}
      />
      {errors.zipcode ? <Text style={styles.errorText}>{errors.zipcode}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <StepIndicator currentStep={2} />
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
    marginBottom: 33,
    textAlign: 'center',
    fontWeight: '700',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderColor: '#ccc',
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
    fontWeight: '400',
    width: '100%',
  },
});
