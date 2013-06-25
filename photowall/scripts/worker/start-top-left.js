
var positionImages;

(function(){

var inited, xPx, yPx, row, col;
var cell = 10;
var margin = 10;

function init( data ){
  xPx = data.grid.xPx;
  yPx = data.grid.yPx;
  col = Math.floor( xPx / cell );
  row = Math.floor( yPx / cell );
}

/**
 * @param images Array [{width, height, area}]
 */
positionImages = function ( data ){
  var data = data;
  if( !inited ) init( data );
  
  var images = data.images;
  var array = createEmptyArray(row, col);
  var starts = [ [0, 0] ]; // start with (0,0)
  var area = 0;
  for(var i = 0, len = images.length; i < len; i++){
    area += images[i].area;
  }
  var ratio = Math.sqrt( (xPx*yPx)/area/1.8 );
  ratio = Math.min(ratio, 1);
  console.info(ratio)
  var positions = [];
  for(var i = 0, len = images.length; i < len; i++){
    positionImage(array, positions, starts, ratio, images[i], i);
  }
  tryMoveCenter(positions, yPx, xPx);
  return positions;
}

function positionImage(array, positions, starts, ratio, image, index){
  starts.sort(function(a, b){
    return Math.random() > 0.5;
  });
  var margin = image.margin || 0;
  var width   = Math.round(image.width  * ratio);
  var height  = Math.round(image.height * ratio);
  var img_col = Math.ceil( (width  + 2*margin) / cell );
  var img_row = Math.ceil( (height + 2*margin) / cell );
    
  for(var i = 0, len = starts.length; i < len; i++){
    var start = starts[i];
    var sx = start[0];
    var sy = start[1];
    var ex = sx + img_col - 1;
    var ey = sy + img_row - 1;
    var result = isAvaiable(array, sx, sy, ex, ey, col, row);
    if( !result ) continue;
    
    if( Math.random() > 0.5 ){
      start = tryMove(array, sx, sy, ex, ey);
      sx = start[0];
      sy = start[1];
      ex = sx + img_col - 1;
      ey = sy + img_row - 1;
    }
    
    setUnavaiable(array, sx, sy, ex, ey, index);
    
    // update starts
    starts.splice(i, 1);
    starts.push( [ex+1, sy], [sx, ey+1] );
    
    //update image postion
    var pos = {
      id: image.id,
      top   : sy * cell + cell - Math.floor(Math.random() * cell / 2),
      left  : sx * cell + cell - Math.floor(Math.random() * cell / 2),
      width : width,
      height: height,
      _width: width,
      _height: height
    };
    positions.push( pos );
    
    return;
  }
  positionImage(array, positions, starts, ratio*0.7, image, index);
}

function createEmptyArray(row, col){
  var array = new Array(row);
  for(var i = 0; i < row; i++){
    array[i] = new Array(col);
  }
  return array;
}

function isAvaiable(array, sx, sy, ex, ey, maxx, maxy){
  if( ex >= maxx ) return false;
  if( ey >= maxy ) return false;
  for(var i = sx; i <= ex; i++){
    if( array[sy][i] >= 0 || array[ey][i] >= 0) return false;
  }
  for(var i = sy; i <= ey; i++){
    if( array[i][sx] >= 0 || array[i][ex] >= 0) return false;
  }
  return true;
}

function tryMove(array, sx, sy, ex, ey){
  var left = tryMoveLeft(array, sx, sy, ex, ey);
  var top  = tryMoveTop (array, sx, sy, ex, ey);
  if(left > top){
    sx -= left;
    top = tryMoveTop(array, sx, sy, ex, ey);
    sy -= top;
  }else if(top > left){
    sy -= top;
    left = tryMoveLeft(array, sx, sy, ex, ey);
    sx -= left;
  }
  return [sx, sy];
}

function setUnavaiable(array, sx, sy, ex, ey, index ){
  for(var i = sy; i <= ey; i++){
    for(var j = sx; j <= ex; j++){
      array[i][j] = index;
    }
  }
}

function tryMoveLeft(array, sx, sy, ex, ey){
  outter: for(var i = sx-1, left = 0; i >= 0; i--, left++){
    for(var j = sy; j < ey; j++){
      if( array[j][i] >= 0 ) break outter;
    }
  }
  return left-- > 1 ? left : 0;
}

function tryMoveTop(array, sx, sy, ex, ey){
  outter: for(var i = sy-1, top = 0; i >= 0; i--, top++){
    var row = array[i];
    for(var j = sx; j < ex; j++){
      if( row[j] >= 0 ) break outter;
    }
  }
  return top-- > 1 ? top : 0;
}

function tryMoveCenter(positions, yPx, xPx){
  var rights = [];
  var bottoms = [];
  for(var i = 0, len = positions.length; i < len; i++){
    var pos = positions[i];
    rights.push( pos.left + pos.width );
    bottoms.push( pos.top + pos.height );
  }
  var right = Math.max.apply(Math, rights);
  var bottom = Math.max.apply(Math, bottoms);
  var offsetX = Math.round( (xPx - right)/2 );
  var offsetY = Math.round( (yPx - bottom)/2 );
  console.info('offsetX=' + offsetX)
  console.info('offsetY=' + offsetY)
  for(var i = 0, len = positions.length; i < len; i++){
    var pos = positions[i];
    pos.left += offsetX;
    pos.top += offsetY;
  }
}

})();
