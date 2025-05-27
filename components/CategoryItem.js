import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const CategoryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.category} onPress={() => onPress(item.id)}>
    <Image source={item.image} style={styles.categoryIcon} />
    <Text style={styles.categoryText}>{item.name || 'Unknown'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  category: { marginHorizontal: 8, paddingVertical:5, alignItems:'center' },
  categoryIcon: { width: 50, height: 50, marginLeft:15 },
  categoryText: { fontSize: 10, textAlign: 'center' },
});
