(function(){

var r = 195;
var unitDeg = 22.5;
var mode = document.querySelector('.menu ul');

function drawModes(){
  var classes= ['p', 'a', 's', 'm', 'sweeppanorama', 'scene', 'iauto', 'iautoplus'];
  var html = '';
  for(var i = 0; i < 16; i++){
    var rotate = i * unitDeg;
    var top = parseInt(r * (1 - Math.sin(rotate * Math.PI / 180)),10) + 10;
    var left = parseInt(r * (1 - Math.cos(rotate * Math.PI / 180)),10) + 10;
    html += '<li class="mode_' + classes[i%8] + '" style="-webkit-transform: rotate(' + rotate + 'deg); top: ' + top + 'px; left: ' + left + 'px;"></li>';
  }
  mode.innerHTML = html;
}


window.onload = function(){
  drawModes();

  var base, startDeg, deg;
  g('.menu').swipestart(function(e){
    base = getRotation();
    startDeg = Math.atan2(e.pageY, e.pageX);
    deg = 0;
    mode.className = '';
  }).swipe(function(e){
    var endDeg = Math.atan2(e.pageY, e.pageX);
    deg = base + (startDeg - endDeg) * 5 / Math.PI * 180;
    applyChange(deg);
  }).swipeend(function(e){
    if(deg !== 0){
      deg = Math.round(deg / unitDeg) * unitDeg;
      applyChange(deg);
    }
    mode.className = 'transition';
  });

  document.addEventListener('keydown', function(e){
    var angle = getRotation();
    if(e.keyCode === 37 || e.keyCode === 38){
      angle += unitDeg;
    }else if(e.keyCode === 39 || e.keyCode === 40){
      angle -= unitDeg;
    }
    applyChange(angle);
  }, false);

  function getRotation(){
    var base = 0;
    var match = /rotate\((-?[\d\.]+)deg\)/.exec(mode.style.WebkitTransform);
    if( match ){
      base = parseFloat(match[1]);
    }
    return base;
  }

  function applyChange(deg){
    mode.style.WebkitTransform = 'rotate(' + deg + 'deg)';
  }
};

})();