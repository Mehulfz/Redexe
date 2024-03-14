import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, ms, scale} from 'react-native-size-matters';
import assets from '../assets';
import colors from '../constants/colors';
import env from '../constants/env';

export default function Header({
  title,
  rightActions,
  leadAction,
  center = false,
  isBack,
}) {
  const navigation = useNavigation();
  return (
    <View style={{backgroundColor: colors.primary}}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView />
      <View style={styles.header}>
        <View
          style={[
            styles.row,
            center && {justifyContent: 'space-between', flex: 1},
          ]}>
          {isBack ? (
            <TouchableOpacity
              onPress={navigation.goBack}
              style={{padding: moderateScale(15)}}>
              <Image source={assets.backArrow} style={styles.backIc} />
            </TouchableOpacity>
          ) : leadAction ? (
            leadAction
          ) : (
            <View style={{width: 15}} />
          )}
          {title ? (
            <Text
              numberOfLines={1}
              style={[styles.headerTitle, center && {textAlign: 'center'}]}>
              {title}
            </Text>
          ) : (
            <Image
              source={assets.logo_hor}
              style={{width: ms(120)}}
              resizeMode="contain"
            />
          )}
          {center && <View style={{width: 40}} />}
        </View>
        {rightActions}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    height: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: env.fontSemibold,
    fontSize: 16,
    color: colors.white,
    flex: 1,
  },
  backIc: {
    resizeMode: 'contain',
    height: moderateScale(25),
    width: moderateScale(25),
  },
});
