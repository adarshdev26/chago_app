import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const Card = ({ imageSource, text }) => (
  <View style={styles.card}>
    <Image source={imageSource} style={styles.image} />
    <Text style={styles.cardText}>{text}</Text>
  </View>
);

const Ourprocess = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingtext}>Our Process</Text>
      <Text style={styles.headingtext1}>Get amazing Services in 4 simple steps</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card imageSource={require('../assets/images/calander.png')} text="Easy Online Scheduling"  />
        <Card imageSource={require('../assets/images/twenty-four.png')} text="24/7 Services" />
        <Card imageSource={require('../assets/images/enjoy-service.png')} text="House Care" />
        <Card imageSource={require('../assets/images/hourse-care.png')} text="Enjoy Services" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  headingtext: {
    fontSize: 18,
    lineHeight: 24,
    color: '#378CCF',
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop:15
    
  },
  headingtext1: {
    fontSize: 28,
    lineHeight: 40,
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    //fontFamily:'SpaceMono'
    marginTop:15
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    marginTop:20,
    gap:20
  },
  card: {
    width: 140,
    height: 100,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, // for shadow on Android
    shadowColor: '#000', // for shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent:'center'
  },
  image: {
    paddingTop:50,
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  cardText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
});

export default Ourprocess;
