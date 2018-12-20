import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar, 
  Text, 
  TouchableHighlight,
  View,
  YellowBox
} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import styles from './css'

//https://github.com/react-navigation/react-navigation/issues/3956
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const uriPrefix = 'http://127.0.0.1/';
const xAccessToken = 'xxx';
const flagOn = '\uD83D\uDD35';
const flagOff = '\uD83D\uDD34';
const defaultIconProject = '\uD83D\uDC98';
const defaultIconLog = '\uD83D\uDCC4';
const errFetchData = 'failed to fetch data!';

class ProjectListScreen extends React.Component {
  static navigationOptions = {
    title: 'Project List',
  };

  constructor(props) {
    //console.log('@constructor');
    super(props);
    this.state = { 
      isLoading: true,
      errMsg: '',
    }
  }

  componentDidMount() {
    //console.log('@componentDidMount');
    this.apiGetData();
  }

  componentWillUnmount() {
    //console.log('@componentWillUnmount');
  }

  async apiGetData() {
    //console.log('@apiGetData');
    try {
      let url = uriPrefix + 'project';
      let response = await fetch(url, {
        method: 'post',
        body: JSON.stringify({
          'accessToken': xAccessToken,
        })
      });
      let responseJson = await response.json();
      //console.log('responseJson = ' + JSON.stringify(responseJson));
      this.setState({
        isLoading: false,
        errMsg: '',
        projectEnv: responseJson.env,
        dataSource: responseJson.data,
      });
    } catch (error) {
      this.setState({
        errMsg: errFetchData,
      });
      console.error(errFetchData);
    }
  }

  render() {
    //console.log('@render');
    if (this.state.isLoading) {
      //console.log('isLoading => true');
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

    //console.log('isLoading => false');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msg}>
          <Text style={styles.subtitle}>{this.state.projectEnv}</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => {
                this.props.navigation.navigate('ProjectDetails', {
                  projectIcon: item.icon,
                  projectName: item.name,
                  projectEnv: this.state.projectEnv
                });
              }}>
                <View style={styles.row}>
                  <View style={styles.box2R1C1}>
                    <Text style={styles.box2R1C1A}>{item.icon}</Text>
                  </View>
                  <View style={styles.box2R1C2}>
                    <Text style={styles.box2R1C2A}>{item.name}</Text>
                  </View>
                  <View style={styles.box2R1C3}>
                    <Text style={styles.box2R1C3A}>{item.status == '1' ? flagOn : flagOff}</Text>
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

class ProjectDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Project Details',
  };

  constructor(props) {
    //console.log('@constructor');
    super(props);
    const { navigation } = this.props;
    const projectIcon = navigation.getParam('projectIcon', defaultIconProject);
    const projectName = navigation.getParam('projectName', 'default');
    const projectEnv = navigation.getParam('projectEnv', 'default');

    this.state = {
      isLoading: true,
      errMsg: '',
      projectIcon: projectIcon,
      projectName: projectName,
      projectEnv: projectEnv
    }
  }

  componentDidMount() {
    //console.log('@componentDidMount');
    this.apiGetData();
  }

  componentWillUnmount() {
    //console.log('@componentWillUnmount');
  }

  async apiGetData() {
    //console.log('@apiGetData');
    try {
      let url = uriPrefix + 'service';
      let response = await fetch(url,{
        method: 'post',
        body: JSON.stringify({
          'accessToken': xAccessToken,
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
        errMsg: errFetchData,
      });
      console.error(errFetchData);
    }
  }

  render() {
    //console.log('@render');
    if (this.state.isLoading) {
      //console.log('isLoading => true');
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

    //console.log('isLoading => false');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.msg}>
          <Text style={styles.subtitle}>{this.state.projectName}-{this.state.projectEnv}</Text>
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
                  <Text style={styles.box2R1C3B}>{defaultIconLog}</Text>
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

const AppNavigator = createStackNavigator(
  {
    ProjectList: {
      screen: ProjectListScreen,
    },
    ProjectDetails: {
      screen: ProjectDetailsScreen,
    },
  },
  {
    initialRouteName: 'ProjectList',

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

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}