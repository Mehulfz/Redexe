import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import StepIndicator from 'react-native-step-indicator';
import assets from '../assets';
import {ORDER_STATUS_COLORS} from '../constants';
import env from '../constants/env';

export const OrderStatusIndicator = ({indicatorIndex, labels = []}) => {
  const renderLabel = ({label, position}) => {
    const isActive = indicatorIndex >= position;
    return (
      <View>
        <Text
          style={[
            styles.indicatorText,
            isActive && {color: ORDER_STATUS_COLORS[position]},
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  const renderStepIndicator = ({position}) => {
    const isActive = indicatorIndex >= position;
    return (
      <View
        style={[
          styles.indicatorCircle,
          isActive && {backgroundColor: ORDER_STATUS_COLORS[position]},
        ]}>
        {isActive ? (
          <Image source={assets.checkIcon} style={styles.checkIcon} />
        ) : null}
      </View>
    );
  };

  const step = labels.length;

  return (
    <View style={{height: moderateScale(60 * step)}}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={indicatorIndex}
        labels={labels}
        stepCount={step}
        direction="vertical"
        renderLabel={renderLabel}
        renderStepIndicator={renderStepIndicator}
      />
    </View>
  );
};

const customStyles = {
  separatorStrokeWidth: moderateScale(1),
  stepIndicatorSize: moderateScale(30),
  currentStepIndicatorSize: moderateScale(30),
  stepStrokeWidth: 0,
  currentStepStrokeWidth: 0,
};

const styles = StyleSheet.create({
  indicatorText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: '#C5CEE0',
    width: moderateScale(150),
    marginLeft: moderateScale(20),
  },
  indicatorCircle: {
    backgroundColor: '#C5CEE0',
    height: moderateScale(40),
    width: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
    resizeMode: 'contain',
  },
});
