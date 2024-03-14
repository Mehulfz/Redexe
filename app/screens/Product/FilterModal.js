import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {updateProductState} from '../../actions';
import colors from '../../constants/colors';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import env from '../../constants/env';
import Rating from '../../components/Rating';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Button} from '../../components/Buttons';

const {width} = Dimensions.get('screen');

export default function FilterModal({onApply}) {
  const dispatch = useDispatch();
  const {showFilterModal, apiFilterList} = useSelector(({product}) => product);

  const [sort, setSort] = useState();
  const [rate, setRate] = useState();
  const [priceRange, setPriceRange] = useState([
    apiFilterList?.min_price || 0,
    apiFilterList?.max_price || 1000,
  ]);
  const [color, setColor] = useState();
  const [size, setSize] = useState();

  const _close = () => {
    dispatch(updateProductState('showFilterModal', false));
  };

  const _changeSort = (value) => {
    setSort((pre) => {
      if (pre !== value) pre = value;
      else pre = null;
      return pre;
    });
  };

  const _changeRateSort = (value) => {
    setRate((pre) => {
      if (pre !== value) pre = value;
      else pre = null;
      return pre;
    });
  };

  const _changeSize = (value) => {
    setSize((pre) => {
      if (pre !== value) pre = value;
      else pre = null;
      return pre;
    });
  };

  const _changeColor = (value) => {
    setColor((pre) => {
      if (pre !== value) pre = value;
      else pre = null;
      return pre;
    });
  };

  const _resetFilter = () => {
    setSort();
    setRate();
    setColor();
    setSize();
    setPriceRange([
      apiFilterList?.min_price || 0,
      apiFilterList?.max_price || 1000,
    ]);
    dispatch(updateProductState('showFilterModal', false));
    dispatch(updateProductState('filterObj', {}));
    onApply();
  };

  const _applyFilter = () => {
    const request = {};
    if (sort) request.order_by = sort;
    if (rate) request.rating = rate;
    if (size) request.size = size;
    if (color) request.color = color;
    if (apiFilterList?.min_price && apiFilterList?.max_price) {
      request.min_price = priceRange[0];
      request.max_price = priceRange[1];
    }
    dispatch(updateProductState('filterObj', request));
    dispatch(updateProductState('showFilterModal', false));
    onApply();
  };

  const renderSortFilter = () => {
    if (!apiFilterList?.order_by?.length) return null;
    return (
      <>
        <Text style={styles.inputTitle}>Sort By: </Text>
        <View style={styles.sortOptionContain}>
          {apiFilterList?.order_by?.map((x, i) => {
            return (
              <TouchableOpacity
                key={String(i)}
                style={styles.radioRow}
                onPress={() => _changeSort(x.value)}>
                <Icon
                  name={
                    sort === x.value
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  color={colors.black}
                  size={moderateScale(18)}
                />
                <Text style={styles.radioValueText}>{x?.Title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  const renderPriceFilter = () => {
    if (!apiFilterList?.min_price || !apiFilterList?.max_price) return null;
    return (
      <>
        <Text style={styles.inputTitle}>
          Price:{' '}
          <Text style={styles.priceRangeText}>
            Rs. {priceRange[0]} - {priceRange[1]}
          </Text>
        </Text>

        <View style={styles.priceInputContainer}>
          <MultiSlider
            values={priceRange}
            min={apiFilterList?.min_price || 0}
            max={apiFilterList?.max_price || 1000}
            sliderLength={width - moderateScale(40)}
            onValuesChange={setPriceRange}
          />
        </View>
      </>
    );
  };

  const renderRateFilter = () => {
    return (
      <>
        <Text style={styles.inputTitle}>Rate: </Text>
        <View style={styles.rateOptionContain}>
          {[5, 4, 3, 2, 1].map((item) => (
            <TouchableOpacity
              key={String(item)}
              style={styles.rateRow}
              onPress={() => _changeRateSort(item)}>
              <Icon
                name={
                  rate === item
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                color={colors.black}
                size={moderateScale(18)}
                style={{marginRight: moderateScale(10)}}
              />
              <Rating size={moderateScale(16)} value={item} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderApiFilters = () => {
    return (
      <>
        {renderSortFilter()}
        {renderPriceFilter()}
        {apiFilterList?.size_list && (
          <>
            <Text style={styles.inputTitle}>Size: </Text>
            <View style={styles.rowContainer}>
              {apiFilterList?.size_list?.map((item, i) => {
                const isActive = item === size;
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isActive && {borderColor: colors.primary},
                    ]}
                    key={String(i)}
                    onPress={() => _changeSize(item)}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
        <View style={{height: moderateScale(10)}} />
        {apiFilterList?.color_list && (
          <>
            <Text style={styles.inputTitle}>Color: </Text>
            <View style={styles.rowContainer}>
              {Object.keys(apiFilterList?.color_list)?.map((item, i) => {
                const isActive = item === color;
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isActive && {borderColor: colors.primary},
                    ]}
                    key={String(i)}
                    onPress={() => _changeColor(item)}>
                    <Text style={styles.itemText}>
                      {apiFilterList?.color_list[item]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <Modal isVisible={showFilterModal} style={styles.root}>
      <View style={styles.container}>
        {/* MODAL HEADER AREA */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter</Text>
          <TouchableOpacity onPress={_close}>
            <Icon name="close" color={colors.black} size={moderateScale(18)} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: moderateScale(15),
            paddingBottom: moderateScale(15),
          }}>
          {renderApiFilters()}
          <View style={{height: moderateScale(15)}} />
          {renderRateFilter()}
        </ScrollView>
        <View style={styles.footer}>
          <Button
            title={'Reset'}
            onPress={_resetFilter}
            containerStyle={styles.resetBtn}
          />
          <Button
            title={'Filter'}
            onPress={_applyFilter}
            containerStyle={styles.filterBtn}
          />
        </View>
        <SafeAreaView />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    flex: 1,
    marginTop: moderateScale(75),
  },
  header: {
    padding: moderateScale(15),
    flexDirection: 'row',
  },
  headerTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
    flex: 1,
  },
  inputTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: moderateScale(3),
  },
  radioValueText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    marginLeft: moderateScale(10),
  },
  sortOptionContain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
    flexWrap: 'wrap',
    marginBottom: moderateScale(15),
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    height: moderateScale(35),
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
  },
  rateOptionContain: {
    marginTop: moderateScale(8),
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(3),
    alignSelf: 'baseline',
  },
  priceRangeText: {
    opacity: 0.5,
    fontSize: moderateScale(12),
    fontFamily: env.fontRegular,
  },
  filterBtn: {
    height: moderateScale(35),
    backgroundColor: colors.blue,
    width: '40%',
  },
  resetBtn: {
    height: moderateScale(35),
    backgroundColor: colors.red,
    width: '40%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: moderateScale(15),
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderateScale(5),
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  itemText: {
    fontSize: moderateScale(12),
    fontFamily: env.fontRegular,
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: moderateScale(20),
    paddingTop: moderateScale(10),
  },
});
