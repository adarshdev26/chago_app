export const fetchCategories = async () => {
    const response = await fetch('https://chago.in/wp-json/my-api/v1/get_categories/');
    if (!response.ok) throw new Error('Failed to fetch categories');
    
    const result = await response.json();
    if (result.success) {
      return result.data.map((category) => ({
        id: category.term_id,
        name: category.name,
        image: { uri: category.category_icon_image_url },
        slug: category.slug,
      }));
    } else {
      throw new Error('Failed to fetch categories data');
    }
  };
  