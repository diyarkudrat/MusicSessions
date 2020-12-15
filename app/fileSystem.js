import * as FileSystem from 'expo-file-system';

async function downloadAudioFiles(uri, fileName) {
    const fileUri = FileSystem.documentDirectory + fileName;
    const localFile = await FileSystem.downloadAsync(uri, fileUri)

    return localFile.uri;
};

export default downloadAudioFiles;