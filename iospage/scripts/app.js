
(function(){

//g.opt('dragstart_after_touchstart', 0);

var apps = [
    [{
      icon: 'facebook-rect',
      title: 'Facebook'
    }, {
      icon: 'twitter-bird',
      title: 'Twitter'
    }, {
      icon: 'vimeo-rect',
      title: 'Vimeo'
    }, {
      icon: 'tumblr-rect',
      title: 'Tumblr'
    }, {
      icon: 'googleplus-rect',
      title: 'G+'
    }, {
      icon: 'github',
      title: 'GitHub'
    }, {
      icon: 'skype',
      title: 'Skype'
    }, {
      icon: 'icq',
      title: 'ICQ'
    }, {
      icon: 'yandex-rect',
      title: 'Yandex'
    }, {
      icon: 'vkontakte-rect',
      title: 'Vkontakte'
    }, {
      icon: 'odnoklassniki-rect',
      title: 'Odnoklassniki'
    }, {
      icon: 'friendfeed-rect',
      title: 'FriendFeed'
    }, {
      icon: 'blogger-rect',
      title: 'Blogger'
    }, {
      icon: 'lastfm-rect',
      title: 'LastFM'
    }, {
      icon: 'linkedin-rect',
      title: 'LinkedIn'
    }, {
      icon: 'picasa',
      title: 'Picasa'
    }],
    [{
      icon: 'instagram-filled',
      title: 'Instagram'
    }, {
      icon: 'wordpress',
      title: 'WordPress'
    }, {
      icon: 'box-rect',
      title: 'Box'
    }, {
      icon: 'win8',
      title: 'Win8'
    }],
    [{
      icon: 'tudou',
      title: 'TuDou'
    }, {
      icon: 'youku',
      title: 'YouKu'
    }]
  ];


var pageNumber = 3;
var pageWidth = document.body.clientWidth;
var currentPage = 0;
var elemContainer = document.querySelector('#container');
var elemPages = document.querySelector('#pages');
var elemLinks = document.querySelector('#links');
var elemNumbs = elemLinks.children;
var left;
var isShake = false;
var isDrag = false;


var temp = dt(elemContainer);
temp.fill(apps);

g(elemLinks).on('tap', 'li', function(e){
  var pageIndex = parseInt(this.getAttribute('page'), 10);
  gotoPage(pageIndex);
});

var gElemPages = g(elemPages);

gElemPages.on('tap', '.icon', function(e){
  //alert(this.className);
}).on('taphold', '.icon', function(e){
  if(!isShake){
    document.body.className = 'shake';
    setTimeout(bindDragAndDropEvent, 0);
    isShake = true;
  }
}).doubletap(function(){
  if(isShake){
    document.body.className = '';
    isShake = false;
    setTimeout(unbindDragAndDropEvent, 0);
  }
});

gElemPages.swipestart(function(e){
  if(isDrag) return;
  elemPages.className = '';
  left = parseInt(elemPages.style.left, 10) || 0;
}).swipe(function(e){
  if(isDrag) return;
  elemPages.style.left = left + e.deltaX + 'px';
}).swipeend(function(e){
  if(isDrag) return;
  var absSpeed = Math.abs(e.speedX);
  var absX = Math.abs(e.deltaX);
  var page = 0;
  if(absSpeed > 1000 && absX > 200 || absX > pageWidth / 3){
     page = e.deltaX > 0 ? -1 : 1;
  }
  gotoPage(currentPage + page);
  elemPages.className = 'transition';
});

function bindDragAndDropEvent(){
  gElemPages.on('dragstart.dd', '.icon', function(e){
    e.dataTransfer.setData('dragElem', this);
    isDrag = true;
  }).on('drag.dd', '.icon', function(e){
    // do nothing
  }).on('dragend.dd', '.icon', function(e){
    // do nothing
  }).on('dragenter.dd', '.icon', function(e){
    // do nothing
  }).on('dragover.dd', '.icon', function(e){
    // do nothing
  }).on('dragleave.dd', '.icon', function(e){
    // do nothing
  }).on('drop.dd', '.icon', function(e){
    var dragElem = e.dataTransfer.getData('dragElem');
    var dropElem = this;
    var dragIndex = dragElem.getAttribute('appindex');
    var dropIndex = dropElem.getAttribute('appindex');
    if(dragIndex !== dropIndex){
      // exchange dragElem and dropElem
      var dragParent = dragElem.parentNode;
      dropElem.parentNode.appendChild(dragElem);
      dragParent.appendChild(dropElem);
      dragElem.setAttribute('appindex', dropIndex);
      dropElem.setAttribute('appindex', dragIndex);
    }
    dragElem.style.cssText = '';
    isDrag = false;
  });
}

function unbindDragAndDropEvent(){
  gElemPages.off('.dd');
}

window.onorientationchange = function(){
  pageWidth = document.body.clientWidth;
  gotoPage(currentPage);
  // here we add a class to higher layer element to force reflow.
  //elemContainer.className = window.orientation === 0 ? 'portrait' : 'landscape';
};


function gotoPage(pageIndex){
  if(pageIndex < 0) pageIndex = 0;
  if(pageIndex >= pageNumber) pageIndex = pageNumber - 1;
  elemNumbs[currentPage].className = '';
  currentPage = pageIndex;
  elemPages.style.left = '-' + pageWidth * currentPage + 'px';
  elemNumbs[currentPage].className = 'current';
}

window.onorientationchange();

})();