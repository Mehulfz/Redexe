import React, {useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {saveProductFAQ} from '../../actions';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';
import {Input} from '../Inputs';

export default function PostFAQQuestion({isVisible, onClose, onRefresh}) {
  const {productDetails} = useSelector(({product}) => product);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [loader, showLoader] = useState(false);

  const _submit = async () => {
    if (!name?.trim()) return;
    showLoader(true);
    await dispatch(
      saveProductFAQ({
        store_id: productDetails.business_detail?.store_id,
        product_id: productDetails?.product_id,
        faq_question: name?.trim(),
      }),
    );
    showLoader(false);
    onClose();
    if(onRefresh) onRefresh()
  };

  const _hideModal = () => {
    setName('');
    showLoader(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{margin: ms(10)}}
      backdropOpacity={0.5}
      onModalWillHide={_hideModal}>
      <View style={styles.root}>
        <SafeAreaView />
        <Text style={styles.title}>Post a Question</Text>
        <Input
          value={name}
          onChangeText={setName}
          containStyle={styles.input}
          placeholder="Enter question..."
        />

        <View style={{height: moderateScale(25)}} />
        <View style={styles.row}>
          <Button
            title="Save"
            containerStyle={[
              styles.fillButton,
              !name && {backgroundColor: colors.Gray},
            ]}
            onPress={_submit}
            isLoading={loader}
            disabled={!name}
          />
          <View margin={6} />
          <Button
            title="Cancel"
            containerStyle={styles.button}
            titleStyle={{color: colors.black}}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
  },
  title: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.black,
    marginTop: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fillButton: {
    paddingHorizontal: moderateScale(25),
    height: moderateScale(35),
    backgroundColor: colors.blue,
  },
  button: {
    paddingHorizontal: moderateScale(25),
    height: moderateScale(35),
    backgroundColor: colors.white,
  },
  input: {
    borderRadius: moderateScale(10),
  },
});
