import React from 'react';
import {
  ActivityIndicator,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Actions,
} from 'react-native-router-flux';
import iTunes from 'react-native-itunes';

var fields = [];
fields.push('persistentId');
fields.push('albumPersistentId');
fields.push('artistPersistentId');
fields.push('albumArtistPersistentId');
fields.push('genrePersistentId');
fields.push('composerPersistentId');
fields.push('podcastPersistentId');
fields.push('mediaType');
fields.push('title');
fields.push('albumTitle');
fields.push('artist');
fields.push('albumArtist');
fields.push('genre');
fields.push('composer');
fields.push('duration');
fields.push('playbackDuration');
fields.push('albumTrackNumber');
fields.push('albumTrackCount');
fields.push('discNumber');
fields.push('discCount');
fields.push('artwork');
fields.push('lyrics');
fields.push('isCompilation');
fields.push('releaseDate');
fields.push('beatsPerMinute');
fields.push('comments');
fields.push('assetUrl');
fields.push('isCloudItem');
fields.push('playCount');
fields.push('skipCount');
fields.push('rating');
fields.push('playedDate');
fields.push('userGrouping');
fields.push('bookmarkTime');

//var iTunes = require('react-native-itunes');
var startTime = (new Date()).getTime();

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
    this.renderRow = this.renderRow.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(text) {
    console.log('App#onChangeText text:', text);
    if (text.length >= 3) {
      this.setState({
        isLoading: true,
      });
      iTunes.getTracks({
        query: {
          title: text,
        }
      }).then(tracks => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(tracks),
          isLoading: false,
        });
      });
    }
  }

  renderRow(track) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          Actions.player({
            track,
          })
        }}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}> - {track.albumArtist}</Text>
      </TouchableOpacity>
    );
  }

  renderInput() {
    return (
      <TextInput
        style={styles.input}
        placeholder={'Title...'}
        onChangeText={this.onChangeText}
        />
    );
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View
          style={styles.container}>
          {this.renderInput()}
          <View>
            <ActivityIndicator />
          </View>
        </View>
      );
    }

    if (this.state.dataSource.getRowCount() === 0) {
      return (
        <View
          style={styles.container}>
          {this.renderInput()}
          <Text>
            No title have been found
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderInput()}
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  artist: {
    color: 'grey',
    fontSize: 14,
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
  input: {
    height: 40,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    height: 30,
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 17,
    flexWrap: 'wrap',
  },
});
