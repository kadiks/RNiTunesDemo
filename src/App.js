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
  Router,
  Scene,
} from 'react-native-router-flux';
import iTunes from 'react-native-itunes';

import Search from './Search';
import Player from './Player';

export default class App extends React.Component {

  render() {
    return (
      <Router>
        <Scene key={'root'}>
          <Scene key={'search'} component={Search} title={'Search'} />
          <Scene key={'player'} component={Player} />
        </Scene>
      </Router>
    );
  }
}
