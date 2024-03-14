import moment from 'moment';
import _ from 'lodash';

// Mobile number validation
export function phonenumberValidate(mobileNumber) {
  const status =
    /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
      mobileNumber,
    );
  return status;
}

// Email Address validation
export function emailValidate(email) {
  const status =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
  return status;
}

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return;
  const x =
    phoneNumber &&
    phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  return !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
}

export const groupByDate = (data) => {
  var objData = _.groupBy(data, (obj) =>
    moment(obj.order_date_time).format('Do, MMM YYYY'),
  );
  let arr = [];
  Object.keys(objData)?.map((x) => arr.push({title: x, data: objData[x]}));
  return arr;
};

export function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

// seconds to HH:MM:SS
export function convertToTimer(secs) {
  var secNum = parseInt(secs, 10);
  var hours = Math.floor(secNum / 3600);
  var minutes = Math.floor(secNum / 60) % 60;
  var seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}