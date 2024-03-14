import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';

const {height} = Dimensions.get('screen');

export default function BulkPrice({isVisible, onClose}) {
  const {productDetails} = useSelector(({product}) => product);
  const data = productDetails?.bulk_price;
  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <SafeAreaView
        style={{
          backgroundColor: '#FFF',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}>
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bulk price details</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={assets.close_ic}
              style={{resizeMode: 'contain', height: 16, width: 16}}
            />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <View style={[styles.row]}>
            <Text style={styles.tblHeaderText}>From</Text>
            <Text style={styles.tblHeaderText}>To</Text>
            <Text style={styles.tblHeaderText}>Bulk Price ₹</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            marginBottom: 15,
            maxHeight: height * 0.7,
          }}>
          <View style={[{borderWidth: 1}]}>
            <FlatList
              data={data}
              keyExtractor={(x, i) => String(i)}
              bounces={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={[styles.row]}>
                  <Text style={styles.tableText}>{item?.bulk_price_from}</Text>
                  <Text style={styles.tableText}>{item?.bulk_price_to}</Text>
                  <Text style={styles.tableText}>
                    Rs. {item?.bulk_price_amount}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 25,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: env.fontMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1 / 3,
    alignItems: 'center',
    padding: 10,
  },
  tblHeaderText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: env.fontRegular,
    padding: 5,
    flex: 1,
    textAlign: 'center',
  },
  tableText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: env.fontRegular,
    padding: 5,
    flex: 1,
    textAlign: 'center',
  },
});
