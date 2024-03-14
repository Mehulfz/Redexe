import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {getProductFAQ} from '../../actions';
import PostFAQQuestion from '../../components/Modals/PostFAQQuestion';
import Rating from '../../components/Rating';
import colors from '../../constants/colors';
import env from '../../constants/env';

export default function RenderFAQ() {
  const {productDetails} = useSelector(({product}) => product);
  const {currentUser} = useSelector(({user}) => user);

  const [data, setData] = useState([]);
  const [postQuestion, showPostQuestion] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let res = await getProductFAQ({
      product_id: productDetails?.product_id,
    });
    if (res) {
      setData(res);
    }
  };

  const _showPostQuestion = () => {
    showPostQuestion(true);
  };

  const renderItem = (item, index) => {
    return (
      <View style={styles.item} key={String(index)}>
        <Text style={styles.questionText}>{item?.faq_question}</Text>
        <Text style={styles.answerText}>{item?.faq_answer}</Text>
      </View>
    );
  };

  return (
    <View style={{padding: 15}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.title}>FAQ ({data?.length})</Text>
        {currentUser ? (
          <TouchableOpacity onPress={_showPostQuestion}>
            <Text style={styles.linkText}>Post Question</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{height: 20}} />
      {data?.map(renderItem)}
      <PostFAQQuestion
        isVisible={postQuestion}
        onClose={() => showPostQuestion(false)}
        onRefresh={initData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: moderateScale(13),
  },
  item: {
    marginBottom: moderateScale(20),
  },
  questionText: {
    fontFamily: env.fontSemibold,
    color: colors.black,
    fontSize: moderateScale(14),
    marginBottom: moderateScale(5),
  },
  answerText: {
    fontFamily: env.fontRegular,
    color: colors.darkGray,
    fontSize: moderateScale(14),
  },
  linkText: {
    fontFamily: env.fontMedium,
    color: colors.blue,
    fontSize: moderateScale(13),
    textDecorationLine: 'underline',
  },
});
