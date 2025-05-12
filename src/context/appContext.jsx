import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component to wrap the application and provide the context
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Selected user
  const [city, setCity] = useState(null);           // Selected city
  const [vehicle, setVehicle] = useState(null);     // Selected vehicle
  const [loading, setLoading] = useState(false);    // Loading state

  // Set user
  const selectUser = (selectedUser) => {
    setUser(selectedUser);
  };

  // Set city
  const selectCity = (selectedCity) => {
    setCity(selectedCity);
  };

  // Set vehicle
  const selectVehicle = (selectedVehicle) => {
    setVehicle(selectedVehicle);
  };

  // Set loading state
  const setAppLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        city,
        vehicle,
        loading,
        selectUser,
        selectCity,
        selectVehicle,
        setAppLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
