import { FlatList, Text, ActivityIndicator } from 'react-native';
import { CategoryItem } from './CategoryItem';

export const CategoryList = ({ data, loading, error, onPress }) => {
  if (loading) return <ActivityIndicator size="large" color="#378CCF" />;
  if (error) return <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>;

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CategoryItem item={item} onPress={onPress} />}
      nestedScrollEnabled={true}
      showsHorizontalScrollIndicator={false}
    />
  );
};
