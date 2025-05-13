export const isTokenExpired = (token) => {
  if (!token) {
    console.log('No token provided to isTokenExpired');
    return true;
  }
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log('Token expiration check:', {
      expirationTime: exp,
      currentTime: currentTime,
      isExpired: exp < currentTime,
      timeLeft: exp - currentTime
    });
    
    return exp < currentTime;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return true;
  }
}; 