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
};

export const playMusic = async (uri) => {
    const options = { "context_uri": uri };
    await spotifyClient.play(options);
};

export const pauseMusic = async () => {
    await spotifyClient.pause();
};

export const skipForward = async () => {
    await spotifyClient.skipToNext();
};

export const skipPrevious = async () => {
    await spotifyClient.skipToPrevious();
};

export const getPlaylistTracks = async (id) => {
    const tracks = await spotifyClient.getPlaylistTracks(id);

    return tracks
};

export const searchQuery = async (query) => {
    const types = ['track']
    const data = await spotifyClient.search(query, types)

    return data;
};

export const addQueue = async (uri) => {
    await spotifyClient.queue(uri);
};

export const currentTrackPlaying = async () => {
    const data = await spotifyClient.getMyCurrentPlayingTrack();

    return data;
};

export const getDeviceId = async () => {
    const data = await spotifyClient.getMyDevices();

    return data[0].id;
};



