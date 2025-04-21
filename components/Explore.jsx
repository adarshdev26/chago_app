import { 
  View, ActivityIndicator, Text, StyleSheet, FlatList, 
  TouchableOpacity, SafeAreaView 
} from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const flatListRef = useRef(null); // Reference for FlatList
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    //setLoading(true)
    const interval = setInterval(async () => {
      try {
        const data = await AsyncStorage.getItem('wishlist');
        console.log(data)
        if (data !== null) {
          //setLoading(false)
          setWishlist(JSON.parse(data));
        }
      } catch (error) {
       // setLoading(false)
        console.error('Error reading wishlist', error);
      }
    }, 3000); // Fetches every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('https://chago.in/wp-json/my-api/v1/get_categories/');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const result = await response.json();
        console.log(result);
        if (result.success) {
          const updatedCategories = result.data.map((category) => ({
            id: category.term_id,
            name: category.name.replace(/&amp;/g, "&"),
            image: { uri: category.image_url },
          }));
          setCategories(updatedCategories);
        } else {
          throw new Error('Failed to fetch categories data');
        }
      } catch (err) {
        setCategoriesError(err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);



   // Function to toggle wishlist
   const toggleWishlist = async (item) => {
    try {
      const data = await AsyncStorage.getItem('wishlist');
      let currentWishlist = data ? JSON.parse(data) : [];
  
      let updatedWishlist;
      if (currentWishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
        // Remove item if it exists
        updatedWishlist = currentWishlist.filter((wishlistItem) => wishlistItem.id !== item.id);
      } else {
        // Add new item while keeping the previous ones
        updatedWishlist = [...currentWishlist, item];
      }
  
      setWishlist(updatedWishlist);
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Error updating wishlist', error);
    }
  };
  


  const handleCategoryPress = (id) => {
    //onsole.log(id, 'this is id');
    router.push(`/subcategories?id=${id}`);
  };

  const scrollToTop = ()=> {
    if(flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }

  console.log(categories,'this is categories')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Explore</Text>
      {categoriesLoading ? (
        <ActivityIndicator size="large" color="#378CCF" />
      ) : categoriesError ? (
        <Text style={styles.errorText}>{categoriesError}</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryCard} >
              <Image
                source={item.image}
                style={styles.categoryIcon}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
              <Text style={styles.categoryText}>{item.name || 'Unknown'}</Text>

              {/* Wishlist Button */}
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={() => toggleWishlist(item)}
              >
                <Text style={styles.wishlistText}>
                  {wishlist.some((wishlistItem) => wishlistItem.id === item.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>

              {/* View service button */}
              <TouchableOpacity style={styles.viewServiceButton} onPress={() => handleCategoryPress(item.id)}>
                <Text style={styles.viewServiceText}>View Services</Text>
              </TouchableOpacity>

            </TouchableOpacity>
          )}
          numColumns={2} 
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            setShowBackToTop(offsetY > 200);
          }}
        />
      )}

      {showBackToTop && (
        <TouchableOpacity style={styles.backToTopButton} onPress={scrollToTop}>
          <Text style={styles.backToTopText}>↑ Back to Top</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,  // Add margin between columns
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
    flexDirection: 'column',
    alignItems: 'center',
    width: '45%',  // Ensures that two items fit in a row
  },
  categoryIcon: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10, // Space between image and text
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#378CCF',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  viewServiceButton: {
    marginTop: 20,
    backgroundColor: '#378CCF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  viewServiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  backToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#378CCF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backToTopText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Index;
