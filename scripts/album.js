var togglePlayFromPlayerBar = function(){
   if(currentSoundFile === null){
       return;
   }
    if(currentSoundFile.isPaused()){
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();   
    }
    else{
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate); 
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();  
    }
      
    
}

var setSong = function(songNumber) {
     if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
    
}; 

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }  

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number){
    //return the song number element that corresponds to that song number
    return $('.song-item-number[data-song-number="' + number + '"]');
}

var createSongRow = function(songNumber, songName, songLength) { 
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
            //need to play sound file 
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'}); 
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            
            if(currentSoundFile.isPaused()){
                //start playing the song again and revert the icon in the song row and the player bar to the pause button
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);   
            }
            else {
                currentSoundFile.pause();
                getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                
            }
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
     $row.hover(onHover, offHover);  //calls onHover and offHover functions 
     return $row;
 };


var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    //setTotalTimeInPlayerBar($(".song-item-duration")[currentlyPlayingSongNumber-1].innerHTML);
    
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);

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

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(seekBarFillRatio * currentSoundFile.getDuration());
         });
     }
 };


var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    //#1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    
};

var seek = function(currentTime){
    currentSoundFile.setTime(currentTime);
    setCurrentTimeInPlayerBar(currentTime);
}

var setCurrentTimeInPlayerBar = function(currentTime){

    var newTimeCode = filterTimeCode(currentTime);
    $(".current-time").html(newTimeCode);  
    
}

var setTotalTimeInPlayerBar = function(totalTime){
    
    $(".total-time").html(filterTimeCode(totalTime));
    
}

var filterTimeCode = function(timeInSeconds){
    //use parseFloat() method to get the seconds in number form.

    timeInSeconds = parseFloat(timeInSeconds); 
    
    //Store variables for whole seconds and whole minutes (hint: use Math.floor() to round numbers down).
    var seconds = Math.floor(timeInSeconds % 60);
    var minutes = Math.floor(timeInSeconds/60);
    
    //Return the time in the format X:XX
    if(seconds<10){
        seconds = "0" + seconds;
    } 
    return (minutes + ":" + seconds);
}


var setupSeekBars = function(){
    
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event){
       //#3
       var offsetX = event.pageX - $(this).offset().left;
       var barWidth = $(this).width();
       // #4
       var seekBarFillRatio = offsetX / barWidth;
       //console.log(this); is <div class = "seek-bar"><div>
       // #5
       if ($(this).parent().hasClass("control-group volume")){
           //set the volume based on the seekBarFillRatio
           setVolume(seekBarFillRatio*100);
       }
       else {
           seek(seekBarFillRatio * currentSoundFile.getDuration());
       }
        
       updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find(".thumb").mousedown(function(event){
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
        
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
        });
    });
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
    
    if(currentIndex === currentAlbum.songs.length){
        currentIndex = 0;
    }
    getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber); 
    setSong(currentIndex + 1);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    //update player bar to show the new song
    updatePlayerBarSong();
    //update the HTML of the new song's .song-item-number element with a pause button
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
    
}

var previousSong = function(){
    var belowSong = currentSongFromAlbum;
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentIndex--;
    //update the HTML of previous song's .song-item-number element with a number
  
    if(currentIndex === -1){
        currentIndex = currentAlbum.songs.length -1;
    }
    getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
    setSong(currentIndex +1);
    
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
     
    //update the HTML of the new song's .song-item-number element with a pause button
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
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
var currentSoundFile = null;
var currentSoundFile = null;
var currentVolume = 80;

var $mainControls = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $mainControls.click(togglePlayFromPlayerBar);
     setVolume(currentVolume);
     
 });

