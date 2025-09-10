// src/hooks/useCon.js
"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

const useCon = () => {
  const [config, setConfig] = useState({
    termsAndConditions: '',
    deliveryCharge: 0,
    deliveryChargeInsideDhaka: 0,
    deliveryChargeOutsideDhaka: 0,
    taxRate: 0,
    storeName: '',
    contactEmail: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await axios.get('https://cosmetics-server-001.vercel.app/api/get-configuration');
        const data = response.data;
        setConfig({
          termsAndConditions: data.termsAndConditions,
          deliveryCharge: data.deliveryCharge,
          deliveryChargeInsideDhaka: data.deliveryChargeInsideDhaka,
          deliveryChargeOutsideDhaka: data.deliveryChargeOutsideDhaka,
          taxRate: data.taxRate,
          storeName: data.storeName,
          contactEmail: data.contactEmail,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []);

  return { config, loading, error };
};

export default useCon;
