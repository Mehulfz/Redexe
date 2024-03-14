import { useTheme } from '@react-navigation/native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';


const Placeholder = createShimmerPlaceholder(LinearGradient);

export const ShimmerPlaceHolder = props => {
  const {theme} = useTheme();

  const shimmerColors = <theme className="isDark"></theme>

    ['#F8F8F8', '#F5F5F5', '#F0F0F0'];

  return (
    <Placeholder duration={2000} shimmerColors={shimmerColors} {...props} />
  );
};