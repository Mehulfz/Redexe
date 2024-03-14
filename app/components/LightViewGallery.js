import React, {useRef, useState, useEffect} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ms} from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import {FastImage} from './FastImage';
import {Player} from './Player';

const {width, height} = Dimensions.get('screen');

export function LightViewGallery({isVisible, onClose, data, defaultIndex = 0}) {
  const {top} = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);

  const _lightCarousel = useRef();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => _lightCarousel.current?.snapToItem(defaultIndex), 250);
    }
  }, [defaultIndex, isVisible]);

  const _renderItem = ({item, index}) => {
    if (item?.isVideo) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.videoItem}>
            <Player
              source={{uri: item?.uri}}
              active={isVisible ? activeSlide === index : false}
              containStyle={{
                backgroundColor: colors.black,
                borderRadius: 0,
              }}
            />
          </View>
        </View>
      );
    }
    return (
      <FastImage
        source={{uri: item?.ImageLink}}
        contentStyle={styles.banner}
        resizeMode={'contain'}
      />
    );
  };

  return (
    <Modal isVisible={isVisible} style={styles.root} onBackButtonPress={onClose}>
      <View style={styles.contain}>
        <View style={{position: 'absolute', top, zIndex: 10}}>
          <TouchableOpacity style={{padding: ms(10)}} onPress={onClose}>
            <MaterialIcons name="close" color={colors.white} size={ms(24)} />
          </TouchableOpacity>
        </View>
        <Carousel
          ref={_lightCarousel}
          data={data}
          renderItem={_renderItem}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={setActiveSlide}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 0,
  },
  contain: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
  banner: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  videoItem: {
    height: height * 0.4,
  },
});
