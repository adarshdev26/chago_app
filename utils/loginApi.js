// authApi.js
export async function loginUser({ identifier, password, token }) {
    try {
      const response = await fetch('https://chago.in/wp-json/my-api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, token }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  }
  