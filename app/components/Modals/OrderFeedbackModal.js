import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {moderateScale} from 'react-native-size-matters';
import {openPhotos} from '../../utils/fileOperations';
import {Button} from '../Buttons';
import {submitFeedback} from '../../actions';
import StarRating from 'react-native-star-rating-widget';
export default function OrderFeedbackModal({
  isVisible,
  onClose,
  item,
  listRefresh,
  type = 'add',
}) {
  const [comment, setComment] = useState('');
  const [file, setFile] = useState();
  const [rating, setRating] = useState(0);
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    if (type === 'view' && isVisible) {
      console.log(item);
      setComment(item?.user_feedback?.comment);
      setRating(item?.user_feedback?.feedback_rating);
      if (item?.user_feedback?.image) {
        setFile(item?.user_feedback?.image);
      }
    }
  }, [isVisible]);

  const _hideModal = () => {
    setComment('');
    setFile();
    showLoader(false);
    setRating(0);
  };

  const _handleFile = async () => {
    const response = await openPhotos({
      includeBase64: true,
    });
    setFile('data:image/jpg;base64,' + response.base64);
  };

  const _submit = async () => {
    try {
      const request = {
        user_order_products_id: item.user_order_products_id,
        store_id: item.store_id,
        product_id: item.product_id,
        feedback_rating: rating,
        comment,
      };
      if (file) {
        request.upload_image = file;
      }
      showLoader(true);
      let res = await submitFeedback(request);
      if (listRefresh) {
        listRefresh();
      }
      showLoader(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const disabled = !comment || !rating;
  return (
    <Modal
      isVisible={isVisible}
      onModalHide={_hideModal}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text style={styles.modalTitle}>Seller Feedback</Text>

        <View style={{alignSelf: 'center', marginVertical: moderateScale(20)}}>
          <StarRating
            rating={rating}
            onChange={setRating}
            enableHalfStar={false}
            enableSwiping={false}
            maxStars={5}
            starSize={moderateScale(40)}
          />
          {type === 'view' ? (
            <View
              style={{position: 'absolute', height: '100%', width: '100%'}}
            />
          ) : null}
        </View>
        <Text style={styles.inputTitle}>Comment :</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          style={styles.textArea}
          multiline
          placeholder="Please enter comments here about your experience with this Bonzicart"
          editable={type !== 'view'}
        />
        <View style={{height: moderateScale(20)}} />
        <Text style={styles.inputTitle}>
          Upload :{'   '}
          {file && type !== 'view' ? (
            <Text onPress={() => setFile()} style={styles.removeText}>
              Remove
            </Text>
          ) : null}
        </Text>

        <TouchableOpacity
          onPress={_handleFile}
          style={styles.uploadFile}
          disabled={type === 'view'}
          activeOpacity={0.7}>
          {file ? (
            <Image source={{uri: file}} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.selectFileText}>
              {type !== 'view' ? 'Tap to select file' : ''}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{height: moderateScale(20)}} />
        {type !== 'view' ? (
          <Button
            title={'Submit my feedback'}
            onPress={_submit}
            isLoading={loader}
            disabled={loader ? true : disabled}
            containerStyle={styles.btn}
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: moderateScale(15),
    borderRadius: moderateScale(15),
  },
  modalTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(16),
    color: colors.black,
  },
  inputTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
    marginBottom: moderateScale(5),
    opacity: 0.7,
  },
  textArea: {
    borderWidth: moderateScale(1),
    borderColor: colors.lightGray,
    height: moderateScale(80),
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.black,
  },
  uploadFile: {
    backgroundColor: colors.lightGray,
    height: moderateScale(110),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectFileText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    opacity: 0.5,
  },
  uploadedImage: {
    height: '100%',
    width: '100%',
  },
  removeText: {
    color: colors.red,
    textDecorationLine: 'underline',
    fontFamily: env.fontRegular,
  },
  btn: {
    height: moderateScale(40),
    alignSelf: 'center',
    width: '70%',
  },
});
