import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const NoInternetConnection = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/no_internet_connection.png')}
        style={styles.image}
      />
      <Text style={styles.oopsText}>Oops!</Text>
      <Text style={styles.message}>
        There is something wrong with your internet connection.{'\n'}
        Please connect to the internet to continue.
      </Text>
    </View>
  );
};

export default NoInternetConnection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
  },
  oopsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 22,
  },
});
