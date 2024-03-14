// MainScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import ProductList from './ProductList';

const MainScreen = () => {
  return (
    <View>
      <Text>Welcome to the E-commerce App!</Text>
      <ProductList />
      {/* Add other components or sections as needed */}
    </View>
  );
};

export default MainScreen;
