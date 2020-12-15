import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { updateElectNewLeader } from '../firebase';

function VotingScreen({ route, navigation }) {
    const [users, setUsers] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        function fetchData() {
            if (route.params) {
                const roomUsers = route.params.users.map((user) => {
                    return { user, checked: false };
                })

                 setUsers(roomUsers);
            }
        }
        
        if (!isCancelled) fetchData()

        return () => {
            isCancelled = true;
        }
    }, [])

    const showUsers = () => {
        return users.map((user) => 
          <CheckBox center title={user.user} key={user.user} checked={user.checked} onPress={() => handleOnPress(user)} />
          
        )
    }

    const handleOnPress = async (clickedUser) => {
        const updatedUsers = users.map(user => {
            if (user.user === clickedUser.user) {
                return { ...user, checked: true };
            }
            
            return user;
        });

        await updateElectNewLeader(clickedUser.user, route.params.roomId);
        setUsers(updatedUsers);

        // navigation.navigate('Wait', {
        //     roomId: route.params.roomId,
        //     user: route.params.user
        // });
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View>
                { isWaiting ? <Text>Waiting...</Text> : users ? showUsers() : null }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2D3F4D'
    }
})

export default VotingScreen;