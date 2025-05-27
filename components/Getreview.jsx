import { TouchableOpacity, Text, Image, StyleSheet, FlatList, View , Modal, TextInput} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Getreview = ({ props }) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0); 
  const [reviewText, setReviewText] = useState("");
  const [resetmessage, setResetmessage] = useState('');
  const [error, setError] = useState("");
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bearerToken, setBearerToken] = useState(null)
  const productId = props;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://chago.in/wp-json/my-api/v1/get_reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success === true && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        console.error(result.message || "Failed to load reviews.");
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  


  // session storage data
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await AsyncStorage.getItem('logindetails');
        if (data !== null) {
          const result = JSON.parse(data);
          setEmail(result.data.email);
          setName(result.data.firstname);
          setBearerToken(result.data.token)
        }
      } catch (error) {
       
        console.error('Error reading value', error);
      }
    };

    getData();
  }, []);



  // write review api
  const submitReviewhandler = async () => {
    if (reviewText.trim() === "") {
      setError("Review cannot be empty.");
      return;
    }
  
    setError("");
    try {
      setLoading(true);
      const response = await fetch("https://chago.in/wp-json/my-api/v1/write_review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // NOTE: space after 'Bearer'
        },
        body: JSON.stringify({
          product_id: productId,
          review_content: reviewText,
          review_rating: selectedStars,
          reviewer_email: email,
          review_name: name,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success === true) {
        setResetmessage(result.message);
        setModalVisible(false);
        setReviewText(""); // reset form
        setSelectedStars(0); // reset stars if needed
        fetchReviews(); // 🔁 fetch the latest reviews here
      } else {
        console.error(result.message || "Review submission failed.");
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
    <Image
  source={item.image ? { uri: item.image } : null}
  style={styles.reviewImage}
/>
      {/* <Image source={{ uri: item.image }} style={styles.reviewImage} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.reviewTitle}>{item.title}</Text>
        <Text style={styles.reviewContent}>{item.content}</Text>
        <Text style={styles.reviewerName}>- {item.reviewer}</Text>
        <Text style={styles.reviewRating}>{item.rating} stars</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
    </View>
  );


  const reviewsToShow = showAll ? data : data.slice(0, 1);

  return (
    <>
      <Text style={styles.text}>Reviews:</Text>
      {data.length > 0 ? (
        <>
          <FlatList
            data={reviewsToShow}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          {data.length > 2 && (
           <>
           <View style={styles.reviewbuttons}>
           <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowAll((prev) => !prev)}
            >
              <Text style={styles.seeAllButtonText}>{showAll ? "View Less" : "View All"}</Text>
            </TouchableOpacity>
{/* 
            <TouchableOpacity style={styles.writereview}  onPress={() => setModalVisible(true)}>
              <Text style={styles.seeAllreview}>
                Write a review
              </Text>
            </TouchableOpacity> */}
           </View>
         

            {/* modal */}

           </>
          )} 
        </>
      ) : (
        <Text style={{textAlign:'center', marginVertical:15}}>No reviews available.</Text>
      )}

          <TouchableOpacity style={styles.writereview}  onPress={() => setModalVisible(true)}>
              <Text style={styles.seeAllreview}>
                Write a review
              </Text>
            </TouchableOpacity>

                 {/* Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >

  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
    {resetmessage ? (<Text>{resetmessage}</Text>): (
      <>
      <Text style={styles.modalTitle}>Submit your review</Text>

      {/* Star Rating */}
      <Text style={styles.modalTitle}>Rating:</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedStars(star)}
          >
            <MaterialIcons
              name={star <= selectedStars ? "star" : "star-border"}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Input */}
      <TextInput
 
        style={styles.input}
        placeholder="Write your review here..."
        multiline={true}
        value={reviewText}
        onChangeText={setReviewText}
      />
      {error?(<Text style={styles.errortext}>{error}</Text>) : null}

      {/* Modal Actions */}
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitReviewhandler}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      </>
    )}
    </View>
  </View>
</Modal>


    </>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    color: "#000", // Black text
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  reviewContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  reviewContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  reviewRating: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 11,
    color: "#999",
  },
  seeAllButton: {
    backgroundColor: "#007BFF",
  padding:10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    width:100,
    
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  writereview:{
    width: '80%',
    alignSelf:'center',
    backgroundColor:'#3032a2',
    padding:10,
    borderRadius: 8,
    margin:5,
    alignItems: "center",

   
  },
  seeAllreview: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  seeAllreview: {
    color: '#fff',
    fontSize: 16,
  },
  errortext:{
    color:'red',
    fontSize:14,
    textAlign:'center',
    marginBottom:20
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },

  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },

  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  starContainer: {
  flexDirection: "row",
  marginVertical: 10,
  justifyContent: "center",
},
reviewbuttons:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center'
}
});

export default Getreview;
