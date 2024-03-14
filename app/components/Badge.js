import React from 'react';
import {Text, View} from 'react-native';
import colors from '../constants/colors';
import env from '../constants/env';

export function Badge({size = 24, amount}) {
  if (!amount) return null;
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        borderRadius: 30,
        height: size,
        minWidth: size,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
          width: 3,
          height: 3,
        },
        elevation: 18,
        shadowOpacity: 0.34,
        shadowRadius: 6,
      }}>
      <Text
        style={{
          fontFamily: env.fontSemibold,
          color: colors.white,
          fontSize: size * 0.6,
        }}>
        {amount}
      </Text>
    </View>
  );
}
