import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';
import colors from '../constants/colors';
import env from '../constants/env';
import assets from '../assets';
import _ from 'lodash';

const {height} = Dimensions.get('window');
const INIT_HEIGHT = height * 0.6;
class Selection extends Component {
  static defaultProps = {
    searchPlaceHolderText: 'Search...',
    listEmptyTitle: 'No result found.',
    colorTheme: '#16a45f',
    showSearchBox: true,
  };
  state = {
    data: this.props.data,
    keyword: '',
  };
  animatedHeight = new Animated.Value(INIT_HEIGHT);

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data !== prevProps.data) {
      this.setState({data: this.props.data});
    }
  }

  onItemSelected = (item) => {
    this.props?.onSelect(item);
    this.closeModal();
  };

  _changeSearchText = (keyword) => {
    this.setState({keyword});
    let result = this.props.data?.filter((o) => o.name.includes(keyword));
    this.setState({data: result});
  };

  renderItem = ({item, idx}) => {
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => this.onItemSelected(item)}
        activeOpacity={0.7}
        style={styles.itemWrapper}>
        <Text style={[styles.itemText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderEmpty = () => {
    let {listEmptyTitle} = this.props;
    return <Text style={styles.empty}>{listEmptyTitle}</Text>;
  };

  closeModal = () => this.props.close();

  render() {
    let {modalStyle, popupTitle, searchPlaceHolderText, showSearchBox} =
      this.props;

    const {isVisible} = this.props;
    return (
      <Modal
        onBackdropPress={this.closeModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        isVisible={isVisible}>
        <Animated.View
          style={[
            styles.modalContainer,
            modalStyle,
            {height: this.animatedHeight},
          ]}>
          <View
            style={{
              padding: 5,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={this.closeModal} style={{padding: 10}}>
              <Image
                source={assets.close_ic}
                style={{
                  height: 14,
                  width: 14,
                  resizeMode: 'contain',
                  tintColor: colors.darkGray,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{popupTitle || 'Select Item'}</Text>
          </View>
          <View style={styles.line} />
          {showSearchBox ? (
            <TextInput
              returnKeyType="done"
              style={styles.inputKeyword}
              placeholder={searchPlaceHolderText}
              onChangeText={this._changeSearchText}
              onFocus={() => {
                Animated.spring(this.animatedHeight, {
                  toValue:
                    INIT_HEIGHT + (Platform.OS === 'ios' ? height * 0.2 : 0),
                  friction: 7,
                  useNativeDriver: false,
                }).start();
              }}
              onBlur={() => {
                Animated.spring(this.animatedHeight, {
                  toValue: INIT_HEIGHT,
                  friction: 7,
                  useNativeDriver: false,
                }).start();
              }}
            />
          ) : null}
          <FlatList
            data={_.sortBy(this.state.data, 'name')}
            style={styles.listOption}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
          />
          <SafeAreaView />
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    fontFamily: env.fontSemibold,
    color: colors.darkGray,
    marginLeft: 5,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lightGray,
  },
  inputKeyword: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingLeft: 8,
    marginHorizontal: 20,
    marginTop: 16,
    fontFamily: env.fontRegular,
    color: colors.black,
  },

  listOption: {
    paddingHorizontal: 24,
    paddingTop: 1,
    marginTop: 16,
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
    fontFamily: env.fontRegular,
  },
  empty: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 16,
    fontFamily: env.fontRegular,
  },
});

Selection.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object,
  selectedTitleStyle: PropTypes.object,
  title: PropTypes.string,
  onSelect: PropTypes.func,
  popupTitle: PropTypes.string,
  showSearchBox: PropTypes.bool,
};

export default Selection;
