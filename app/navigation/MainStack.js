import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {defaultHeaderOption} from '../constants/defaultHeaderOption';
import ChangePassword from '../screens/dashboard/account/ChangePassword';
import ManageAddress from '../screens/dashboard/account/Address/ManageAddress';
import Categories from '../screens/dashboard/Categories';
import MyOrders from '../screens/dashboard/orders/MyOrders';
import Profile from '../screens/dashboard/Profile';
import Coupons from '../screens/dashboard/account/PromotionalCoupons';
import ProductDetails from '../screens/Product/ProductDetails';
import ProductList from '../screens/Product/ProductList';
import SplashView from '../screens/SplashView';
import AuthStack from './AuthStack';
import BottomStack from './BottomStack';
import {navigationRef} from './RootNavigation';
import EditProfile from '../screens/dashboard/account/EditProfile';
import RefundPayments from '../screens/dashboard/account/Payment/RefundPayments';
import AddRefundPayment from '../screens/dashboard/account/Payment/AddRefundPayment';
import SellerFeedback from '../screens/dashboard/account/SellerFeedback';
import SetGST from '../screens/dashboard/account/SetGST';
import ConfirmOrder from '../screens/checkout/ConfirmOrder';
import OrderDetails from '../screens/dashboard/orders/OrderDetails';
import {DisputeDetails} from '../screens/dashboard/orders/DisputeDetails';
import ShippingDetails from '../screens/dashboard/orders/ShippingDetails';
import ApplyCoupon from '../screens/checkout/Coupon';
import DeliveryLocation from '../screens/dashboard/account/Address/deliveryLocation';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="splashScreen"
        screenOptions={{
          ...defaultHeaderOption,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="splashScreen" component={SplashView} />
        <Stack.Screen name="auth" component={AuthStack} />

        <Stack.Screen name="dashboard" component={BottomStack} />
        <Stack.Screen name="categories" component={Categories} />

        <Stack.Screen name="productList" component={ProductList} />
        <Stack.Screen name="productDetails" component={ProductDetails} />

        <Stack.Screen name="confirmOrder" component={ConfirmOrder} />
        <Stack.Screen name="orderDetails" component={OrderDetails} />
        <Stack.Screen name="deliveryLocation" component={DeliveryLocation} />

        {/* ACCOUNT */}
        <Stack.Screen name="editProfile" component={EditProfile} />
        <Stack.Screen name="myOrders" component={MyOrders} />
        <Stack.Screen name="promotionalCoupons" component={Coupons} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="manageAddress" component={ManageAddress} />
        <Stack.Screen name="changePassword" component={ChangePassword} />
        <Stack.Screen name="refundPayments" component={RefundPayments} />
        <Stack.Screen name="addRefundPayment" component={AddRefundPayment} />
        <Stack.Screen name="sellerFeedback" component={SellerFeedback} />
        <Stack.Screen name="setGST" component={SetGST} />
        <Stack.Screen name="disputeDetails" component={DisputeDetails} />
        <Stack.Screen name="shippingDetails" component={ShippingDetails} />
        <Stack.Screen name="applyCoupons" component={ApplyCoupon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
