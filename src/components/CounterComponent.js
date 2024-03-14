// src/components/CounterComponent.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/actions';

const CounterComponent = ({ counter }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    console.log('handle increment 1')
    dispatch(increment());
    console.log('handleIncrement 2')
    };

  const handleDecrement = () => {
    dispatch(decrement());
    console.log('handleDecrement')
  };

  return (
    <View style={{
      alignItems:'center'
    }}>
      <Text style={{
        fontSize:40
      }}>Counter: {counter}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  counter: state.counter,
});

export default connect(mapStateToProps)(CounterComponent);



