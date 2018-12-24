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
  uri: 'http://127.0.0.1/userinfo',
  accessID: 'admin',
  accessSecret: 'xxx',
  active: {
    env: '',
    uriPrefix: '',
    accessToken: '',
  },
};

const iconDefault = {
  blue: '\uD83D\uDD35',
  red: '\uD83D\uDD34',
  project: '\u00AE\uFE0F',
  log: '\uD83D\uDCC4',
};

const errMap = {
  eFetchData: 'Error occurred on fetch data!',
};

// ------ HomeScreen ------
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
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
      let url = userInfo.uri;
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
          <Text style={styles.subtitle}>Select Environment</Text>
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
      let url = userInfo.active.uriPrefix + '/project';
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
      let url = userInfo.active.uriPrefix + '/service';
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
                  <Text style={styles.box2R1C2A}>{item.name} </Text>
                  <Text style={styles.box2R1C2B}>{item.image}</Text>
                </View>
                <View style={styles.box2R1C3}>
                  <Text style={styles.box2R1C3A}>{item.replicas}</Text>
                  <Text style={styles.box2R1C3B}>{iconDefault.log}</Text>
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

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    ProjectList: {
      screen: ProjectListScreen,
    },
    ProjectDetails: {
      screen: ProjectDetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',

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
    Home: HomeStack,
    Profile: ProfileStack,
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}