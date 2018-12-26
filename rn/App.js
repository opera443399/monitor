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
  ScrollView,
  YellowBox
} from 'react-native';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from "react-navigation";

import styles from './css'

//https://github.com/react-navigation/react-navigation/issues/3956
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

// ------ global var ------
var userInfo = {
  default: {
    endpoint: 'http://127.0.0.1/userinfo',
    accessID: 'admin',
    accessSecret: 'xxx',
    tail: '20',
  },
  endpoint: '',
  accessID: '',
  accessSecret: '',
  tail: '',
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
      let url = userInfo.endpoint;
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessID': userInfo.accessID,
          'accessSecret': userInfo.accessSecret,
        })
      });
      let responseJson = await response.json();
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
                    onPress={() => this.props.navigation.navigate('LogsModal', {
                      serviceID: item.id,
                    })}
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
  static navigationOptions = {
    title: 'Service Logs',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const serviceID = navigation.getParam('serviceID');

    this.state = {
      isLoading: true,
      errMsg: '',
      serviceID: serviceID,
      tail: userInfo.tail,
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      let url = userInfo.active.urlPrefix + '/service/logs';
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessToken': userInfo.active.accessToken,
          'runEnv': userInfo.active.env,
          'serviceID': this.state.serviceID,
          'tail': this.state.tail,
        })
      });
      console.info(response);
      let responseText = await response.text();
      this.setState({
        isLoading: false,
        errMsg: '',
        dataSource: responseText,
      });
    } catch (error) {
      console.error(error);
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
          <Text style={styles.subtitle}>Last {this.state.tail} lines of service logs</Text>
        </View>
        <View style={styles.content}>
          <ScrollView>
            <View style={styles.box2R1C1}>
              <Text>{this.state.dataSource}</Text>
              <Button
                onPress={() => this.props.navigation.goBack()}
                title="Dismiss"
              />
            </View>
          </ScrollView>
        </View>
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
    let keyUserInfo = ['activeEndpoint', 'activeAccessID', 'activeAccessSecret', 'activeTail']

    AsyncStorage.multiGet(keyUserInfo, (errs, result) => {
      if (!errs) {
        userInfo.endpoint = (result[0][1] !== null) ? result[0][1] : userInfo.default.endpoint;
        userInfo.accessID = (result[1][1] !== null) ? result[1][1] : userInfo.default.accessID;
        userInfo.accessSecret = (result[2][1] !== null) ? result[2][1] : userInfo.default.accessSecret;
        userInfo.tail = (result[3][1] !== null) ? result[3][1] : userInfo.default.tail;
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
      activeEndpoint: userInfo.endpoint,
      activeAccessID: userInfo.accessID,
      activeAccessSecret: userInfo.accessSecret,
      activeTail: userInfo.tail,
    }
  }

  _onSetData() {
    userInfo.endpoint = this.state.activeEndpoint;
    userInfo.accessID = this.state.activeAccessID;
    userInfo.accessSecret = this.state.activeAccessSecret;
    userInfo.tail = this.state.activeTail;

    let kvUserInfo = [
      ['activeEndpoint', this.state.activeEndpoint],
      ['activeAccessID', this.state.activeAccessID],
      ['activeAccessSecret', this.state.activeAccessSecret],
      ['activeTail', userInfo.default.tail],
    ]

    AsyncStorage.multiSet(kvUserInfo, (errs) => {
      if (!errs) {
        alert("Saved!");
        //console.log("_onSetData");
      }
    });
  }

  _onResetData() {
    userInfo.endpoint = userInfo.default.endpoint;
    userInfo.accessID = userInfo.default.accessID;
    userInfo.accessSecret = userInfo.default.accessSecret;
    userInfo.tail = userInfo.default.tail;

    let keyUserInfo = ['activeEndpoint', 'activeAccessID', 'activeAccessSecret', 'activeTail']

    AsyncStorage.multiRemove(keyUserInfo, (errs) => {
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
              <Text>Endpoint</Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="endpoint"
                style={styles.row2TextInput}
                onChangeText={(text) => this.setState({ activeEndpoint: text })}
                onEndEditing={(event) => this.setState({ activeEndpoint: event.nativeEvent.text })}
                onSubmitEditing={(event) => this.refs.accessID.focus()}
                autoFocus={true}
              >{userInfo.endpoint}</TextInput>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>AccessID</Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="accessID"
                style={styles.row2TextInput}
                onChangeText={(text) => this.setState({ activeAccessID: text })}
                onEndEditing={(event) => this.setState({ activeAccessID: event.nativeEvent.text })}
                onSubmitEditing={(event) => this.refs.accessSecret.focus()}
              >{userInfo.accessID}</TextInput>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>AccessSecret</Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="accessSecret"
                secureTextEntry={true}
                style={styles.row2TextInput}
                onChangeText={(text) => this.setState({ activeAccessSecret: text })}
                onEndEditing={(event) => this.setState({ activeAccessSecret: event.nativeEvent.text })}
                onSubmitEditing={(event) => this.refs.tail.focus()}
              >{userInfo.accessSecret}</TextInput>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.box2R2C1}>
              <Text>Tail</Text>
            </View>
            <View style={styles.box2R2C2}>
              <TextInput
                ref="tail"
                style={styles.row2TextInput}
                onChangeText={(text) => this.setState({ activeTail: text })}
                onEndEditing={(event) => this.setState({ activeTail: event.nativeEvent.text })}
              >{userInfo.tail}</TextInput>
            </View>
          </View>
          <View style={styles.row3}>
            <View style={styles.row3Btn}>
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