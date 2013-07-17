
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
var LastPaginationTime = +new Date();
var dragEdge = parseInt(pageWidth * 0.05, 10);
dragEdge = Math.max(dragEdge, 30);


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
    setTimeout(bindDragAndDropEvent, 0);
    isShake = true;
    toggleShake(isShake);
  }
}).doubletap(function(){
  if(isShake){
    isShake = false;
    toggleShake(isShake);
    setTimeout(unbindDragAndDropEvent, 0);
  }
});

gElemPages.swipestart(function(e){
  if(isDrag) return;
  elemPages.className = '';
  left = parseInt(elemPages.style.left, 10) || 0;
  toggleShake(false);
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
  toggleShake(isShake);
  elemPages.className = 'transition';
  gotoPage(currentPage + page);
});

function bindDragAndDropEvent(){
  gElemPages.on('dragstart.dd', '.icon', function(e){
    e.dataTransfer.setData('dragElem', this);
    isDrag = true;
    toggleShake(false);
  }).on('drag.dd', '.icon', function(e){
    var now = + new Date();
    if(now - LastPaginationTime > 2000){
      var x = g.util.getPageX(e);
      var change = 0;
      if(x < dragEdge && currentPage > 0){
        change = -1;
      }else if(x + dragEdge > pageWidth && currentPage < pageNumber){
        change = 1;
      }
      if(change){
        gotoPage(currentPage + change);
        LastPaginationTime = now;
      }
    }
  }).on('dragend.dd', '.icon', function(e){
    toggleShake(isShake);
    // do nothing
  }).on('dragenter.dd', '.icon', function(e){
    // do nothing
  }).on('dragover.dd', '.icon', function(e){
    // do nothing
  }).on('dragleave.dd', '.icon', function(e){
    // do nothing
  }).on('drop.dd', '.icon', function(e){
    e.preventDefault();
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
  var left = -1 * pageWidth * pageIndex;
  var currentLeft = elemPages.getBoundingClientRect().left;
  if(left !== currentLeft){
    elemNumbs[currentPage].className = '';
    currentPage = pageIndex;
    elemNumbs[currentPage].className = 'current';
    elemPages.style.left = left + 'px';
    toggleShake(false);
  }
}
g.enableNativeEvents('transitionend webkitTransitionEnd');
gElemPages.transitionend(function(e){
  toggleShake(isShake);
});

function toggleShake(shake){
  document.body.className = shake ? 'shake' : '';
}

window.onorientationchange();

})();