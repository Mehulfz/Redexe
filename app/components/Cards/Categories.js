import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';

const {width} = Dimensions.get('screen');

export default function Categories() {
  const {categories} = useSelector(({meta}) => meta);

  const getSubcategories = (item) => {
    // navigate('categories', {data: item});
    navigate('productList', {catId: item.CatID, title: item?.CatTitle});
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => getSubcategories(item)}>
        <Text style={styles.itemTitle}>{item?.CatTitle}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigate('categories')}>
        <Text style={styles.itemTitle}>View All</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={categories?.slice(0, 10)}
      keyExtractor={(it, i) => String(i)}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      contentContainerStyle={{paddingLeft: 5}}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: colors.primary,
    marginRight: 10,
    borderRadius: 10,
    height: 70,
    minWidth: width * 0.4,
    maxWidth: width * 0.4,
  },
  itemTitle: {
    fontFamily: env.fontSemibold,
    fontSize: 15,
    color: colors.white,
  },
});
