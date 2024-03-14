import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {defaultHeaderOption} from '../constants/defaultHeaderOption';
import ForgotPassword from '../screens/authentication/ForgotPassword';
import Login from '../screens/authentication/Login';
import AccountVerification from '../screens/authentication/AccountVerification';
import SignUp from '../screens/authentication/SignUp';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        ...defaultHeaderOption,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="forgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="accountVerification"
        component={AccountVerification}
      />
      <Stack.Screen name="signUp" component={SignUp} />
    </Stack.Navigator>
  );
}
