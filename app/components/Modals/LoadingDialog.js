import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import colors from "../../constants/colors";


class _LoadingDialog extends React.Component {
  render() {
    const { rootLoader, rootLoaderTitle } = this.props;
    return (
      <Modal
        isVisible={rootLoader}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={[
              styles.loaderContainer,
              rootLoaderTitle === "" && { alignSelf: "center" },
            ]}
          >
            <ActivityIndicator size="large" color={colors.white} />
            {rootLoaderTitle !== "" && (
              <Text style={styles.titleTextStyle}>{rootLoaderTitle}</Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps({ activityIndicator }) {
  return {
    rootLoader: activityIndicator.rootLoader,
    rootLoaderTitle: activityIndicator.rootLoaderTitle,
  };
}

export default connect(mapStateToProps)(_LoadingDialog);

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 25,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 20,
    color: colors.black,
    marginLeft: 20,
  },
});
