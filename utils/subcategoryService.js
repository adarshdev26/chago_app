// services/subcategoryService.js
export const fetchSubCategories = async (id) => {
    try {
        const response = await fetch('https://chago.in/wp-json/my-api/v1/get_sub_categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        if (result.success === 'false') {
            throw new Error(result.message || 'No subcategories available');
        }

        return result.data;
    } catch (error) {
        throw error;
    }
};
