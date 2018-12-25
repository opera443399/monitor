import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
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
  url: 'http://127.0.0.1/userinfo',
  accessID: 'admin',
  accessSecret: 'xxx',
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
};

const errMap = {
  eFetchData: 'Error occurred on fetch data!',
};

// ------ ProjectEnvScreen ------
class ProjectEnvScreen extends React.Component {
  static navigationOptions = {
    title: 'Environment',
  };

  constructor(props) {
    super(props);
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
      let url = userInfo.url;
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessID': userInfo.accessID,
          'accessSecret': userInfo.accessSecret,
        })
      });
      let responseJson = await response.json();
      console.log('responseJson = ' + JSON.stringify(responseJson));
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
                <View style={styles.row}>
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
                <View style={styles.row}>
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
              <View style={styles.row}>
                <View style={styles.box2R1C1}>
                  <Text style={styles.box2R1C1A}>{this.state.projectIcon}</Text>
                </View>
                <View style={styles.box2R1C2}>
                  <Text style={styles.box2R1C1A}>{item.name} </Text>
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


class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <View style={styles.msg}>
        <StatusBar barStyle="light-content" />
        <Text>Settings View</Text>
        <Button
          title="Go to Profile"
          onPress={() => this.props.navigation.navigate('Profile')}
        />
      </View>
    )
  }
}

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

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
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}