
export const setUserStorage = (email: string, name: string, isAdmin: boolean) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  
  if (isAdmin) {
    localStorage.setItem('isAdmin', 'true');
  }
};

export const clearUserStorage = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('isAdmin');
};

export const checkIsAdmin = (email: string): boolean => {
  return email === 'admin@easyearn.us';
};
