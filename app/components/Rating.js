import React from 'react';
import {Image, View} from 'react-native';
import assets from '../assets';
import colors from '../constants/colors';

export default function Rating({value, size = 16}) {
  let color = '#FFC107';
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <Image
        source={assets.star}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          tintColor: value >= 1 ? '#FFC107' : colors.Gray,
        }}
      />
      <Image
        source={assets.star}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          tintColor: value >= 2 ? '#FFC107' : colors.Gray,
        }}
      />
      <Image
        source={assets.star}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          tintColor: value >= 3 ? '#FFC107' : colors.Gray,
        }}
      />
      <Image
        source={assets.star}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          tintColor: value >= 4 ? '#FFC107' : colors.Gray,
        }}
      />
      <Image
        source={assets.star}
        style={{
          resizeMode: 'contain',
          height: size,
          width: size,
          tintColor: value >= 5 ? '#FFC107' : colors.Gray,
        }}
      />
    </View>
  );
}
