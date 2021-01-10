import Spotify from 'spotify-web-api-js';

const spotifyClient = new Spotify();

export const accessTokenAPI = async (accessToken) => {
    await spotifyClient.setAccessToken(accessToken);
};

export const getCurrentUserID = async () => {
    const userData = await spotifyClient.getMe();
    
    return userData.id;
};

export const getCurrentUserPlaylists = async () => {
    const userId = getCurrentUserID();
    const playlists = await spotifyClient.getUserPlaylists(userId);
    
    return playlists;
}

