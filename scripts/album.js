var setSong = function(songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    
} 

var getSongNumberCell = function(number){
    //return the song number element that corresponds to that song number
    return $('.song-item-number[data-song-number="' + number + '"]')[0];
}

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function(){
         var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(null);
        }
     };
     
     
     
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            $(this).find('.song-item-number').html(playButtonTemplate);
        } 
     };
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            $(this).find('.song-item-number').html(songNumber);
        }
     };
 
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);  //calls onHover andn offHover functions 
     return $row;
 };


var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);

};
    
 
    
var setCurrentAlbum = function(album) {
     currentAlbum = album;
    // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
    
    //#2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
    
    //#3
     $albumSongList.empty();
    //#4
      for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };


var trackIndex = function(album, song){
    return album.songs.indexOf(song);
}

var nextSong = function(){
    //know what previous song is 
    var previousSong = currentSongFromAlbum;
    //us trackIndex() helper function to get index of current song then increment value of index
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentIndex++;
    //update the HTML of previous song's .song-item-number element with a number
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber); 
    currentlyPlayingSongNumber++;

    //set a new current song to currentSongFromAlbum
    console.log('The current index is ' + currentIndex + ' the length of songs is ' + currentAlbum.songs.length);
    console.log("CI " + currentIndex);
    console.log("#" + currentlyPlayingSongNumber);
    
    if(currentlyPlayingSongNumber === currentAlbum.songs.length + 1){
        currentlyPlayingSongNumber = 1;
        currentIndex = 0;
    }
    
    console.log("After If Index: " + currentIndex);
    console.log("After If Number: " + currentlyPlayingSongNumber);
    currentSongFromAlbum = currentAlbum.songs[currentIndex];
    
    //update player bar to show the new song
    updatePlayerBarSong();
    //update the HTML of the new song's .song-item-number element with a pause button
    $('.song-item-number[data-song-number="' + (currentlyPlayingSongNumber) + '"]').html(pauseButtonTemplate);
    
    
    console.log(currentlyPlayingSongNumber);
}

var previousSong = function(){
    var belowSong = currentSongFromAlbum;
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentIndex--;
    //update the HTML of previous song's .song-item-number element with a number
    $('.song-item-number[data-song-number="' + (currentlyPlayingSongNumber) + '"]').html(currentlyPlayingSongNumber);
    //console.log(belowNumber-1);
    currentlyPlayingSongNumber--;
    
    console.log("CI " + currentIndex);
    console.log("#" + currentlyPlayingSongNumber);
    
    if(currentlyPlayingSongNumber === 0){
        currentlyPlayingSongNumber = currentAlbum.songs.length;
        currentIndex = currentAlbum.songs.length - 1;
    }
    
    console.log("After If Index: " + currentIndex);
    console.log("After If Number: " + currentlyPlayingSongNumber);
    currentSongFromAlbum = currentAlbum.songs[currentIndex];
    
    updatePlayerBarSong();
     
    //update the HTML of the new song's .song-item-number element with a pause button
    $('.song-item-number[data-song-number="' + (currentlyPlayingSongNumber) + '"]').html(pauseButtonTemplate);
}

//album button templates

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 
 //#1
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });

