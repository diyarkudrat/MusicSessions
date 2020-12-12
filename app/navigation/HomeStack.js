import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

function HomeStack(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={WelcomeScreen} />
        </Stack.Navigator>
    );
}

export default HomeStack;