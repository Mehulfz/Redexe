// App.js
import React, { useState } from 'react';
import {View, TextInput} from 'react-native'
const App = () => {
    const [data, setData] = useState


  return (
    <View>
      <TextInput placeholder='Enter name'/>
    </View>
  );
};

export default App;
