const useAuth = () => {
  const user = localStorage.getItem('user'); // Adjust according to your authentication logic
  return user != null;
};

export default useAuth;
