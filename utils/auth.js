export function isUserLoggedIn() {
    // Replace this with your actual authentication logic
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }