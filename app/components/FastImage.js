import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ms} from 'react-native-size-matters';
import Image from 'react-native-fast-image';
import colors from '../constants/colors';
import {ShimmerPlaceHolder} from './ShimmerPlaceHolder';

export const FastImage = (props) => {
  const [IsLoaded, setIsLoaded] = useState(false);
  const {contentStyle, source,...others} = props;

  return (
    <View style={contentStyle}>
      <Image
        source={source}
        style={styles.itemImage}
        onLoadEnd={() => setIsLoaded(true)}
        {...others}
      />
      {!IsLoaded ? (
        <ShimmerPlaceHolder style={styles.imagePlaceholder} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  imagePlaceholder: {
    height: '100%',
    width: '100%',
  },
});
