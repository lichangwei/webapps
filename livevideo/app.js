window.onload = function(){

'use strict';

var windowWidth = document.body.clientWidth;
var windowHeight = document.body.clientHeight;

var light = document.querySelector('.light');
var lightRect = light.getBoundingClientRect();
var lightWidth = lightRect.width;
var lightHeight = lightRect.height;

var ul = document.querySelector('#list');
var lis = document.querySelectorAll('li');

var sizeOfLi = 7;
var averageWidth = 100 / 7;
var miniWidth = 5;

var lastMoveTime = new Date();

var videoPlayStatus = 'no';

g('#list').touchmove('li', function(e){
  if(videoPlayStatus === 'fullscreen') return;
  positionCursor(e.pageX, e.pageY);
  if(e.timeStamp - lastMoveTime > 100){
    updateItemWidth(this, e);
    lastMoveTime = e.timeStamp;
  }
});
g('#list').click('li', function(e){
  onClick(this, e);
});

function onClick(focus, e){
  if(videoPlayStatus === 'fullscreen'){
    videoPlayStatus = 'no';
    ul.style.opacity = 1;
    video.pause();
    audio.play();
    updateItemWidth(focus, e);
  }else if(videoPlayStatus === 'playing' || videoPlayStatus === 'no'){
    video.play(getIndex(focus));
    audio.pause();
    ul.style.opacity = 0;
    videoPlayStatus = 'fullscreen';
  }
}

function updateItemWidth(focus, e){
  var percentY = e.pageY / windowHeight;
  if(percentY < 0.2) return;
  var baseWidth = miniWidth + (averageWidth-2) * (1 - percentY) / (1 - 0.2);
  var leftWidth = 100 - baseWidth * sizeOfLi;
  var widthes = [];
  var ratio = e.pageX / windowWidth * sizeOfLi + 0.5;
  var index = Math.floor(ratio);
  ratio = ratio - index;
  for(var i = 0; i < sizeOfLi; i++){
    widthes.push(baseWidth);
  }
  if(index <= 0){
    widthes[0] = leftWidth + baseWidth;
  }else if(index >= sizeOfLi){
    widthes[sizeOfLi-1] = leftWidth + baseWidth;
  }else{
    var next = ratio * leftWidth + baseWidth;
    var prev = 100 - next - baseWidth * (sizeOfLi-2);
    widthes[index-1] = prev;
    widthes[index] = next;
  }
  var oneGreatThanX = false;
  for(var i = 0; i < sizeOfLi; i++){
    lis[i].style.width = widthes[i] + '%';
    if(widthes[i] > 50){
      oneGreatThanX = true;
      video.play(getIndex(focus));
      lis[i].style.opacity = 0;
    }else{
      lis[i].style.opacity = 1;
    }
  }
  if(oneGreatThanX){
    audio.pause();
  }else{
    audio.play();
  }
}

var video = (function(){
  var videos = {};
  return {
    index: -1,
    play: function(index){
      if(!videos[index]){
        videos[index] = document.createElement('video');
        videos[index].src = 'video/' + index + '.f4v';
        videos[index].addEventListener('ended', function(){
          this.play();
        }, false);
      }
      if(this.index !== -1){
        this.pause();
      }
      this.index = index;
      var v = videos[index];
      document.body.insertBefore(v, list);
      v.play();
      console.log('play ', index);
    },
    pause: function(){
      if(this.index !== -1){
        var v = videos[this.index];
        document.body.removeChild(v);
        this.index = -1;
        console.log('pause');
      }
    }
  };
})();

var audio = (function(){
  var bgaudio = document.getElementById('bgaudio');
  bgaudio.addEventListener('ended', function(){
    this.play();
  }, false);

  return {
    play: function(){
      bgaudio.play();
    },
    pause: function(){
      bgaudio.pause();
    }
  };
})();

function positionCursor(x, y){
  light.style.cssText = 'left:' + (x - lightWidth/2) + 'px; top:' + (y - lightHeight/2) + 'px';
  clearTimeout(positionCursor.timeout);
  positionCursor.timeout = setTimeout(function(){
    light.style.display = 'none';
  }, 5000);
}

function getIndex(elem){
  var children = elem.parentNode.children;
  for(var i = 0; i < children.length; i++){
    if(children[i] === elem){
      return i;
    }
  }
  return -1;
}

};