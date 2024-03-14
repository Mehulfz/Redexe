import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import colors from '../constants/colors'

export default function Avatar ({ size, source, placeholder, containerStyle }) {
  const [loader, setLoader] = useState(true)

  return (
    <View style={[styles.container, size && { height: size, width: size }, containerStyle]}>
      {
        (source && source.uri) ? (
          <Image
            source={source}
            style={styles.imageStyle}
            onError={() => setLoader(true)}
            onLoad={() => setLoader(false)}
          />
        ) : null
      }
      {
        loader && (
          <Image
            // source={placeholder || placeholderIcon}
            style={styles.IconStyles}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  imageStyle: {
    height: '100%',
    width: '100%'
  },
  IconStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute'
  }
})
