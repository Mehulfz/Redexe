import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import colors from '../constants/colors';

const {width, height} = Dimensions.get('screen');

export default function MainSlider() {
  const data = [
    'https://glst.in/public/assets/images/featured/galaxy.jpg',
    'https://glst.in/public/assets/images/featured/outer_hexa.jpg',
    'https://glst.in/public/assets/images/featured/veg_cutting.jpg',
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Image
          source={{
            uri: item,
          }}
          resizeMode="stretch"
          style={{height: height * 0.25}}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={setActiveSlide}
      />
      <View style={styles.dotArea}>
        <Pagination
          dotsLength={data?.length || 0}
          activeDotIndex={activeSlide}
          dotStyle={styles.dotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: -5,
  },
  slide: {
    // marginHorizontal: 5,
    // borderRadius: 10,
    overflow: 'hidden',
  },
  dotArea: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: -5,
    backgroundColor: colors.primary,
  },
});
