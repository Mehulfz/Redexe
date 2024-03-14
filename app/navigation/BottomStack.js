/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import queryString from 'query-string';
import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {getProduct} from '../actions';
import assets from '../assets';
import colors from '../constants/colors';
import {defaultHeaderOption} from '../constants/defaultHeaderOption';
import env from '../constants/env';
import MyCart from '../screens/checkout/MyCart';
import MyAccount from '../screens/dashboard/account/MyAccount';
import Home from '../screens/dashboard/Home';
import MyWishlist from '../screens/dashboard/MyWishlist';
import ProductDetails from '../screens/Product/ProductDetails';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

export default function BottomStack({navigation}) {
  const dispatch = useDispatch();
  const {cartProducts, wishlistProducts} = useSelector(({product}) => product);
  useEffect(() => {
    dynamicLinks().onLink(_dynamicLink); // Foreground events
    dynamicLinks().getInitialLink().then(_dynamicLink); // Foreground events
  }, []);

  const _dynamicLink = async (link) => {
    try {
      if (!link) {
        return;
      }
      const parsed = queryString.parseUrl(link.url);
      if (parsed?.query?.id) {
        let res = await dispatch(getProduct(parsed?.query?.id));
        if (res?.status) {
          navigation?.push('productDetails');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: colors.darkGray,
        labelStyle: {
          fontFamily: env.fontRegular,
          fontSize: moderateScale(10),
          marginTop: moderateScale(-5),
          marginBottom: moderateScale(5),
        },
      }}>
      <Tab.Screen
        name="home"
        component={HomeNavigation}
        options={{
          title: 'Home',
          tabBarIcon: (props) => <TabIcon icon={assets.home_ic} {...props} />,
        }}
      />
      <Tab.Screen
        name="myCart"
        component={MyCart}
        options={{
          title: 'Cart',
          tabBarIcon: (props) => (
            <TabIcon
              icon={assets.cart_ic}
              {...props}
              budge={cartProducts?.cart_count}
            />
          ),
        }}
      />
      <Tab.Screen
        name="myWishlist"
        component={MyWishlist}
        options={{
          title: 'Wishlist',
          tabBarIcon: (props) => (
            <TabIcon
              icon={assets.hart_icon}
              {...props}
              budge={wishlistProducts?.length}
            />
          ),
        }}
      />
      <Tab.Screen
        name="myAccount"
        component={MyAccount}
        options={{
          title: 'Account',
          tabBarIcon: (props) => (
            <TabIcon icon={assets.account_ic} {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        ...defaultHeaderOption,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <HomeStack.Screen name="home" component={Home} />
      <HomeStack.Screen name="productDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
};

function TabIcon({icon, color, budge}) {
  return (
    <View>
      <Image
        source={icon}
        style={{
          width: moderateScale(20),
          height: moderateScale(20),
          resizeMode: 'contain',
          tintColor: color,
        }}
      />
      {budge ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: colors.red,
            height: ms(16),
            width: ms(16),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: ms(12),
            right: ms(-8),
            top: ms(-3),
            zIndex: 1,
          }}>
          <Text
            adjustsFontSizeToFit
            style={{
              fontSize: ms(12),
              fontFamily: env.fontRegular,
              color: colors.white,
            }}>
            {budge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
