import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../constants/colors';
import {FastImage} from './FastImage';
import {LightViewGallery} from './LightViewGallery';
import {Player} from './Player';

const {width, height} = Dimensions.get('screen');

export default function ProductImageSlider({images = [], video}) {
  const IsFocused = useIsFocused();
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightView, showLightView] = useState(false);
  const [lightViewIndex, showLightViewIndex] = useState(0);
  const _carousel = useRef();

  if (video) {
    images = [{isVideo: true, uri: video}, ...images];
  }

  const _showLightView = (item, index) => {
    showLightView(true);
    showLightViewIndex(index);
  };

  const _renderItem = ({item, index}) => {
    if (item?.isVideo) {
      return (
        <View style={styles.slide}>
          <Player
            source={{uri: item?.uri}}
            active={IsFocused ? activeSlide === index : false}
          />
        </View>
      );
    }
    return (
      <Pressable
        style={styles.slide}
        onPress={() => _showLightView(item, index)}>
        <FastImage
          source={{uri: item?.ImageLink}}
          contentStyle={styles.banner}
          resizeMode={'contain'}
        />
      </Pressable>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => _carousel.current.snapToItem(index)}>
        {item?.isVideo ? (
          <Icon name="play-circle" size={ms(24)} />
        ) : (
          <FastImage
            source={{uri: item?.ImageLink}}
            contentStyle={{height: ms(30), width: ms(30)}}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {!images?.length ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <Carousel
            ref={_carousel}
            data={images}
            renderItem={_renderItem}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={setActiveSlide}
          />
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            style={{marginLeft: ms(10)}}
          />
        </>
      )}

      <LightViewGallery
        isVisible={lightView}
        onClose={() => showLightView(false)}
        data={images}
        defaultIndex={lightViewIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.lighter,
    flex: 1,
    paddingBottom: ms(10),
    // height: BANNER_HEIGHT,
  },
  slide: {
    borderWidth: ms(1),
    borderRadius: ms(10),
    padding: ms(10),
    borderColor: colors.Gray,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginHorizontal: ms(15),
    marginTop: ms(15),
    height: height * 0.4,
  },
  item: {
    width: ms(45),
    height: ms(45),
    marginVertical: ms(10),
    marginLeft: ms(5),
    borderWidth: ms(1),
    borderColor: colors.Gray,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
