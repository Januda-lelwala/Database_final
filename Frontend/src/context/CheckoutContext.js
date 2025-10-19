import React, { createContext, useContext, useState, useMemo } from 'react';

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const value = useMemo(() => ({
    destinationCity,
    setDestinationCity,
    destinationAddress,
    setDestinationAddress,
    deliveryDate,
    setDeliveryDate,
    processing,
    setProcessing,
    error,
    setError,
    orderSuccess,
    setOrderSuccess,
  }), [destinationCity, destinationAddress, deliveryDate, processing, error, orderSuccess]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within a CheckoutProvider');
  return ctx;
}
