// ProductList.js
import React, { useContext } from 'react';
import { View, Button, Text } from 'react-native';
import { CartContext } from './CartContext';

const ProductList = () => {
  const { dispatch } = useContext(CartContext);

  const product = { id: 1, name: 'hekkk Product', price: 9.99 }; // Replace with your actual product data

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

export default ProductList;
