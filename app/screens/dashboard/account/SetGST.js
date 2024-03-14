import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import {getGSTInfo, submitGSTInfo} from '../../../actions';
import {Button} from '../../../components/Buttons';
import Header from '../../../components/Header';
import {Input} from '../../../components/Inputs';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {getUrlExtension} from '../../../utils/arrayOperations';
import {openPhotos} from '../../../utils/fileOperations';

export default function SetGST() {
  const [GSTId, setGSTId] = useState('');
  const [cname, setCname] = useState('');
  const [GSTNumber, setGSTNumber] = useState('');
  const [file, setFile] = useState('');
  const [currentFile, setCurrentFile] = useState('');
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const res = await getGSTInfo();
    if (res) {
      setGSTId(res.id);
      setCname(res.company_name);
      setGSTNumber(res.gst_no);
      setCurrentFile(res.gstin_image);
    }
  };

  const _handleFile = async () => {
    const response = await openPhotos({
      includeBase64: true,
    });
    setFile('data:image/jpg;base64,' + response.base64);
  };

  const _downloadFile = async () => {
    if (!currentFile) return;
    console.log(currentFile);
    const extension = getUrlExtension(currentFile);
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;
    const options = {
      fromUrl: currentFile,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch((error) => {
        console.log('Download file error: ', error);
      });
  };

  const _submit = async () => {
    const request = {
      user_gst_id: GSTId,
      company_name: cname,
      gst_no: GSTNumber,
    };
    if (file) request.gstin_copy_image = file;
    showLoader(true);
    let res = await submitGSTInfo(request);
    showLoader(false);
    if (res) initData();
  };

  const disabled = !cname || !GSTNumber;

  return (
    <View style={styles.root}>
      <Header title={'Set GSTIN'} isBack />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.infoText}>
          Each taxpayer is assigned a state-wise PAN based 15-digit Goods and
          Service Taxpayer Identification Number (GSTIN). If buyer has Goods and
          Services Tax Identification Number(GSTIN) then for every purchase
          company can avail tax benefits while entering GSTIN details below.
        </Text>
        <Input
          title={'Company Name :'}
          placeholder="Enter company name"
          value={cname}
          onChangeText={setCname}
        />
        <View style={{height: moderateScale(20)}} />
        <Input
          title={'GST No :'}
          placeholder="Enter GST number"
          value={GSTNumber}
          onChangeText={setGSTNumber}
        />
        <View style={{height: moderateScale(20)}} />
        <Text style={styles.inputTitle}>
          Upload : {'   '}
          {currentFile ? (
            <Text onPress={_downloadFile} style={styles.hyperlink}>
              Download
            </Text>
          ) : null}
        </Text>
        <TouchableOpacity
          onPress={_handleFile}
          style={styles.uploadFile}
          activeOpacity={0.7}>
          {file ? (
            <Image
              source={file?.uri ? file : {uri: file}}
              style={styles.uploadedImage}
            />
          ) : (
            <Text style={styles.selectFileText}>Tap to select file</Text>
          )}
        </TouchableOpacity>

        <View style={{height: moderateScale(20)}} />
        <Button
          title={'Submit'}
          onPress={_submit}
          isLoading={loader}
          disabled={loader ? true : disabled}
          containerStyle={styles.btn}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    flexGrow: 1,
    padding: moderateScale(15),
  },
  infoText: {
    fontFamily: env.fontRegular,
    color: colors.darkGray,
    fontSize: moderateScale(12),
    marginBottom: moderateScale(25),
  },
  btn: {
    height: moderateScale(40),
    alignSelf: 'center',
    width: '70%',
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
  inputTitle: {
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    marginBottom: moderateScale(6),
  },
  hyperlink: {
    color: '#1569D9',
    textDecorationLine: 'underline',
  },
});
