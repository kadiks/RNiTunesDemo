import React from 'react';
import {
  ActivityIndicator,
  Image,
  ListView,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
      selectedIndex: 0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };
    this.renderRow = this.renderRow.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeSearchType = this.onChangeSearchType.bind(this);
  }

  onChangeSearchType(evt) {
    this.setState({
      selectedIndex: evt.nativeEvent.selectedSegmentIndex,
    });
  }

  onChangeText(text) {
    console.log('App#onChangeText text:', text);
    if (text.length >= 3) {
      this.setState({
        isLoading: true,
      });
      if (this.state.selectedIndex === 0) {
        this.searchTrack(text);
      } else {
        this.searchPlaylists(text);
      }
    }
  }

  convertPlaylistsToTracks(playlists) {
    const trackPlaylistMap = {};
    playlists.forEach((playlist) => {
      const { name, persistentId } = playlist;
      const header = `${name} - ${persistentId}`;
      if (trackPlaylistMap.hasOwnProperty(header) === false) {
        trackPlaylistMap[header] = [];
      }
      playlist.tracks.forEach((track) => {
        trackPlaylistMap[header].push(track);
      });
    });
    // console.log(trackPlaylistMap);
    return trackPlaylistMap;
  }

  searchTrack(text) {
    iTunes.getTracks({
      query: {
        title: text,
      },
      fields: [
        'title',
        'artist',
        'albumArtist',
        'artwork'
      ],
    }).then(tracks => {
      // console.log('tracks:', tracks);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(tracks),
        isLoading: false,
      });
    });
  }

  searchPlaylists(text) {
    iTunes.getPlaylists({
      query: {
        name: text,
      },
      fields: [
        'name',
        'tracks',
        'playCount',
        'persistentId',
      ],
    }).then(playlists => {
      // console.log('playlists:', playlists);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          this.convertPlaylistsToTracks(playlists)
        ),
        isLoading: false,
      });
    });
  }

  renderSectionHeader(sectionData, category) {
    return (
      <View
        style={styles.header}>
        <Text style={{fontWeight: "700"}}>{category}</Text>
      </View>
    );
  }

  renderRow(item) {
    return this.renderTrackItem(item);
    if (this.state.selectedIndex === 0) {
      return this.renderTrackItem(item);
    }
    return this.renderPlaylistItem(item);
  }

  renderPlaylistItem(playlist) {
    return (
      <View>
        <Text style={styles.title}>{playlist.name}</Text>
      </View>
    );
  }

  renderTrackItem(track) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          Actions.player({
            track,
          })
        }}>
        <Image
          source={{uri: track.artwork }}
          style={styles.artwork}/>
        <View style={styles.text}>
          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.artist}>{track.albumArtist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSearchType() {
    return (
      <SegmentedControlIOS
        values={['Tracks', 'Playlists']}
        selectedIndex={this.state.selectedIndex}
        onChange={this.onChangeSearchType} />
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
          {this.renderSearchType()}
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
          {this.renderSearchType()}
          {this.renderInput()}
          <Text>
            No title have been found
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderSearchType()}
        {this.renderInput()}
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader} />
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
  artwork: {
    // flex: 1,
    height: 100,
    width: 100,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    backgroundColor: '#CCC',
  },
  input: {
    height: 40,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    height: 100,
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    color: 'black',
    fontSize: 17,
    flexWrap: 'wrap',
  },
});
