import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import colors from '../constants/colors';
import env from '../constants/env';

export default function EmptyList({message, isLoading, containStyle, bottom}) {
  return (
    <View style={[styles.root, containStyle]}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : (
        <Text style={styles.messageText}>{message}</Text>
      )}
      <View style={{height: moderateScale(20)}} />
      {bottom}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
    fontFamily: env.fontRegular,
  },
});
