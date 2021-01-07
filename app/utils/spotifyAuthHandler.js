import { authorize, refresh } from 'react-native-app-auth';

class AuthHandler {
    constructor() {
        this.spotifyConfig = {
            clientId: '1b1e017c24664c55b32c923a503231e9',
            clientSecret: 'df828c21b24e48e8b6c1beadead2c6c9',
            redirectUrl: 'com.myapp:/oauth',
            scopes: [
                'user-modify-playback-state',
                'playlist-read-private'
            ],
            serviceConfiguration: {
                authorizationEndpoint: 'https://accounts.spotify.com/authorize',
                tokenEndpoint: 'https://accounts.spotify.com/api/token'
            },
        };
    }

    async onLogin() {
        try {
            const res = await authorize(this.spotifyConfig);

            alert(JSON.stringify(res));

            return result;
        } catch (err) {
            console.log('onLogin()', err);
        }
    }

    async refreshCredentials(refreshToken) {
        const res = await refresh(this.spotifyConfig, {
            refreshToken: refreshToken,
        });
        return result;
    }
}

const spotifyAuthHandler = new AuthHandler();
export default spotifyAuthHandler;