import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import Header from "../../../components/Header";
import { Input } from "../../../components/Inputs";
import colors from '../../../constants/colors';
import { moderateScale } from 'react-native-size-matters';
import env from '../../../constants/env';
import { openPhotos } from '../../../utils/fileOperations';
import { flashMessage, updateDisputeStatus } from '../../../actions';
import moment from "moment";

const ShippingDetails = ({ route, navigation }) => {
  const data = route?.params?.data;
  const [file, setFile] = useState();
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [trackingID, setTrackingID] = useState('');
  const [trackingURL, setTrackingURL] = useState('');
  const [shippedDate, setShippedDate] = useState('');
  const [comment, setComment] = useState('');

  const _handleFile = async () => {
    const response = await openPhotos({
      includeBase64: true,
    });
    setFile('data:image/jpg;base64,' + response.base64);
  };

  const _submit = async () => {
    try {
      if (!shippingCarrier?.trim())
        return flashMessage(
          'Required!',
          'Please enter Shipping Carrier.',
          'warning',
        );
      else if (!trackingID?.trim())
        return flashMessage(
          'Required!',
          'Please enter Tracking ID.',
          'warning',
        );
      else if (!trackingURL?.trim())
        return flashMessage(
          'Required!',
          'Please enter Tracking URL.',
          'warning',
        );

      else if (!shippedDate?.trim())
        return flashMessage(
          'Required!',
          'Please enter Shipped Date.',
          'warning',
        );

      else if (!comment?.trim())
        return flashMessage(
          'Required!',
          'Please enter Comment.',
          'warning',
        );

      const request = {
        dispute_request_no: data?.dispute_request_no,
        action_type: "return",
        shipping_date: moment(shippedDate).format("YYYY-MM-DD"),
        tracking_id: trackingID,
        tracking_url: trackingURL,
        shipping_carrier: shippingCarrier,
        shipping_image: file,
        comment: comment
      }
      let res = await updateDisputeStatus(request);
      if (!res?.status) return flashMessage(
        'Error!',
        res?.message,
        'danger',
      );
      if (route?.params?.reload) route?.params?.reload()
      navigation.goBack();
    } catch (error) {
      console.log('Forgot error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  return (
    <View style={styles.root}>
      <Header isBack title="Shipping Details" center />
      <ScrollView style={styles.mainComponent}>
        <View style={{ marginTop: 10 }} />
        <Input title={"Shipping Carrier :"} placeholder="Shipping Carrier" onChangeText={setShippingCarrier} value={shippingCarrier} />
        <View style={{ marginTop: 10 }} />
        <Input title={"Tracking ID :"} placeholder="Tracking ID" onChangeText={setTrackingID} value={trackingID} />
        <View style={{ marginTop: 10 }} />
        <Input title={"Tracking URL :"} placeholder="Tracking URL" onChangeText={setTrackingURL} value={trackingURL} />
        <Text style={styles.EnterTheTrackingText}>
          (Enter the tracking page link here)
        </Text>
        <View style={{ marginTop: 10 }} />

        <Text style={styles.inputTitle}>
          Upload Tracking ID Slip :
          {file ? (
            <Text onPress={() => setFile()} style={styles.removeText}>
              Remove
            </Text>
          ) : null}
        </Text>
        <TouchableOpacity
          onPress={_handleFile}
          style={styles.uploadFile}
          activeOpacity={0.7}>
          {file ? (
            <Image source={{ uri: file }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.selectFileText}>Tap to select file</Text>
          )}
        </TouchableOpacity>
        <View style={{ marginTop: 10 }} />
        <Input title={"Shipped Date :"} placeholder="Shipped Date" onChangeText={setShippedDate} value={shippedDate} />
        <View style={{ marginTop: 10 }} />
        <Input title={"Comment :"} placeholder="Comment" multiline={true} onChangeText={setComment} value={comment} />
        <View style={{ marginTop: 10 }} />
        <View style={styles.itemActionContain}>
          <TouchableOpacity style={styles.itemActionBtn} onPress={_submit}>
            <Text style={styles.itemActionText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemActionBtn, { backgroundColor: colors.red }]} >
            <Text style={styles.itemActionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
export default ShippingDetails;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainComponent: {
    padding: moderateScale(10),
  },
  EnterTheTrackingText: {
    padding: moderateScale(5),
    marginLeft: moderateScale(5),
    color: colors.darkGray

  },
  inputTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.primary,
    marginBottom: moderateScale(5),

  },
  removeText: {
    color: colors.red,
    textDecorationLine: 'underline',
    fontFamily: env.fontRegular,
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
  itemActionContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: moderateScale(20),
  },
  itemActionBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(20),
  },
  itemActionText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.white,
  },
})