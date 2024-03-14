import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';
import {LightViewGallery} from '../LightViewGallery';
import FlashMessage from 'react-native-flash-message';
import {numberWithCommas} from '../../utils/arrayOperations';
import BulkPrice from './BulkPrice';

export default function ProductOptions({
  defaultValue,
  isVisible,
  onClose,
  onSelect,
  updatePrice,
}) {
  const {productDetails} = useSelector(({product}) => product);
  const flashRef = useRef();

  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [qty, setQty] = useState(defaultValue?.qty || 1);
  const [lightView, showLightView] = useState(false);
  const [lightViewIndex, showLightViewIndex] = useState(0);
  const [bulkDialog, setBulkDialog] = useState(false);

  const imageData = productDetails?.product_color?.map(x => {
    return {ImageLink: x.image};
  });

  // useEffect(() => {
  //   if (defaultValue) {
  //     if (defaultValue?.qty) setQty(defaultValue?.qty);
  //   }
  // }, [defaultValue]);

  useEffect(() => {
    _updateDetails();
  }, [selectedColor, selectedSize, qty]);

  const showFlashMessage = (message, description, type) => {
    flashRef.current.showMessage({
      message,
      description,
      type,
      icon: type,
    });
  };

  const _updateDetails = async () => {
    let res = await updatePrice(selectedSize, selectedColor, qty);
    if (!res?.status) showFlashMessage(res?.message, '', res?.code);
  };

  const _submit = () => {
    let color = selectedColor,
      size = selectedSize;
    if (productDetails?.product_color?.length && !color) {
      return alert("Please select color!")
    }
    if (productDetails?.product_size?.length && !size) {
      return alert("Please select size!")
    }
    onSelect({
      size,
      color,
      qty,
    });
  };

  const _qtyAction = action => {
    if (action === 'add') {
      const stock = Number(productDetails?.stock);
      const newQty = qty + 1;
      if (!productDetails?.product?.BulkProcessingTimeInDays) {
        if (newQty <= stock) setQty(newQty);
      } else {
        setQty(newQty);
      }
    } else {
      if (qty) setQty(qty - 1);
    }
  };

  const _changeQty = value => {
    if (!value) setQty('');
    const stock = Number(productDetails?.stock);
    if (!productDetails?.product?.BulkProcessingTimeInDays) {
      if (value <= stock) setQty(value);
    } else {
      setQty(value);
    }
  };

  const _showLightView = () => {
    const index = productDetails?.product_color.findIndex(
      x => selectedColor === x,
    );
    if (index >= 0) {
      showLightView(true);
      showLightViewIndex(index);
    }
  };

  const renderColorItem = (item, index) => {
    const isActive = selectedColor === item;
    return (
      <TouchableOpacity
        style={[styles.colorBox, isActive && {borderColor: colors.primary}]}
        onPress={() => setSelectedColor(item)}
        key={String(index)}>
        <Image
          source={{uri: item.image}}
          style={{width: '100%', height: '100%'}}
          // resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderSizeItem = (x, index) => {
    return (
      <TouchableOpacity
        style={[
          styles.colorBox,
          {
            backgroundColor: selectedSize === x ? colors.primary : '#DEE0E2',
          },
        ]}
        onPress={() => setSelectedSize(x)}
        key={String(index)}>
        <Text style={styles.selectionTitle}>{x?.size}</Text>
      </TouchableOpacity>
    );
  };

  const disabled = (productDetails?.product_color?.length && !selectedColor) || (productDetails?.product_size?.length && !size)


  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product options</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* <Text style={styles.optionSelectionText}>
            Select color & size option
          </Text> */}
          <Pressable onPress={_showLightView}>
            <Image
              source={{
                uri: selectedColor?.image || productDetails?.display_image,
              }}
              style={styles.selectedColorImg}
            />
          </Pressable>

          <Text style={styles.productNameText} numberOfLines={2}>
            {productDetails.product_name}
          </Text>
          <Text style={styles.productPriceText} numberOfLines={2}>
            {productDetails?.sale_price_with_tax ? (
              '₹' + productDetails?.sale_price_with_tax
            ) : (
              <Text>
                {productDetails?.display_min_price_with_tax
                  ? `₹${numberWithCommas(
                      productDetails?.display_min_price_with_tax?.toFixed(2),
                    )}`
                  : null}
                {productDetails?.display_max_price_with_tax
                  ? ` ~ ₹${numberWithCommas(
                      productDetails?.display_max_price_with_tax?.toFixed(2),
                    )}`
                  : null}
              </Text>
            )}{' '}
            <Text style={styles.priceInfoText}>(Inclusive of all taxes)</Text>
          </Text>
          {productDetails?.product_color?.length ||
          productDetails?.product_size?.length ? (
            <View style={styles.selectionContain}>
              {productDetails?.product_color?.length ? (
                <>
                  <Text style={styles.optionTitleText}>
                    Select Color : {selectedColor?.color}
                  </Text>
                  <View style={styles.wrapArea}>
                    {productDetails?.product_color?.map(renderColorItem)}
                  </View>
                </>
              ) : null}
              {productDetails?.product_color?.length &&
              productDetails?.product_size?.length ? (
                <View style={{height: moderateScale(10)}} />
              ) : null}
              {productDetails?.product_size?.length ? (
                <>
                  <Text style={styles.optionTitleText}>
                    Select size : {selectedSize?.size}
                  </Text>
                  <View style={styles.wrapArea}>
                    {productDetails?.product_size?.map(renderSizeItem)}
                  </View>
                </>
              ) : null}
            </View>
          ) : (
            <View style={{height: moderateScale(20)}} />
          )}

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.optionTitleText}>
              Qty{' '}
              <Text style={{color: colors.primary}}>
                ({productDetails?.stock} left)
              </Text>
            </Text>
            {productDetails?.bulk_price?.length ? (
              <TouchableOpacity onPress={() => setBulkDialog(true)}>
                <Text style={styles.bulkLink}>Bulk Price</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => _qtyAction('minus')}
              disabled={qty === 1}>
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.qtyValue}
              value={String(qty)}
              onChangeText={_changeQty}
              keyboardType="number-pad"
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.qtyButton}
              disabled={
                (productDetails?.product_color?.length && !selectedColor) ||
                (productDetails?.product_size?.length && !selectedSize)
              }
              onPress={() => _qtyAction('add')}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {qty > 1 ? (
            <>
              <View style={{height: moderateScale(20)}} />
              <Text style={styles.optionTitleText}>
                Total price:{' '}
                <Text style={{color: colors.primary}}>
                  ₹{productDetails.total_sale_price_with_tax}
                </Text>
              </Text>
            </>
          ) : null}

          <View style={{height: moderateScale(20)}} />
          {productDetails?.product?.BulkProcessingTimeInDays ? (
            <Text style={[styles.optionTitleText, {color: colors.primary}]}>
              Note:{' '}
              <Text style={{color: colors.darkGray}}>
                You can purchase in bulk. It will take{' '}
                {productDetails?.product?.BulkProcessingTimeInDays} days to
                process your order.
              </Text>
            </Text>
          ) : null}
        </ScrollView>
        <Button
          title="Continue"
          onPress={_submit}
          containerStyle={[styles.btn, disabled && { backgroundColor: colors.Gray }]}
          disabled={disabled}
        />
      </View>
      {imageData?.length ? (
        <LightViewGallery
          isVisible={lightView}
          onClose={() => showLightView(false)}
          data={imageData}
          defaultIndex={lightViewIndex}
        />
      ) : null}
      <FlashMessage ref={flashRef} position="top" />
      <BulkPrice isVisible={bulkDialog} onClose={() => setBulkDialog(false)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    flex: 1,
    marginTop: moderateScale(80),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(15),
  },
  headerTitle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: env.fontSemibold,
  },
  closeIc: {
    resizeMode: 'contain',
    height: moderateScale(13),
    width: moderateScale(13),
  },
  container: {
    paddingHorizontal: moderateScale(15),
    paddingBottom: moderateScale(15),
    flexGrow: 1,
  },
  optionSelectionText: {
    fontFamily: env.fontRegular,
    color: colors.black,
    fontSize: moderateScale(13),
    opacity: 0.7,
    marginBottom: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
  },
  optionTitleText: {
    fontFamily: env.fontRegular,
    color: colors.black,
    fontSize: moderateScale(15),
    marginBottom: moderateScale(5),
  },
  wrapArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorBox: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderateScale(5),
    overflow: 'hidden',
    borderWidth: moderateScale(1.5),
    borderColor: '#EEE',
  },
  selected: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: 'green',
    padding: 3,
    right: 0,
    bottom: 0,
  },
  btn: {
    height: moderateScale(42),
    margin: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  qtyButton: {
    height: moderateScale(28),
    width: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: moderateScale(4),
  },
  qtyButtonText: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(18),
    color: colors.black,
  },
  qtyValue: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(16),
    color: colors.black,
    minWidth: moderateScale(40),
    textAlign: 'center',
    marginHorizontal: moderateScale(5),
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
  },
  selectedColorImg: {
    resizeMode: 'contain',
    height: moderateScale(200),
    width: '100%',
    alignSelf: 'center',
    marginBottom: moderateScale(15),
  },
  productNameText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  productPriceText: {
    fontFamily: env.fontBold,
    fontSize: moderateScale(18),
    color: colors.primary,
    lineHeight: moderateScale(30),
  },
  selectionContain: {
    backgroundColor: 'rgba(116, 123, 129, 0.08)',
    marginHorizontal: moderateScale(-15),
    padding: moderateScale(15),
    marginBottom: moderateScale(15),
    marginTop: moderateScale(10),
  },
  priceInfoText: {
    fontSize: moderateScale(12),
    color: colors.darkGray,
    fontFamily: env.fontRegular,
  },
  selectionTitle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: env.fontSemibold,
  },
  bulkLink: {
    fontSize: moderateScale(14),
    color: colors.blue,
    fontFamily: env.fontRegular,
    textDecorationLine: 'underline',
  },
});
