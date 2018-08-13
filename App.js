import { createStackNavigator } from 'react-navigation';
import {
  Home,
  Convos,
  LogIn,
  Settings,
  SignUp,
  SingleConvo,
  Messages,
  Navbar,
  CreateConvo,
} from './client/components';

const RootNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Convos: {
    screen: Convos,
    navigationOptions: {
      headerTitle: 'Conversations',
    },
  },
  LogIn: {
    screen: LogIn,
    navigationOptions: {
      headerTitle: 'Log In',
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      headerTitle: 'Settings',
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerTitle: 'SignUp',
    },
  },
  SingleConvo: {
    screen: SingleConvo,
    navigationOptions: {
      headerTitle: 'Single Conversation',
    },
  },
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerTitle: 'Messages',
    },
  },
  Navbar: {
    screen: Navbar,
    navigationOptions: {
      headerTitle: 'Navbar',
    },
  },
  CreateConvo: {
    screen: CreateConvo,
    navigationOptions: {
      headerTitle: 'CreateConvo',
    },
  },
});

export default RootNavigator;
