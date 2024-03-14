import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
// import { GiftedChat, Send } from 'react-native-gifted-chat';
import Header from '../../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ms } from 'react-native-size-matters';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import moment from 'moment';
import {
  getDisputeDetails,
  getDisputeDiscussion,
  sendDisputeDiscussion,
  updateOrderState,
} from '../../../actions';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { CancelDisputeRequest } from '../../../components/orderModals/CancelDisputeRequest';
import { useDispatch } from 'react-redux';

export function DisputeDetails({ navigation }) {
  const dispatch = useDispatch();
  const { orderDetails } = useSelector((state) => state.order);
  const { currentUser } = useSelector(({ user }) => user);
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [loader, showLoader] = useState(true);
  const [loadMore, showLoadMore] = useState(true);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndRich = useRef(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const disputeId = orderDetails?.user_order_product[0]?.dispute_request_id;

  useEffect(() => {
    initData();
    getDiscussion();
  }, []);

  const initData = async () => {
    const dispute = await getDisputeDetails(disputeId);
    if (dispute) setData(dispute);
  };

  const getDiscussion = async () => {
    const request = {
      page: pageNumber.current,
      limit: 20,
      dispute_request_no: disputeId,
    };
    if (preventLoader.current) return;
    preventLoader.current = true;
    let list = await getDisputeDiscussion(request);
    showLoader(false);
    showLoadMore(false);
    preventLoader.current = false;
    if (!list || list?.length < 20) isEndRich.current = true;
    if (pageNumber.current > 1) list = [...messages, ...list];
    list = _.uniqBy(list, '_id');
    setMessages(list);
  };

  const _closeMenu = () => {
    setMenuVisible(false);
  };

  const _menuAction = async (action) => {
    _closeMenu();
    await new Promise((resolve) => setTimeout(resolve, 350));
    switch (action) {
      case 'cancel':
        dispatch(updateOrderState('orderActionProduct', orderDetails));
        dispatch(updateOrderState('showCancelDisputeModal', true));
        break;
      case 'return':
        navigation.navigate("shippingDetails", { data: data, reload: initData })
        break;

      // case 'confirmOrder':
      //   Alert.alert(
      //     'Item received',
      //     "Please confirm an order received, only after you've received the product. Remember after you confirm you received the order, you will be able to request for refund or return.",
      //     [
      //       {
      //         text: 'Cancel',
      //         style: 'cancel',
      //       },
      //       {
      //         text: 'Confirm',
      //         onPress: async () => {
      //           let res = await orderCompleted({
      //             user_order_products_id:
      //               orderDetails?.user_order_product[0]?.user_order_products_id,
      //           });
      //           if (res) initData();
      //         },
      //       },
      //     ],
      //   );
      //   break;

      default:
        break;
    }
  };

  const loadMoreMessages = () => {
    if (loadMore || preventLoader.current || isEndRich.current) return;
    pageNumber.current += 1;
    showLoadMore(true);
    initData();
  };

  const onSend = (messages) => {
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages),
    // );
    sendDisputeDiscussion({
      dispute_request_no: disputeId,
      message: messages[0].text,
    });
  };

  const renderInfo = () => {
    let statusText = '-';
    if (data?.dispute_status_id === 0) statusText = 'Pending';
    else if (data?.dispute_status_id === 1) statusText = 'In Process';
    else if (data?.dispute_status_id === 2) statusText = 'Return Package';
    else if (data?.dispute_status_id === 3) statusText = 'Package Returned';
    else if (data?.dispute_status_id === 4) statusText = 'Cancelled';
    else if (data?.dispute_status_id === 5) statusText = 'Refund Initiated';
    else if (data?.dispute_status_id === 6) statusText = 'Exchange In Process';
    else if (data?.dispute_status_id === 7) statusText = 'Exchange Completed';
    else if (data?.dispute_status_id === 8) statusText = 'Refunded';
    else if (data?.dispute_status_id === 9) statusText = 'Closed';
    return (
      <>
        <View style={styles.card}>
          <View style={styles.rowItem}>
            <Text style={styles.rowItemText}>Request No.</Text>
            <Text style={styles.rowItemText}>{data?.dispute_request_no}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowItemText}>Status</Text>
            <Text style={styles.rowItemText}>{statusText}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowItemText}>Order ID</Text>
            <Text style={styles.rowItemText}>{data?.order_number}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.rowItemText}>Create At</Text>
            <Text style={styles.rowItemText}>
              {moment(data?.created_at).format('DD MMM, YYYY')}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderActions = () => {
    return (
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="attach-outline" size={ms(24)} />
      </TouchableOpacity>
    );
  };

  // const renderSend = (props) => {
  //   return (
  //     <Send {...props} containerStyle={styles.sendButton}>
  //       <Icon name="send-outline" size={ms(20)} color={colors.blue} />
  //     </Send>
  //   );
  // };

  const options = [];
  if (data?.dispute_status_id < 3) {
    options.push(<>
      <MenuItem onPress={() => _menuAction('cancel')}>
        Cancel Order
      </MenuItem>
      <MenuDivider />
    </>)
  }
  if (data?.dispute_status_id === 2) {
    options.push(<MenuItem onPress={() => _menuAction('return')}>
      Return Package
    </MenuItem>)
  }

  return (
    <View style={styles.root}>
      <Header
        isBack
        title="Dispute Detail"
        center
        rightActions={
          options?.length ? <Menu
            visible={menuVisible}
            anchor={
              <TouchableOpacity
                style={styles.menuIc}
                onPress={() => setMenuVisible(true)}>
                <MaterialIcon
                  name="more-vert"
                  size={ms(24)}
                  color={colors.white}
                />
              </TouchableOpacity>
            }
            onRequestClose={_closeMenu}>
            {options?.map(item => item)}
          </Menu> : null
        }
      />
      {renderInfo()}
      {/* <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser?.id,
        }}
        // renderActions={renderActions}
        alwaysShowSend
        scrollToBottom
        renderAvatar={null}
        textInputProps={{
          multiline: false,
        }}
        renderSend={renderSend}
        isLoadingEarlier={loadMore}
        listViewProps={{
          onEndReachedThreshold: 1,
          onEndReached: loadMoreMessages,
        }}
      /> */}
      <CancelDisputeRequest
        onSuccess={initData}
        disputeNo={data?.dispute_request_no}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  actionButton: {
    height: '100%',
    width: ms(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: ms(5),
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ms(40),
  },
  card: {
    backgroundColor: 'rgba(197, 206, 224, 0.1)',
    padding: ms(12),
    borderBottomWidth: ms(1),
    borderBottomColor: 'rgba(197, 206, 224, 0.5)',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: ms(8),
  },
  rowItemText: {
    fontFamily: env.fontRegular,
    fontSize: ms(13),
    color: '#87879D',
  },
  menuIc: {
    paddingHorizontal: ms(10),
  },
});
