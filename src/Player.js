import React from 'react';
import {
  Dimensions,
  Image,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import iTunes from 'react-native-itunes';

export default class Player extends React.Component {
  state = {
    isPlaying: true,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      iTunes.playTrack(this.props.track);
    });
  }

  render() {
    const { isPlaying } = this.state;
    const { title, albumArtist, artwork } = this.props.track;
    return (
      <View
        style={styles.container}>
        <Image
          source={{ uri: artwork }}
          style={{
            height: Dimensions.get('window').width,
            width: Dimensions.get('window').width,
          }} />
        <Text>{title}</Text>
        <Text>{albumArtist}</Text>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              iTunes.pause();
            } else {
              iTunes.play();
            }
            this.setState({
              isPlaying: !isPlaying,
            });
          }}>
          <Icon
            size={27}
            name={isPlaying ? 'ios-pause' : 'ios-play'}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
});
