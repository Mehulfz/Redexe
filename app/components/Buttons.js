import React from 'react';
import {TouchableOpacity, Text, Image, ActivityIndicator} from 'react-native';
import colors from '../constants/colors';
import {moderateScale, ms} from 'react-native-size-matters';
import env from '../constants/env';
import assets from '../assets';

export function Button({
  childers,
  title,
  containerStyle,
  titleStyle,
  isLoading,
  disabled,
  ...others
}) {
  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.primary,
          height: ms(50),
          borderRadius: 30,
        },
        containerStyle,
      ]}
      disabled={disabled}
      {...others}>
      {childers || (
        <>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Text
              style={[
                {
                  fontSize: moderateScale(14),
                  color: colors.white,
                  fontFamily: env.fontBold,
                },
                titleStyle,
              ]}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

export function ActionButton({onPress, containerStyle}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.primary,
          height: moderateScale(60),
          width: moderateScale(60),
          borderRadius: moderateScale(60),
          shadowColor: 'rgba(0,0,0,1)',
          shadowOffset: {
            width: 3,
            height: 3,
          },
          elevation: 18,
          shadowOpacity: 0.34,
          shadowRadius: 6,
          position: 'absolute',
          bottom: moderateScale(30),
          right: moderateScale(30),
        },
        containerStyle,
      ]}>
      <Image
        source={assets.plus}
        resizeMode="contain"
        style={{
          width: moderateScale(20),
          height: moderateScale(20),
          tintColor: colors.white,
        }}
      />
    </TouchableOpacity>
  );
}
