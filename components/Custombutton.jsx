import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({
  title, // Default title
  handlePress, 
  containerStyle = {}, 
  textStyles = {}, 
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, containerStyle]} // Combine default and custom styles
      activeOpacity={0.8} // Slight transparency effect on press
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={[styles.text, textStyles]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop:'5%',
    backgroundColor: '#fff', // Green shade
    borderRadius: 10, // Rounded corners
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Padding for a wider button
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  text: {
    color: '#000', // White text
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Optional: Make the text uppercase
    letterSpacing: 1,
  },
});

export default CustomButton;
