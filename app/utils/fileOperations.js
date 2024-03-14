import ImagePicker from 'react-native-image-crop-picker';

export async function openPhotos(options) {
  try {
    const response = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      ...options,
    });
    const ext = '.' + response.path?.split(/[#?]/)[0].split('.').pop().trim();
    let filename = new Date().getTime() + ext;
    const file = {
      uri: response.path,
      type: response.mime,
      name: filename,
      size: response.size,
    };
    if (response.data) file.base64 = response.data;
    if (response.duration) file.duration = response.duration;
    return file;
  } catch (error) {}
}

export async function openCamera(options) {
  try {
    const response = await ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: false,
      ...options,
    });
    const ext = '.' + response.path?.split(/[#?]/)[0].split('.').pop().trim();
    let filename = new Date().getTime() + ext;
    const file = {
      uri: response.path,
      type: response.mime,
      name: filename,
      size: response.size,
    };
    if (response.data) file.base64 = response.data;
    if (response.duration) file.duration = response.duration;
    return file;
  } catch (error) {}
}
