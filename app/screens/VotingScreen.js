import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { updateLeaderVotes, setNewLeader, getLeaderName } from '../firebase';

function VotingScreen({ route, navigation }) {
    const [users, setUsers] = useState([]);

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
    };

    const handleOnPress = async (clickedUser) => {
        const updatedUsers = users.map(user => {
            if (user.user === clickedUser.user) {
                return { ...user, checked: true };
            }
            
            return user;
        });

        setUsers(updatedUsers);
        updateLeaderVotes(clickedUser.user, route.params.roomId);

        setTimeout(() => {
            setNewLeader(route.params.roomId);
            navigation.navigate('GroupSession');
        }, 5000);
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View>
                { users ? showUsers() : null }
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
    },
    text: {
        color: "white",
        fontSize: 36,
        fontWeight: "600",
        bottom: 20,
    }
});

export default VotingScreen;