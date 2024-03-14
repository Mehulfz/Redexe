import React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {ms} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import ProductSpecification from '../../components/Cards/ProductSpecification';
import colors from '../../constants/colors';
import env from '../../constants/env';


const fontElementModel = HTMLElementModel.fromCustomModel({
  tagName: 'font',
  contentModel: HTMLContentModel.mixed,
  getUADerivedStyleFromAttributes({face, color, size}) {
    let style = {};
    if (face) {
      style.fontFamily = face;
    }
    if (color) {
      style.color = color;
    }
    if (size) {
      // handle size such as specified in the HTML4 standard. This value
      // IS NOT in pixels. It can be absolute (1 to 7) or relative (-7, +7):
      // https://www.w3.org/TR/html4/present/graphics.html#edef-FONT
      // implement your solution here
    }

    return style;
  },
});

const customHTMLElementModels = {font: fontElementModel};


export default function RenderDetails() {
  const {productDetails} = useSelector(({product}) => product);

  return (
    <View style={styles.container}>
      <ProductSpecification />
      <View style={{padding: ms(5)}}>
        {/* <Text style={styles.manufacturedText}>Package Include: {productDetails.product.ProductMadeIn}</Text> */}
        <RenderHtml
          source={{uri: productDetails?.product?.ProductDescFile}}
          tagsStyles={tagsStyles}
          contentWidth={Dimensions.get('window').width - ms(10)}
          customHTMLElementModels={customHTMLElementModels}
        />
        {productDetails?.product?.ProductMadeIn ? (
          <Text style={styles.manufacturedText}>
            Manufactured In: {productDetails?.product?.ProductMadeIn}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  manufacturedText: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    color: colors.black,
    margin: ms(15),
  },
});

const tagsStyles = {
  body: {
    fontFamily: env.fontRegular,
  },
  a: {
    fontFamily: env.fontRegular,
  },
  p: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    lineHeight: ms(18),
  },
  span: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    lineHeight: ms(18),
  },
};
