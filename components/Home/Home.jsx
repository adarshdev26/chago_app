import { View,ActivityIndicator, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView ,ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Link } from 'expo-router';


const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const categories = [
    { id: 1, name: 'Carpenter', icon: require('../../assets/images/carpenter.svg') },
    { id: 2, name: 'Plumbing',icon: require('../../assets/images/carpenter.svg') },
    { id: 3, name: 'Electrician', icon: require('../../assets/images/carpenter.svg') },
    { id: 4, name: 'Sofa Cleaning', icon: require('../../assets/images/carpenter.svg') },
    { id: 5, name: 'Water Proofing', icon: require('../../assets/images/carpenter.svg') },
  ];
  const services = [
    {
      id: 1,
      title: 'Intense bathroom cleaning',
      price: '₹ 519',
      image: require('../../assets/images/bathroom-cleaning.png'),
    },
    {
      id: 2,
      title: 'Sofa Cleaning',
      price: '₹ 519',
      image: require('../../assets/images/sofa-cleaning.png'),
    },
    {
      id: 3,
      title: 'Bathroom & kitchen cleaning',
      price: '₹ 519',
      image: require('../../assets/images/cleaning.png'),
    },
    {
      id: 4,
      title: 'Stress relief Swedish massage',
      price: '₹ 519',
      image: require('../../assets/images/stress.png'),
    },
  ];


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://chago.in/wp-json/my-api/v1/get_categories/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Assuming your API response has a format like [{ id, name, image_url }]
        const updatedCategories = result.map((category) => ({
          id: category.id,
          name: category.name,
          image: { uri: category.image_url }, // Image needs to be in the correct format for Image component
        }));

        setData(updatedCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCategories();
  }, []);


  
  
  
  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
    
      <Link href='/signin'> <Image source={require('../../assets/images/chago-logo.svg')} style={styles.logo} /></Link> 
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/Notification-Bell.svg')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/images/Favourite-Heart.svg')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>
      <View style={styles.section}>
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Categories</Text>
  
  {loading ? (
    <ActivityIndicator size="large" color="#378CCF" />
  ) : error ? (
    <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>
  ) : (
    <FlatList
      data={data} // Use the fetched data
      horizontal
      keyExtractor={(item, index) => index.toString()} // Ensure a unique key for each item
      renderItem={({ item }) => (
        <View style={styles.category}>
         <Image source={item.image} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>{item.name || 'Unknown'}</Text>
        </View>
      )}
    />
  )}
</View>


      </View>
      <View style={styles.banner}>
      <ImageBackground style={{  width:'100%' ,  borderRadius:'100%'}}

     source={require('../../assets/images/home-bg.png')} // Replace with your image path
      resizeMode="cover"
  
    >
      <View style={{ padding:'20',}}>
        <Text style={styles.bannerText}>Don't Miss Out!</Text>
        <Text style={styles.bannerSubtext}>Save Time!</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>CONTACT US</Text>
        </TouchableOpacity>
      </View>
</ImageBackground>
        </View>

   
      <View style={styles.section}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , display:'flex' , justifyContent:'space-between' , flexDirection:'row', marginBottom:10 , marginTop:30,}}>
        <Text style={styles.sectionTitle}>Most Booked Services</Text>
        <Text style={{  marginTop:-5 , fontSize:12, fontWeight:400 , color:'#378CCF' , postion:'relative', left:-10}}>See all</Text>
        </View>
     
        <FlatList
          data={services}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.service}>
              <Image source={item.image} style={styles.serviceImage} />
              
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <View style={{ flex: 1, marginBottom:'20',  justifyContent: 'space-between', alignItems: 'flex-start' , display:'flex' , justifyContent:'space-between' , flexDirection:'row' ,paddingBottom:'10px' , gap:'60px'}} >
              <Text style={styles.servicePrice}>{item.price}</Text>
              <TouchableOpacity>
                <Text 
                  style={{ color: '#378CCF', marginTop: 10, fontWeight: 'bold', fontSize: 8,
                  textDecoration: 'underline', textDecorationColor: '#378CCF',
                  position: 'relative',}}>
                  Book Now</Text>
              </TouchableOpacity>
                </View>
             
            </View>
          )}
        />
      </View>
  </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: '97px',
    height: '40px',
    resizeMode: 'contain',
  marginLeft:'-8px',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  searchContainer: {
    padding: 10,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 0 40px 0 rgb(0,0,0, 7%)',
    padding: 12,
    marginBottom: 8,
    fontSize: 12,
    color:'424242',
    fontWeight:'400',
  },
  section: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 15,
    color:'#424242',
    marginBottom:'10px',
  },
  category: {
    alignItems: 'center',
    marginRight: 20,
    justifyContent:'space-between',
    marginTop:'10px',
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 6,
    fontWeight: '400',
    color:'#424242',
  },
  service: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    // padding: 10,
    alignItems: 'flex-start',
    marginTop:'30',

  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '400',
    color:'378CCF',
    marginLeft:'5px',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    paddingBottom:10,
  },
  serviceTitle: {
    fontSize: 10,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft:10,
  },
  servicePrice: {
    fontSize: 12,
    color: '#000',
    marginTop: 5,
    fontWeight: 'bold',
    textAlign:'left',
    paddingLeft:10,
  },
  bookNow: {
    color: '#378CCF',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 8,
    textDecoration: 'underline',
    textDecorationColor: '#378CCF',
    position: 'relative',
  },
   banner: {
   alignItems: 'left',
   margin:'10px',
   marginBottom:'15px',
   borderRadius:'10',
  },
  bannerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft:'10px',
    marginTop:'15px',
  },
  bannerSubtext: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    marginLeft:'10px',
 
  },
  contactButton: {
    backgroundColor: '#fff',
    padding:8,
    borderRadius: 5,
    width:'90px',
    height:'26px',
    textAlign:'center',
    marginLeft:'10px',
   
   
  },
  contactButtonText: {
    color: '#378CCF',
    fontWeight: 'bold',
    fontSize: '8px',
    textAlign:'center',
  textDecorationStyle:'underline',
  },
});

export default Home