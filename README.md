# dev-challenge-diyarkudrat
## React Native coding challenge (< 3 days)
- Create a single-view iOS app which retrieves an audio file ([use these audio files](https://drive.google.com/drive/folders/1Ck-ykG_ZB6shtYp9ppvbLIazGUSP52F6?usp=sharing)) from Firebase, AWS, or your own server, (specified by a retrieval path), and downloads locally to device
- Create a [leader election](https://en.wikipedia.org/wiki/Leader_election) system where a user can create a group and control synchronous playback (play/pause/reset) of the audio file for any other user that joins his/her group - other users should be able to join the group via entering group name (audio file will have to be downloaded locally first before being able to join synchronous playback)
- If leader quits app or creates another group, former group should then elect a new leader
- If no one left in group, group should die out and be removed