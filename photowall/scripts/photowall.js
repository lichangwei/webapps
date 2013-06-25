
(function(){

'use strict';

window.photowall = {
  add: add,
  remove: remove,
  swap: swap
};

var images  = [];
var _images = [];
var positions;
var content = document.getElementById('content');
var height  = content.clientHeight;
var width   = content.clientWidth;
var margin  = 10;

// bind events
g(document).on('touchstart touchmove touchend', function(e){
  e.preventDefault();
});

g('#content').on('doubletap', 'img', function(e){
  e.stopImmediatePropagation();
  showImgInCanvas( this );
}).on('drag', 'img', function(){
  console.log('drag');
}).on('drop', 'img', function(){
  console.log('drop');
}).doubletap(function(e){
  e.stopPropagation();
  photowall.add( '../common/images/' + Math.floor(Math.random()*6 + 1) + '.jpg' );
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

function add( src ){
  var img = new Image();
  img.onload = onImageLoaded;
  img.src = src;
}
  
function remove( index ){
  index = index || 0;
  if(typeof index === 'string'){
    for(var i = 0; i < images.length; i++){
      if(images[i].src === index){
        index = i;
      }
    }
  }
  var image = images[index];
  content.removeChild( image );
  images.splice(index, 1);
  _images.splice(index, 1);
  positionImages();
}
  
function swap(i, j){
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

function onImageLoaded(){
  var img = this;
  images.push(img);
  _images.push({
    margin: margin,
    width: img.width,
    height: img.height,
    area: (img.width+margin) * (img.height+margin)
  });
  content.appendChild( img );
  if(images.length > 40){
    photowall.remove();
  }
  positionImages();
}

function positionImages(){
  worker.postMessage({
    images: _images,
    grid: {xPx: width, yPx: height}
  });
}

function ontouchend(e, thisX, thisY, offsetX, offsetY, endX, endY){
  for(var i = 0; i < positions.length; i++){
    var p = positions[i];
    if(endX >= p.left && endY >= p.top && endX <= p.left+p.width && endY <= p.top+p.height){
      photowall.swap(parseInt(this.title), i);
      break;
    }
  }
  return false;
}

function position( image, position, index ){
  var rotate = Math.random() * 6 - 3;
  var cssText  = 'top: ' + position.top + 'px; left: ' + position.left + 'px;';
    cssText += '-webkit-transform: rotate(' + rotate + 'deg);';
    cssText += '   -moz-transform: rotate(' + rotate + 'deg);';
  image.title = index;
  image.width = position.width;
  image.height = position.height;
  image.style.cssText = cssText;
}

var mask = document.getElementById('mask');
var canvas = document.getElementById('canvas');

function showImgInCanvas( img ){
  var size = _images[parseInt(img.title)];
  var wh = fit(size.width, size.height, width*0.8, height*0.8);
  var w = parseInt(wh[0]);
  var h = parseInt(wh[1]);
  var top = parseInt( (height - h)/2 );
  var left = parseInt( (width - w)/2 );
  var canvas = document.createElement('canvas');
  var cssText = stylesheet.composeDeclares({
    'width': w,
    'height': h,
    'top': top,
    'left': left
  });
  canvas.width = w;
  canvas.height = h;
  canvas.style.cssText = cssText;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  mask.appendChild(canvas);
  mask.style.display = 'block';
}

function fit(w, h, W, H){
  var ratio = Math.min(W/w, H/h);
  return [w*ratio, h*ratio];
}
  
})();
