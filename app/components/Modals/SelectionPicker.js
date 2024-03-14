import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';
import colors from '../../constants/colors';
import env from '../../constants/env';

export default function SelectionPicker({
  visible,
  onClose,
  onChoose,
  dataOptions,
}) {
  const handlePress = (item) => {
    onClose();
    if (onChoose) {
      onChoose(item);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}>
        <Text style={styles.itemName}>{item?.title || item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.3}
      style={{marginHorizontal: moderateScale(30)}}>
      <View
        style={[
          styles.container,
          dataOptions?.length > 8 && {
            height: Dimensions.get('screen').height * 0.85,
          },
        ]}>
        <FlatList
          data={dataOptions}
          keyExtractor={(it, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={{padding: moderateScale(10)}}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    maxHeight: Dimensions.get('screen').height * 0.7,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
  },
  itemName: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(15),
  },
});
