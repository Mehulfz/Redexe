/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {
  flashMessage,
  getProduct,
  productAddToCart,
  productAddRemoveToWishlist,
  getProductUpdatedState,
  getStateList,
} from '../../actions';
import assets from '../../assets';
import ProductService from '../../components/Cards/ProductService';
import Header from '../../components/Header';
import BulkPrice from '../../components/Modals/BulkPrice';
import ProductOptions from '../../components/Modals/ProductOptions';
import ProductImageSlider from '../../components/ProductImageSlider';
import Rating from '../../components/Rating';
import Selection from '../../components/Selection';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';
import {numberWithCommas} from '../../utils/arrayOperations';
import RenderDetails from './renderDetails';
import RenderFAQ from './renderFAQ';
import RenderFeedback from './renderFeedback';

function ProductDetails({navigation}) {
  const dispatch = useDispatch();
  const {productDetails} = useSelector(({product}) => product);
  const {stateList} = useSelector(({meta}) => meta);

  // const [bulkDialog, setBulkDialog] = useState(false);
  const [optionDialog, setOptionDialog] = useState(false);
  const optionAction = useRef();
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(1); // 1.product details 2. feedback 3.FAQ
  const [cartLoading, showCartLoading] = useState(false);
  const [isAddToWishlist, setIsAddToWishlist] = useState(false);

  const [stateDialogVisible, showStateDialogVisible] = useState(false);
  const [shipping, setShipping] = useState();
  const [productPrice, setProductPrice] = useState();

  useEffect(() => {
    if (!stateList?.length) dispatch(getStateList());
    dispatch(getProduct());
  }, []);

  useEffect(() => {
    setIsAddToWishlist(productDetails?.wishlist_data ? true : false);
  }, [productDetails]);

  useEffect(() => {
    if (
      !optionDialog &&
      (optionAction.current === 'cart' || optionAction.current === 'buy')
    ) {
      _addToCart(optionAction.current === 'buy' ? true : false);
      optionAction.current = null;
    }
  }, [optionDialog]);
  const feedbackRating = productDetails.feedback_rating;

  const _viewAll = () => {
    navigate('applyCoupons', {data: productDetails?.coupon_and_discount});
  };

  const _addToCart = async (IsBuy = false) => {
    if (
      (productDetails?.product_color?.length && !selectedColor) ||
      (productDetails?.product_size?.length && !selectedSize)
    ) {
      optionAction.current = IsBuy ? 'buy' : 'cart';
      return setOptionDialog(true);
    }
    if (productPrice?.stock_invalid) {
      return flashMessage('Error!', productPrice?.stock_invalid, 'danger');
    }
    const request = {
      product_id: productDetails.product_id,
      product_qty: qty,
      store_id: productDetails.business_detail?.store_id,
    };
    if (IsBuy) request.type = 'checkout';
    if (selectedColor)
      request.color_id = selectedColor.product_variation_colorid;
    if (selectedSize) request.size_id = selectedSize.product_variation_sizeid;
    showCartLoading(true);
    let res = await dispatch(productAddToCart(request));
    showCartLoading(false);
    if (IsBuy) navigation.navigate('confirmOrder');
  };

  const _buyNow = () => {
    _addToCart(true);
    // const request = {
    //   product_id: productDetails.product_id,
    //   product_qty: qty,
    //   store_id: productDetails.business_detail?.store_id,
    // };
    // if (selectedColor)
    //   request.color_id = selectedColor.product_variation_colorid;
    // if (selectedSize) request.size_id = selectedSize.product_variation_sizeid;
    // navigation.navigate('confirmOrder', {products: [request]});
  };

  const _addToWishlist = async () => {
    const request = {
      product_id: productDetails.product_id,
      status: isAddToWishlist ? 2 : 1,
      store_id: productDetails.business_detail?.store_id,
    };
    let res = await dispatch(productAddRemoveToWishlist(request));
    if (res) {
      setIsAddToWishlist(!isAddToWishlist);
    }
  };

  const _productPrice = async (
    size = selectedSize,
    color = selectedColor,
    product_qty = qty,
  ) => {
    const request = {product_qty, bulk_price: true};
    if (color) request.color_id = color.product_variation_colorid;
    if (size) request.size_id = size.product_variation_sizeid;
    let res = await dispatch(getProductUpdatedState(request));
    if (res?.status) setProductPrice(res?.data);
    return res;
  };

  const _optionChoose = ({size, color, qty}) => {
    _productPrice(size, color, qty);
    setSelectedSize(size);
    setSelectedColor(color);
    setQty(qty);
    setOptionDialog(false);
  };

  const _shippingChange = item => {
    setShipping(item);
    // console.log(item);
    // _productPrice({shipping: item.city});
  };

  const _shareProduct = async () => {
    try {
      await Share.share({
        message:
          productDetails?.product_name + ' : ' + productDetails?.short_link,
      });
    } catch (error) {}
  };

  const renderShippingCity = () => {
    if (productDetails?.product?.shipping_template?.type === 'Free')
      return null;
    const citiesOptions =
      productDetails?.product?.shipping_template?.shipping_city?.map(x => {
        x.name = x.city + ' - ' + '₹' + x.price;
        return x;
      });
    return (
      <>
        <TouchableOpacity onPress={() => showStateDialogVisible(true)}>
          <Text style={styles.shippingLinkText}>(Change shipping state)</Text>
        </TouchableOpacity>
        <Selection
          isVisible={stateDialogVisible}
          close={() => showStateDialogVisible(false)}
          popupTitle="Select shipping state"
          data={citiesOptions || []}
          onSelect={_shippingChange}
        />
      </>
    );
  };

  const renderOptions = () => {
    let shippingMsg = '';
    if (productDetails?.product?.shipping_template?.type === 'Free')
      shippingMsg = 'Free';

    if (shipping) {
      shippingMsg = `+ Shipping Charges ₹ ` + shipping?.price;
    }

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.productDetailText, {color: colors.black}]}>
            Select Option & Shipping Method
          </Text>
          <TouchableOpacity onPress={() => setOptionDialog(true)}>
            <Text style={styles.selectLinkText}>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: moderateScale(10)}} />
        {productDetails?.product_color?.length ? (
          <View style={styles.optionRow}>
            <Text style={styles.optionTitle}>Select Color :</Text>
            <Text style={styles.optionValue}>{selectedColor?.color}</Text>
          </View>
        ) : null}
        {productDetails?.product_size?.length ? (
          <View style={styles.optionRow}>
            <Text style={styles.optionTitle}>Select size :</Text>
            <Text style={styles.optionValue}>{selectedSize?.size}</Text>
          </View>
        ) : null}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Quantity:</Text>
          <View style={{flex: 1}}>
            <Text style={styles.optionValue}>{qty} </Text>
            {productPrice?.stock_invalid ? (
              <Text style={styles.errorMsg}>
                ({productPrice?.stock_invalid})
              </Text>
            ) : null}
          </View>
        </View>
        {productPrice?.sub_total ? (
          <View style={styles.optionRow}>
            <Text style={styles.optionTitle}>Total price:</Text>
            <Text style={styles.optionValue}>₹ {productPrice?.sub_total}</Text>
          </View>
        ) : null}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Shipping:</Text>
          <View style={{flex: 1}}>
            <Text style={styles.optionValue}>{shippingMsg}</Text>
            {renderShippingCity()}
          </View>
        </View>
      </>
    );
  };
  return (
    <View style={styles.root}>
      <Header title={productDetails?.product_name || ''} isBack />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        <ProductImageSlider
          images={productDetails?.product_image}
          video={productDetails?.has_video}
        />
        <View style={{padding: 15}}>
          <Text style={styles.productDetailText}>
            {productDetails.product_name}
          </Text>
          <Text style={styles.storeName}>
            Store:{' '}
            <Text
              style={{color: colors.blue}}
              onPress={() =>
                navigation.push('productList', {
                  title: productDetails?.business_detail?.CompanyName,
                  storeId: productDetails?.business_detail?.store_id,
                })
              }>
              {productDetails?.business_detail?.CompanyName || ''}
            </Text>
          </Text>
          <View style={{height: 20}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.mrpText}>
              MRP:{' '}
              <Text style={{textDecorationLine: 'line-through'}}>
                {productDetails?.display_min_mrp
                  ? `₹${numberWithCommas(
                      productDetails?.display_min_mrp?.toFixed(2),
                    )}`
                  : null}
                {productDetails?.display_max_mrp
                  ? ` ~ ₹${numberWithCommas(
                      productDetails?.display_max_mrp?.toFixed(2),
                    )}`
                  : null}
              </Text>
              {productDetails?.discount_percentage ? (
                <Text style={{color: colors.green}}>
                  {'   '}Save upto {productDetails?.discount_percentage}%
                </Text>
              ) : null}
            </Text>
            <TouchableOpacity style={styles.getCoupon} onPress={_viewAll}>
              <Text style={styles.couponBtnText}>Get Coupon</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={{flex: 1}}>
              <Text style={styles.priceText}>
                Price:{' '}
                <Text
                  style={{color: colors.primary, fontFamily: env.fontSemibold}}>
                  {productDetails?.display_min_price
                    ? `₹${numberWithCommas(
                        productDetails?.display_min_price?.toFixed(2),
                      )}`
                    : null}
                  {productDetails?.display_max_price
                    ? ` ~ ₹${numberWithCommas(
                        productDetails?.display_max_price?.toFixed(2),
                      )}`
                    : null}
                </Text>
              </Text>
              <Text style={styles.priceInfoText}>(Exclusive of all taxes)</Text>
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: env.fontBold,
                  fontSize: ms(16),
                  marginTop: ms(3),
                }}>
                {productDetails?.display_min_price_with_tax
                  ? `₹${numberWithCommas(
                      productDetails?.display_min_price_with_tax?.toFixed(2),
                    )}`
                  : null}
                {productDetails?.display_max_price_with_tax
                  ? ` ~ ₹${numberWithCommas(
                      productDetails?.display_max_price_with_tax?.toFixed(2),
                    )}`
                  : null}{' '}
                {productDetails?.product?.UnitType ? (
                  <Text style={{color: '#808080', fontSize: ms(12)}}>
                    / {productDetails?.product?.UnitType}
                  </Text>
                ) : null}
              </Text>
              <Text style={styles.priceInfoText}>(Inclusive of all taxes)</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{marginLeft: moderateScale(10)}}
                onPress={_addToWishlist}>
                <Image
                  source={
                    isAddToWishlist ? assets.heartFill : assets.heartUnfilled
                  }
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: moderateScale(15)}}
                onPress={_shareProduct}>
                <Image source={assets.shareIcon} style={styles.shareIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: 10}} />
          <View style={styles.row}>
            <Rating value={Number(feedbackRating?.avg_rate || 0)} size={18} />
            <View style={{width: moderateScale(15)}} />
            <Text style={styles.orderCount}>
              {feedbackRating?.total_feedback} feedback |{' '}
              {productDetails?.saleCount} orders
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <ProductService
          replacement={productDetails?.product?.product_return_period}
          processingTime={productDetails?.product?.ProcessingTimeInDays}
          shippingDays={
            productDetails?.product?.shipping_template.shipping_days
          }
          warrantyPeriod={
            productDetails?.product?.HasWarranty == 'No'
              ? 'No'
              : productDetails?.product?.WarrantyPeriod
          }
          location={productDetails?.business_detail?.state_detail?.name}
        />
        <View style={styles.divider} />
        <View style={{padding: 15}}>
          {renderOptions()}
          <View style={{height: 20}} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setTab(1)}
            style={[styles.tab, tab == 1 && {backgroundColor: colors.white}]}>
            <Text style={styles.tabTitle}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab(2)}
            style={[styles.tab, tab == 2 && {backgroundColor: colors.white}]}>
            <Text style={styles.tabTitle}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab(3)}
            style={[styles.tab, tab == 3 && {backgroundColor: colors.white}]}>
            <Text style={styles.tabTitle}>FAQ</Text>
          </TouchableOpacity>
        </View>
        {tab == 1 && <RenderDetails />}
        {tab == 2 && <RenderFeedback />}
        {tab == 3 && <RenderFAQ />}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: ms(10),
          paddingVertical: ms(10),
        }}>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => _addToCart()}
          disabled={cartLoading}>
          <Text style={[styles.cartBtnText, {color: colors.primary}]}>
            Add To Cart
          </Text>
        </TouchableOpacity>
        <View style={{width: ms(10)}} />
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={_buyNow}
          disabled={cartLoading}>
          <Text style={styles.cartBtnText}>Buy now</Text>
        </TouchableOpacity>
      </View>

      {/* HIDDEN COMPONENTS */}
      {/* <BulkPrice isVisible={bulkDialog} onClose={() => setBulkDialog(false)} /> */}
      <ProductOptions
        isVisible={optionDialog}
        onClose={() => {
          optionAction.current = null;
          setOptionDialog(false);
        }}
        onSelect={_optionChoose}
        defaultValue={{qty}}
        updatePrice={_productPrice}
      />
    </View>
  );
}

