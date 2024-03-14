import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import colors from '../constants/colors';
import Slider from '@react-native-community/slider';
import env from '../constants/env';
import {convertToTimer} from '../utils/arrayOperations';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Player = ({active, containStyle, ...props}) => {
  const {top} = useSafeAreaInsets();
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(true);
  const [control, showControl] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const timeoutRef = useRef();
  const playerRef = useRef();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setPlay(!active);
  }, [active]);

  useEffect(() => {
    _controlTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const _controlTimer = () => {
    showControl(!control);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      showControl(false);
    }, 30000);
  };

  const _handleProgress = (data) => {
    setProgress(data.currentTime);
  };

  const _seekVideo = (data) => {
    playerRef.current.seek(data);
  };

  const renderControls = () => {
    if (!control) return null;
    return (
      <View style={{position: 'absolute', width: '100%', bottom: 0}}>
        <View
          style={[
            styles.controls,
            fullscreen && {
              backgroundColor: 'rgba(255,255,255,0.3)',
              marginHorizontal: ms(10),
            },
          ]}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setPlay(!play)}>
            <Icon
              name={!play ? 'pause' : 'play-arrow'}
              size={ms(24)}
              color={colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setMute(!mute)}>
            <Icon
              name={!mute ? 'volume-up' : 'volume-mute'}
              size={ms(24)}
              color={colors.white}
            />
          </TouchableOpacity>
          <Slider
            value={progress}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.white}
            maximumTrackTintColor={colors.black}
            style={{flex: 1}}
            onSlidingComplete={_seekVideo}
          />
          <Text style={styles.timerText}>{convertToTimer(progress)}</Text>
          <TouchableOpacity
            style={styles.fullButton}
            onPress={() => setFullscreen(!fullscreen)}>
            <Icon
              name={!fullscreen ? 'open-in-full' : 'close-fullscreen'}
              size={ms(18)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPlayer = () => {
    return (
      <Pressable
        style={[
          styles.root,
          containStyle,
          fullscreen && {backgroundColor: colors.black, borderRadius: 0},
        ]}
        onPress={_controlTimer}>
        <Video
          ref={playerRef}
          resizeMode="contain"
          style={{flex: 1, width: '100%'}}
          paused={play}
          muted={mute}
          repeat
          onProgress={_handleProgress}
          onLoad={(data) => setDuration(data?.duration || 0)}
          {...props}
        />
        {renderControls()}
      </Pressable>
    );
  };

  return (
    <>
      {!fullscreen ? renderPlayer() : null}
      <Modal isVisible={fullscreen} style={{margin: 0}} onBackButtonPress={() => setFullscreen(false)}>
        <View style={styles.modalContain}>
          <View style={{position: 'absolute', top, zIndex: 10}}>
            <TouchableOpacity
              style={{padding: ms(10)}}
              onPress={() => setFullscreen(false)}>
              <Icon name="close" color={colors.white} size={ms(24)} />
            </TouchableOpacity>
          </View>
          {renderPlayer()}
          <SafeAreaView />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: ms(5),
  },
  controls: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: ms(8),
    paddingVertical: Platform.OS === 'android' ? ms(5) : 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(8),
  },
  playButton: {
    marginRight: ms(5),
  },
  timerText: {
    color: colors.white,
    fontSize: ms(14),
    fontFamily: env.fontMedium,
    marginLeft: ms(5),
    minWidth: ms(50),
    textAlign: 'center',
  },
  fullButton: {
    paddingLeft: ms(10),
  },
  modalContain: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
});
