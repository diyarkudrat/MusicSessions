import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from "../screens/HomeScreen";
import NewGroupScreen from '../screens/NewGroupScreen';

const MusicSessionStack = createStackNavigator();
const CreateNewSessionStack = createStackNavigator();

function MusicSession() {
    return (
        <MusicSessionStack.Navigator>
            <MusicSessionStack.Screen
              name="Home" 
              component={HomeScreen}
              options={({ navigation }) => ({
                  headerRight: () => (
                      <IconButton
                        icon="plus-thick"
                        size={28}
                        color="black"
                        onPress={() => navigation.navigate('CreateGroup')}
                      />
                  )
              })}
            />
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