import { useEffect, useState } from 'react';
import { fetchCategories } from '../utils/categories';

const desiredSlugs = [
  'carpenter_services',
  'painter',
  'plumber',
  'electrical',
  'ac-technician',
  'to-let-services',
];

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const filtered = data.filter(cat => desiredSlugs.includes(cat.slug));
        setCategories(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};
