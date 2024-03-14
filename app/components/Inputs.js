import React, {useEffect, useRef, useState} from 'react';
import {Text, TextInput, View, TouchableOpacity, Image} from 'react-native';
import {moderateScale, ms, scale} from 'react-native-size-matters';
import colors from '../constants/colors';
import env from '../constants/env';
import Selection from './Selection';
import assets from '../assets';
import {FloatingTextInput} from '../utils/lib/FloatingTextInput';

export function Input({
  title,
  placeholder,
  value,
  onChangeText,
  containStyle,
  ...other
}) {
  return (
    <>
      <Text
        style={{
          color: colors.primary,
          fontFamily: env.fontMedium,
          fontSize: moderateScale(14),
          marginBottom: moderateScale(6),
        }}>
        {title}
      </Text>
      <View
        style={[
          {
            borderColor: colors.lightGray,
            borderWidth: 1,
            borderRadius: 30,
            paddingVertical: 0,
            paddingHorizontal: 15,
            height: 50,
            justifyContent: 'center',
          },
          containStyle,
        ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.darkGray}
          value={value}
          onChangeText={onChangeText}
          style={{
            fontFamily: env.fontRegular,
            fontSize: 14,
            color: colors.darkGray,
          }}
          {...other}
        />
      </View>
    </>
  );
}

export function InputSelection({
  title,
  placeholder,
  value,
  onChangeText,
  options = [],
  containStyle,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      {title ? (
        <Text
          style={{
            color: colors.primary,
            fontFamily: env.fontMedium,
            fontSize: moderateScale(14),
            marginBottom: moderateScale(6),
          }}>
          {title}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[
          {
            borderColor: colors.lightGray,
            borderWidth: 1,
            borderRadius: 30,
            paddingVertical: 0,
            paddingHorizontal: 15,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
          },
          containStyle,
        ]}>
        <Text
          style={{
            fontFamily: env.fontRegular,
            fontSize: 14,
            color: colors.darkGray,
            flex: 1,
          }}>
          {value || placeholder}
        </Text>
        <Image
          source={assets.arrow_down_ic}
          style={{
            width: 12,
            height: 12,
            resizeMode: 'contain',
            marginLeft: 10,
            tintColor: colors.darkGray,
          }}
        />
      </TouchableOpacity>
      <Selection
        isVisible={isVisible}
        close={() => setIsVisible(false)}
        style={{borderRadius: 5}}
        popupTitle={placeholder}
        data={options}
        onSelect={onChangeText}
      />
    </>
  );
}

export function SearchInput({
  title,
  placeholder,
  value,
  onChangeText,
  containStyle,
  right,
  ...other
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: 10,
          paddingVertical: 0,
          paddingHorizontal: 15,
          // justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          height: scale(35),
        },
        containStyle,
      ]}>
      <Image
        source={assets.search_icon}
        style={{
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.darkGray,
          marginRight: 15,
        }}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        style={{
          fontFamily: env.fontRegular,
          fontSize: 14,
          color: colors.darkGray,
          paddingVertical: 0,
          flex: 1,
        }}
        {...other}
      />
      {right}
    </View>
  );
}

export function InputV2({title, placeholder, value, onChangeText, ...other}) {
  return (
    <>
      <FloatingTextInput
        title={title}
        titleStyle={{
          color: colors.black,
          fontFamily: env.fontRegular,
          fontSize: moderateScale(10),
        }}
        placeholder={placeholder}
        placeholderTextColor="#747B81"
        value={value}
        onChangeText={onChangeText}
        style={{
          fontFamily: env.fontRegular,
          fontSize: ms(14),
          color: colors.black,
          paddingVertical: 0,
        }}
        {...other}
      />
    </>
  );
}

export function InputSelectionV2({
  title,
  placeholder,
  value,
  onChangeText,
  options = [],
  containStyle,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={() => setIsVisible(true)}>
        <InputV2
          title={title}
          placeholder={placeholder}
          value={value}
          editable={false}
        />
      </TouchableOpacity>
      <Selection
        isVisible={isVisible}
        close={() => setIsVisible(false)}
        style={{borderRadius: 5}}
        popupTitle={placeholder}
        data={options}
        onSelect={onChangeText}
      />
    </>
  );
}
