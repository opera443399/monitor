import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  Button,
  View,
  YellowBox
} from 'react-native';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from "react-navigation";

import styles from './css'

//https://github.com/react-navigation/react-navigation/issues/3956
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

// ------ global var ------
var userInfo = {
  default: {
    url: 'http://127.0.0.1/userinfo',
    accessID: 'admin',
    accessSecret: 'xxx',
  },
  url: '',
  accessID: '',
  accessSecret: '',
  active: {
    env: '',
    urlPrefix: '',
    accessToken: '',
  },
};

const iconDefault = {
  blue: '\uD83D\uDD35',
  red: '\uD83D\uDD34',
  project: '\uD83D\uDCCC',
  log: '\uD83D\uDCC4',
  home: '\uD83C\uDFE1',
  profile: '\uD83C\uDFA8',
  refresh: '\u21BB',
};

const errMap = {
  eFetchData: 'Error occurred on fetch data!',
};

// ------ ProjectEnvScreen ------
class ProjectEnvScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: iconDefault.project + 'Environment',
      headerRight: (
        <Button
          onPress={() => {
            const refreshFunc = navigation.getParam('refresh');
            refreshFunc && refreshFunc();
          }}
          title={iconDefault.refresh}
          color="#FFF"
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      errMsg: '',
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ refresh: this.fetchData.bind(this) });
    this.fetchData();
  }

  async fetchData() {
    try {
      let url = userInfo.url;
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessID': userInfo.accessID,
          'accessSecret': userInfo.accessSecret,
        })
      });
      let responseJson = await response.json();
      //console.log('responseJson = ' + JSON.stringify(responseJson));
      this.setState({
        isLoading: false,
        errMsg: '',
        dataSource: responseJson.data,
      });
    } catch (error) {
      console.log(error.message);
      this.setState({
        errMsg: errMap.eFetchData,
      });
      console.error(errMap.eFetchData);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.msg}>
          <StatusBar barStyle="light-content" />
          <View style={styles.isLoading}>
            <ActivityIndicator />
          </View>
          <Text style={styles.error}>{this.state.errMsg}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msg}>
          <Text style={styles.subtitle}>{userInfo.accessID}'s env</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => {
                userInfo.active = item;
                this.props.navigation.navigate('ProjectList');
              }}>
                <View style={styles.row1}>
                  <View style={styles.box2R1C1}>
                    <Text style={styles.box2R1C1A}>{iconDefault.project}</Text>
                  </View>
                  <View style={styles.box2R1C2}>
                    <Text style={styles.box2R1C2A}>{item.env}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

// ------ ProjectListScreen ------
class ProjectListScreen extends React.Component {
  static navigationOptions = {
    title: 'Project List',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      isLoading: true,
      errMsg: '',
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      let url = userInfo.active.urlPrefix + '/project';
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessToken': userInfo.active.accessToken,
          'runEnv': userInfo.active.env,
        })
      });
      let responseJson = await response.json();
      //console.log('responseJson = ' + JSON.stringify(responseJson));
      this.setState({
        isLoading: false,
        errMsg: '',
        dataSource: responseJson.data,
      });
    } catch (error) {
      console.log(error.message);
      this.setState({
        errMsg: errMap.eFetchData,
      });
      console.error(errMap.eFetchData);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.msg}>
          <StatusBar barStyle="light-content" />
          <View style={styles.isLoading}>
            <ActivityIndicator />
          </View>
          <Text style={styles.error}>{this.state.errMsg}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msg}>
          <Text style={styles.subtitle}>{userInfo.active.env}</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => {
                this.props.navigation.navigate('ProjectDetails', {
                  projectIcon: item.icon,
                  projectName: item.name,
                });
              }}>
                <View style={styles.row1}>
                  <View style={styles.box2R1C1}>
                    <Text style={styles.box2R1C1A}>{item.icon == '' ? iconDefault.project : item.icon}</Text>
                  </View>
                  <View style={styles.box2R1C2}>
                    <Text style={styles.box2R1C2A}>{item.name}</Text>
                  </View>
                  <View style={styles.box2R1C3}>
                    <Text style={styles.box2R1C3A}>{item.status == '1' ? iconDefault.blue : iconDefault.red}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