export default ProductDetails;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  productDetailText: {
    fontFamily: env.fontSemibold,
    color: '#000000',
    fontSize: moderateScale(15),
  },
  storeName: {
    fontFamily: env.fontRegular,
    color: '#000000',
    fontSize: moderateScale(11),
    marginTop: moderateScale(5),
  },
  orderCount: {
    fontFamily: env.fontRegular,
    color: colors.blue,
    fontSize: moderateScale(11),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    resizeMode: 'contain',
    height: moderateScale(24),
    width: moderateScale(24),
  },
  getCoupon: {
    borderBottomWidth: 1,
    borderBottomColor: colors.green,
  },
  couponBtnText: {
    fontFamily: env.fontRegular,
    color: colors.green,
    fontSize: 12,
  },
  shareIcon: {
    resizeMode: 'contain',
    height: moderateScale(20),
    width: moderateScale(20),
  },
  bulkBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
  },
  bulkBtnText: {
    fontFamily: env.fontRegular,
    color: colors.white,
    fontSize: 12,
  },
  divider: {
    backgroundColor: 'rgba(197, 206, 224, 0.25)',
    height: 1,
    marginVertical: 10,
  },
  cartBtnText: {
    fontFamily: env.fontSemibold,
    color: colors.white,
    fontSize: 15,
  },
  offerIcon: {
    tintColor: colors.white,
    resizeMode: 'contain',
    width: 24,
    height: 24,
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    height: moderateScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    flex: 1 / 2,
  },
  buyNowButton: {
    height: moderateScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: ms(1.5),
    borderColor: colors.primary,
    flex: 1 / 2,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.Gray,
    marginHorizontal: ms(15),
    borderRadius: ms(5),
    padding: ms(2),
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1 / 3,
    paddingVertical: ms(10),
    borderRadius: ms(3),
  },
  tabTitle: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.black,
  },
  optionRow: {
    flexDirection: 'row',
    marginVertical: moderateScale(5),
  },
  optionTitle: {
    fontFamily: env.fontRegular,
    color: colors.darkGray,
    fontSize: moderateScale(14),
    width: moderateScale(100),
  },
  optionValue: {
    fontFamily: env.fontRegular,
    color: colors.black,
    fontSize: moderateScale(14),
    flex: 1,
  },
  selectLinkText: {
    color: colors.blue,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
  },
  shippingLinkText: {
    fontFamily: env.fontRegular,
    color: colors.blue,
    fontSize: moderateScale(12),
  },
  errorMsg: {
    fontFamily: env.fontRegular,
    color: colors.red,
    fontSize: moderateScale(11),
  },
  mrpText: {
    fontSize: ms(12),
    color: colors.darkGray,
    fontFamily: env.fontRegular,
  },
  priceText: {
    fontSize: ms(16),
    color: colors.black,
    fontFamily: env.fontRegular,
  },
  priceInfoText: {
    fontSize: ms(10),
    color: colors.darkGray,
    fontFamily: env.fontRegular,
  },
});
