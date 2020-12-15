import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from "../screens/HomeScreen";
import NewGroupScreen from '../screens/NewGroupScreen';
import GroupScreen from '../screens/GroupScreen';
import VotingScreen from '../screens/VotingScreen';
import WaitingScreen from '../screens/WaitingScreen';

const MusicSessionStack = createStackNavigator();
const CreateNewSessionStack = createStackNavigator();

function MusicSession() {
    return (
        <MusicSessionStack.Navigator screenOptions={{headerShown: false,}}>
            <MusicSessionStack.Screen
              name="Home" 
              component={HomeScreen}
            />
            <CreateNewSessionStack.Screen
              name="GroupSession"
              component={GroupScreen}
            />
            <MusicSessionStack.Screen component={VotingScreen} name="VoteNewLeader" />
            <MusicSessionStack.Screen component={WaitingScreen} name="Wait" />
        </MusicSessionStack.Navigator>
    );
}

function HomeStack(props) {

    return (
        <CreateNewSessionStack.Navigator mode="modal" headerMode="none">
            <CreateNewSessionStack.Screen name="MusicSession" component={MusicSession} />
            <CreateNewSessionStack.Screen name="CreateGroup" component={NewGroupScreen} />
        </CreateNewSessionStack.Navigator>
    );
}

export default HomeStack;