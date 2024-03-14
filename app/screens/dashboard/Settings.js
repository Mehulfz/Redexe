import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import {InputSelection} from '../../components/Inputs';
import colors from '../../constants/colors';
import env from '../../constants/env';

function Settings({navigation}) {
  return (
    <View style={styles.root}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={{flex: 1, padding: 20}}>
        <View style={{height: 15}} />
        <InputSelection
          title="Country "
          placeholder="Select"
          containStyle={{
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
        />
        <View style={{height: 15}} />
        <InputSelection
          title="Language  "
          placeholder="Select"
          containStyle={{
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
        />
        <View style={{height: 15}} />
        <InputSelection
          title="Currency"
          placeholder="INR"
          containStyle={{
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
        />
         <View style={{height: 30}} />
        <TouchableOpacity style={{paddingVertical: 5}}>
          <Text style={styles.linkText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{paddingVertical: 5}}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRightText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: env.fontRegular,
    marginHorizontal: 15,
  },
  linkText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: env.fontMedium,
    textDecorationLine: 'underline',
  },
});
