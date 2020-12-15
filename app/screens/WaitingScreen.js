import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { updateWaitingUsers } from '../firebase';

function WaitingScreen({ route, navigation }) {
    const { roomId, user } = route.params;

    // updateWaitingUsers(roomId, user.userId);

    // useEffect(() => {
    //     // async function fetchData() {

    //     // }
    // }, [])

    return (
        <Text>WAITING...</Text>
    );
}

export default WaitingScreen;