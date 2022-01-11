import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homebtn from 'src/assets/icons/homebtn.svg';
import Homebtnalt from 'src/assets/icons/homebtnalt.svg';

import Projectbtn from 'src/assets/icons/projectbtn.svg';
import Projectbtnalt from 'src/assets/icons/projectbtnalt.svg';

import Plusbtn from 'src/assets/icons/plus.svg';

import Messagebtn from 'src/assets/icons/messagebtn.svg';
import Messagebtnalt from 'src/assets/icons/messagebtnalt.svg';

import Walletbtn from 'src/assets/icons/walletbtn.svg';
import Walletbtnalt from 'src/assets/icons/walletbtnalt.svg';
//import the screens
import Home from 'src/screens/modules/Home';
import Projects from 'src/screens/modules/Projects';
import CompletedProjectDetail from 'src/screens/modules/Projects/CompletedProjectDetail';
import OngoingProjectDetail from 'src/screens/modules/Projects/OngoingProjectDetail';
import JobOfferDetail from 'src/screens/modules/Projects/JobOfferDetail';
import Settings from 'src/screens/modules/Settings';
import NewProject from 'src/screens/modules/ProjectApplication';
import Proposal from 'src/screens/modules/Proposal';
import ProposalDetail from 'src/screens/modules/Proposal/ProposalDetail';
import Insight from 'src/screens/modules/Insight';
import { ChatScreen } from "src/screens/modules/Messages/ChatScreen";
import { MainCallScreen } from "src/screens/modules/Messages/MainCallScreen";
import Profile from 'src/screens/modules/Profile/';
import ArtisanProfile from 'src/screens/modules/ArtisanProfile';
// import Withdrawal from 'src/screens/modules/Wallet/Withdrawal';
import Wallet from 'src/screens/modules/Wallet';
import Payment from 'src/screens/modules/Wallet/payment';
import ProjectApply from 'src/screens/modules/Home/ProjectDetail';
import EditMyProfile from 'src/screens/modules/EditProfile';

import EditEducation from 'src/screens/modules/EditProfile/Education';
import EditExpertise from 'src/screens/modules/EditProfile/Expertise';
import EditEmployment from 'src/screens/modules/EditProfile/Experience';
import EditUser from 'src/screens/modules/EditProfile/EditUser';
import Conversations from 'src/screens/modules/Messages/Conversations';
import {colors, hp} from 'src/config/variables';
import { CallingScreen } from 'src/screens/modules/Messages/CallingScreen';
import JobOffer from 'src/screens/modules/JobOffer'


const Tab = createBottomTabNavigator();

function ProfileScreen() {
  return <Profile style={{flex: 1}} />;
}

function ArtisanProfileScreen() {
  return <ArtisanProfile style={{flex: 1}} />;
}

function EditProfileScreen() {
  return <EditMyProfile />;
}

function EditExpertiseScreen() {
  return <EditExpertise />;
}

function SettingsScreen() {
  return <Settings />;
}

function InsightScreen() {
  return <Insight />;
}

export function HomeTabs({navigation, route}) {


  return (
    <Tab.Navigator
      initialRouteName="Homex"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopRightRadius: 35,
          borderTopWidth: 1,
          borderTopLeftRadius: 35,
          
          
        },
        tabBarLabelStyle: {
          marginBottom: hp('1%')
        }
        
      }}
     
      tabBarOptions={{
        activeTintColor: colors.white, // Color of tab when pressed
        inactiveTintColor: '#b5b5b5', // Color of tab when not pressed
        activeBackgroundColor: colors.green,
        showIcon: 'true', // Shows an icon for both iOS and Android
        showLabel: 'true', //(Platform.OS !== 'android'), //No label for Android
        labelStyle: {
          fontSize: 11,
          
        },
        
        style: {
          //backgroundColor: colors.white, // Makes Android tab bar white instead of standard blue
          borderTopRightRadius: 35,
          borderTopWidth: 1,
          borderTopLeftRadius: 35,
          overflow: 'hidden',
          paddingBottom: 10
          //height: (Platform.OS === 'ios') ? 58 : 60 // I didn't use this in my app, so the numbers may be off.
        },
        
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        
        options={{
          tabBarItemStyle: {
            borderTopLeftRadius: 35,
          },
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size, focused}) =>
           
            focused ? <Homebtn /> : <Homebtnalt />,
        }}
        style={{borderTopLeftRadius: 25}}
      />

      <Tab.Screen
        name="Projects"
        component={Projects}
        options={{
          tabBarLabel: 'Projects',
          tabBarIcon: ({color, size, focused}) =>
           
            focused ? <Projectbtn /> : <Projectbtnalt />,
        }}
      />

      <Tab.Screen
        name="NewProject"
        component={({ navigation }) => {
          return (
            <Plusbtn />
          )
        }}
        options={{
          tabBarLabel: 'New Project',
          tabBarIconStyle: {
            position: 'absolute',
            top: -1,
            color: 'green'
          },
          tabBarIcon: ({color, size, focused}) =>
            <Plusbtn   />,
          tabBarButton: (props) => (
            <TouchableOpacity
            
            {...props}
              onPress={() => navigation.navigate("NewProject")} />
          )
        }}
      />

     <Tab.Screen
        name="Messages"
        component={Conversations}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({color, size, focused}) =>
            focused ? <Messagebtn /> : <Messagebtnalt />,
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarItemStyle: {
            borderTopRightRadius: 35,
          },
          tabBarLabel: 'Wallet',
          tabBarIcon: ({color, size, focused}) =>
          
            focused ? <Walletbtn /> : <Walletbtnalt />,
        }}
      />

      
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
const BottomTabComponent = reduxProps => {
  
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeTabs} />
      <Stack.Screen name="Proposal" component={ProjectApply} />
      <Stack.Screen name="NewProject" component={NewProject} />
      <Stack.Screen name="ProposalScreen" component={Proposal} />
      <Stack.Screen name="ProposalDetail" component={ProposalDetail} />
      <Stack.Screen name="CompletedProjectDetail" component={CompletedProjectDetail} />
      <Stack.Screen name="OngoingProjectDetail" component={OngoingProjectDetail} />
      <Stack.Screen name="JobOfferDetail" component={JobOfferDetail} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ArtisanProfile" component={ArtisanProfile} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="EditExpertise" component={EditExpertiseScreen} />
      <Stack.Screen name="Insight" component={InsightScreen} />
      <Stack.Screen name="EditEmployment" component={EditEmployment} />
      <Stack.Screen name="EditEducation" component={EditEducation} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="CallingScreen" component={CallingScreen} />
      <Stack.Screen name="MainCallScreen" component={MainCallScreen} />
      <Stack.Screen name="CreateJobOffer" component={JobOffer} />
      {/* 
     
      <Stack.Screen name="Withdrawal" component={Withdrawal} />
      
       */}
      
    </Stack.Navigator>
  );
};

export default BottomTabComponent;
