
(function(){

'use strict';

var images  = [];
var _images = [];
var positions;
var content = document.getElementById('content');
var mask = document.getElementById('mask');
var height  = content.clientHeight;
var width   = content.clientWidth;
var margin  = 10;
var hiddenImage;
var clonedImage;

g.enableNativeEvents('transitionend webkitTransitionEnd');

// bind events
g(document).on('touchstart touchmove touchend', function(e){
  e.preventDefault();
});

g('#content').on('doubletap', 'img', function(e){
  e.stopImmediatePropagation();
  showBigImage(this);
}).on('dragstart', 'img', function(e){
  e.dataTransfer.setData('dragElem', this);
}).on('drop', 'img', function(e){
  var dragElem = e.dataTransfer.getData('dragElem');
  var dragIndex = parseInt(dragElem.getAttribute('title'), 10);
  var dropIndex = parseInt(this.getAttribute('title'), 10);
  swapPhoto(dragIndex, dropIndex);
}).taphold(function(e){
  e.stopPropagation();
  var url = '../common/images/' + Math.floor(Math.random()*6 + 1) + '.jpg';
  addPhoto(url);
});
g('#mask').on('doubletap', function(e){
  if(!clonedImage) return;
  clonedImage.style.cssText = hiddenImage.style.cssText;
  clonedImage = null;
  g('#mask img').on('transitionend', function(){
    hiddenImage.className = '';
    mask.style.display = 'none';
    mask.innerHTML = '';
  });
});

// start worker
var worker = new Worker('scripts/positionwoker.js');
worker.onmessage = function(event){
  positions = event.data;
  content.style.display = 'none';
  for(var i = 0, len = images.length; i < len; i++){
    position(images[i], positions[i], i);
  }
  content.style.display = 'block';
};

function addPhoto(src){
  var img = new Image();
  img.onload = function(){
    var img = this;
    images.push(img);
    _images.push({
      margin: margin,
      width: img.width,
      height: img.height,
      area: (img.width+margin) * (img.height+margin)
    });
    content.appendChild(img);
    if(images.length > 40){
      removePhoto();
    }
    positionImages();
  };
  img.src = src;
}
  
function removePhoto(index){
  index = index || 0;
  var image = images[index];
  content.removeChild(image);
  images.splice(index, 1);
  _images.splice(index, 1);
}
  
function swapPhoto(i, j){
  var temp = images[i];
  images[i] = images[j];
  images[j] = temp;
  
  temp = _images[i];
  _images[i] = _images[j];
  _images[j] = temp;
  
  var posi = positions[i];
  var posj = positions[j];
  
  var posi_width = posi.width;
  var posi_height = posi.height;
  
  var ratio = Math.min(posi._width/posj.width, posi._height/posj.height);
  posi.width  = Math.round( posj.width * ratio );
  posi.height = Math.round( posj.height * ratio );
  
  ratio = Math.min(posj._width/posi_width, posj._height/posi_height);
  posj.width  = Math.round( posi_width * ratio );
  posj.height = Math.round( posi_height * ratio );
  
  position( images[i], positions[i], i );
  position( images[j], positions[j], j );
}

function positionImages(){
  worker.postMessage({
    images: _images,
    grid: {xPx: width, yPx: height}
  });
}

function position(image, position, index){
  var rotate = Math.random() * 6 - 3;
  var cssText  = 'top: ' + position.top + 'px; left: ' + position.left + 'px;';
    cssText += '-webkit-transform: rotate(' + rotate + 'deg);';
    cssText += '   -moz-transform: rotate(' + rotate + 'deg);';
  image.title = index;
  image.width = position.width;
  image.height = position.height;
  image.setAttribute('drag', 'copy');
  image.setAttribute('dropable', 'true');
  image.style.cssText = cssText;
}

function showBigImage(img){
  hiddenImage = img;
  clonedImage = img.cloneNode();
  mask.appendChild(clonedImage);
  mask.style.display = 'block';
  var size = _images[parseInt(img.title, 10)];
  var wh = fit(size.width, size.height, width*0.8, height*0.8);
  var w = parseInt(wh[0], 10);
  var h = parseInt(wh[1], 10);
  var top = (height - h) / 2;
  var left = (width - w) / 2;
  var cssText = 'width:' + w + 'px; height:' + h + 'px;' + 
    'top:' + top + 'px; left:' + left + 'px';
  clonedImage.className = 'animate';
  hiddenImage.className = 'hidden';
  setTimeout(function(){
    clonedImage.style.cssText = cssText;
  }, 100);
}

function fit(sourceWith, sourceHeight, targetWidth, targetHeight){
  var ratio = Math.min(targetWidth/sourceWith, targetHeight/sourceHeight);
  return [sourceWith * ratio, sourceHeight * ratio];
}
  
})();
