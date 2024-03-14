import React, {useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {createWishlist} from '../../actions';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';
import {Input} from '../Inputs';

export default function CreateWishlist({isVisible, onClose}) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [loader, showLoader] = useState(false);

  const _submit = async () => {
    if (!name?.trim()) return;
    showLoader(true);
    await dispatch(createWishlist({wishlist_category: name?.trim()}));
    showLoader(false);
    onClose();
  };

  const _hideModal = () => {
    setName('');
    showLoader(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-start'}}
      backdropOpacity={0.5}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      onModalWillHide={_hideModal}>
      <View style={styles.root}>
        <SafeAreaView />
        <Text style={styles.title}>+ Create a wishlist</Text>
        <Input
          value={name}
          onChangeText={setName}
          containStyle={styles.input}
          placeholder="Enter wishlist name"
        />

        <View style={{height: moderateScale(25)}} />
        <View style={styles.row}>
          <Button
            title="Save"
            containerStyle={styles.fillButton}
            onPress={_submit}
            isLoading={loader}
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
    // margin: moderateScale(5),
    borderBottomLeftRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
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