// ------ ProjectDetailsScreen ------
class ProjectDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Project Details',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const projectIcon = navigation.getParam('projectIcon', iconDefault.project);
    const projectName = navigation.getParam('projectName');

    this.state = {
      isLoading: true,
      errMsg: '',
      projectIcon: projectIcon,
      projectName: projectName,
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      let url = userInfo.active.urlPrefix + '/service';
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessToken': userInfo.active.accessToken,
          'runEnv': userInfo.active.env,
          'projectName': this.state.projectName,
        })
      });
      let responseJson = await response.json();
      //console.log('responseJson = ' + JSON.stringify(responseJson));
      this.setState({
        isLoading: false,
        errMsg: '',
        dataSource: responseJson.data,
      });
    } catch (error) {
      this.setState({
        errMsg: errMap.eFetchData,
      });
      console.error(errMap.eFetchData);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.msg}>
          <StatusBar barStyle="light-content" />
          <View style={styles.isLoading}>
            <ActivityIndicator />
          </View>
          <Text style={styles.error}>{this.state.errMsg}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msg}>
          <Text style={styles.subtitle}>{this.state.projectName}-{userInfo.active.env}</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View style={styles.row1}>
                <View style={styles.box2R1C1}>
                  <Text style={styles.box2R1C1A}>{this.state.projectIcon}</Text>
                </View>
                <View style={styles.box2R1C2}>
                  <Text style={styles.box2R1C1A}>{item.name}</Text>
                  <Text style={styles.box2R1C1B}>{item.image}</Text>
                </View>
                <View style={styles.box2R1C3}>
                  <Text style={styles.box2R1C1A}>{item.replicas}</Text>
                  <Button
                    onPress={() => this.props.navigation.navigate('LogsModal')}
                    title={iconDefault.log}
                    style={styles.box2R1C1B}
                  />
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

// ------ LogsModalScreen ------
class LogsModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a log modal demo!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

// ------ ProfileScreen ------
class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  componentDidMount() {
    this._onGetData();
  }

  _onGetData() {
    let keyUserInfo = ['activeURL', 'activeAccessID', 'activeAccessSecret']

    AsyncStorage.multiGet(keyUserInfo, (errs, result) => {
      if (!errs) {
        userInfo.url = (result[0][1] !== null) ? result[0][1] : '';
        userInfo.accessID = (result[1][1] !== null) ? result[1][1] : '';
        userInfo.accessSecret = (result[2][1] !== null) ? result[2][1] : '';
        //console.log("_onGetData");
      }
    });
  }

  render() {
    return (
      <View style={styles.msg}>
        <StatusBar barStyle="light-content" />
        <Text>Profile View</Text>
        <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </View>
    )
  }
}

// ------ SettingsScreen ------
class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeURL: userInfo.url,
      activeAccessID: userInfo.accessID,
      activeAccessSecret: userInfo.accessSecret,
    }
  }

  _onSetData() {
    let kvUserInfo = [
      ['activeURL', this.state.activeURL],
      ['activeAccessID', this.state.activeAccessID],
      ['activeAccessSecret', this.state.activeAccessSecret],
    ]

    AsyncStorage.multiSet(kvUserInfo, (errs) => {
      if (!errs) {
        userInfo.url = this.state.activeURL;
        userInfo.accessID = this.state.activeAccessID;
        userInfo.accessSecret = this.state.activeAccessSecret;
        alert("Saved!");
        //console.log("_onSetData");
      }
    });
  }

  _onResetData() {
    userInfo.url = userInfo.default.url;
    userInfo.accessID = userInfo.default.accessID;
    userInfo.accessSecret = userInfo.default.accessSecret;

    let kvUserInfo = [
      ['activeURL', userInfo.default.url],
      ['activeAccessID', userInfo.default.accessID],
      ['activeAccessSecret', userInfo.default.accessSecret],
    ]

    AsyncStorage.multiSet(kvUserInfo, (errs) => {
      if (!errs) {
        alert("Done!");
        //console.log("_onResetData");
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>URL: </Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="url"
                style={styles.row2TextInput}
                onEndEditing={(event) => this.setState({ activeURL: event.nativeEvent.text })}
                onSubmitEditing={(event) => this.refs.accessID.focus()}
                autoFocus={true}
              >{userInfo.url}</TextInput>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>AccessID: </Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="accessID"
                style={styles.row2TextInput}
                onEndEditing={(event) => this.setState({ activeAccessID: event.nativeEvent.text })}
                onSubmitEditing={(event) => this.refs.accessSecret.focus()}
              >{userInfo.accessID}</TextInput>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>AccessSecret: </Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="accessSecret"
                secureTextEntry={true}
                style={styles.row2TextInput}
                onEndEditing={(event) => this.setState({ activeAccessSecret: event.nativeEvent.text })}
              >{userInfo.accessSecret}</TextInput>
            </View>
          </View>
          <Button
            title="Apply"
            onPress={() => this._onSetData()}
          />
          <Button
            title="Reset"
            onPress={() => this._onResetData()}
          />
        </View>
      </View>
    )
  }
}

const ProjectStack = createStackNavigator(
  {
    ProjectEnv: {
      screen: ProjectEnvScreen,
    },
    ProjectList: {
      screen: ProjectListScreen,
    },
    ProjectDetails: {
      screen: ProjectDetailsScreen,
    },
  },
  {
    initialRouteName: 'ProjectEnv',

    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const HomeStack = createStackNavigator(
  {
    Project: {
      screen: ProjectStack,
    },
    LogsModal: {
      screen: LogsModalScreen,
    },
  },
  {
    initialRouteName: 'Project',
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor, focused }) => (
        <Text>{iconDefault.home}</Text>
      ),
    },
    mode: 'modal',
    headerMode: 'none',
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    initialRouteName: 'Profile',
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor, focused }) => (
        <Text>{iconDefault.profile}</Text>
      ),
    },
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
    },
    Profile: {
      screen: ProfileStack,
    },
  },
  {
    initialRouteName: 'Profile',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}