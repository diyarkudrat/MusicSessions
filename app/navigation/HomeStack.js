import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from "../screens/WelcomeScreen";
import NewGroupScreen from '../screens/NewGroupScreen';

const Stack = createStackNavigator();

function HomeStack(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={WelcomeScreen} />
            <Stack.Screen name="CreateGroup" component={NewGroupScreen} />
        </Stack.Navigator>
    );
}

export default HomeStack;