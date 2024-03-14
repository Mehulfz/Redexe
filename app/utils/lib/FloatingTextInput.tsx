import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  // TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import TextInput from 'react-native-text-input-mask';
import colors from '../../constants/colors';
import env from '../../constants/env';

type FloatingTextInputProps = {
  title?: String;
  value?: String;
  onChangeText?: Function;
  titleStyle?: TextStyle;
  style?: TextStyle;
  focusColor?: String;
  underlineFocusColor?: String;
  underlineColor?: String;
  underlineWidth?: Number;
  containerStyle?: ViewStyle | Object;
  placeholder?: String;
};

export class FloatingTextInput extends Component<FloatingTextInputProps> {
  static defaultProps = {
    title: '',
    value: '',
    focusColor: '#0D192B',
    titleStyle: { color: colors.disabled, fontFamily: env.Book },
    onChangeText: () => null,
    underlineColor: "#DEDEDE",
    underlineFocusColor: '#0D192B',
    underlineWidth: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this._animatedIsFocused = new Animated.Value(props.value === '' ? 0 : 1);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const {
      title,
      titleStyle,
      style,
      focusColor,
      underlineFocusColor,
      underlineColor,
      underlineWidth,
      containerStyle,
      placeholder,
      ...props
    } = this.props;

    const defualtTitleStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 15],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [titleStyle?.color, focusColor],
      }),
    };

    const defualtContainStyle = {
      paddingTop: 18,
      borderBottomWidth: underlineWidth,
      borderBottomColor: !this.state.isFocused
        ? underlineColor
        : this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [underlineColor, underlineFocusColor || focusColor],
        }),
    };

    return (
      <Animated.View style={[defualtContainStyle, containerStyle]}>
        <Animated.Text style={[titleStyle, defualtTitleStyle]}>
          {title}
        </Animated.Text>
        <TextInput
          {...props}
          placeholder={this.state.isFocused ? placeholder : ''}
          style={[defaultStyle.input, style]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
      </Animated.View>
    );
  }
}

const defaultStyle = StyleSheet.create({
  input: {
    height: 30,
    fontSize: moderateScale(18),
    color: '#0D192B',
    paddingVertical: 0,
    fontFamily: env.Book,
  },
});
