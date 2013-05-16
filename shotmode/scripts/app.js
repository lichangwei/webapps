(function(){

var r = 195;
var unitDeg = 22.5;
var mode = document.querySelector('.mode');

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

function getPageY(e){
  return e.pageY || e.clientY || 
  (e.touches && e.touches[0] ? e.touches[0].pageY : 0) ||
  (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].pageY : 0);
}

function getPageX(e){
  return e.pageX || e.clientX || 
  (e.touches && e.touches[0] ? e.touches[0].pageX : 0) ||
  (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].pageX : 0);
}

window.onload = function(){
  drawModes();
  var menu = document.querySelector('.menu');

  function dragstart(e){
    e.preventDefault();
    var base = 0;
    var match = /rotate\((-?[\d\.]+)deg\)/.exec(mode.style.WebkitTransform);
    if( match ){
      base = parseInt(match[1], 10);
    }
    var startDeg = Math.atan2(getPageY(e), getPageX(e));
    var deg = 0;

    function applyChange(deg){
      mode.style.WebkitTransform = 'rotate(' + deg + 'deg)';
    }

    function dragmove(e){
      var endDeg = Math.atan2(getPageY(e), getPageX(e));
      deg = base + (startDeg - endDeg) * 5 / Math.PI * 180;
      applyChange(deg);
    }
    function dragend(){
      if(deg !== 0){
        deg = Math.round(deg / unitDeg) * unitDeg;
        applyChange(deg);
      }
      menu.removeEventListener('mousemove', dragmove);
      menu.removeEventListener('touchmove', dragmove);
      menu.removeEventListener('mouseup', dragend);
      menu.removeEventListener('touchend', dragend);
    }
    menu.addEventListener('mousemove', dragmove, false);
    menu.addEventListener('touchmove', dragmove, false);
    menu.addEventListener('mouseup', dragend, false);
    menu.addEventListener('touchend', dragend, false);
  }
  menu.addEventListener('mousedown', dragstart, false);
  menu.addEventListener('touchstart', dragstart, false);
};


})();