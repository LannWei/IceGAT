// 获取当前日期的前六天对应的日期
function getPreviousDate(daysAgo) {
  var date = new Date();
  date.setDate(date.getDate() - daysAgo);
  var options = { year: 'numeric', month: 'short', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}
var strList = new Array();

function limitDist() {
  // 限制section exp 和 section Code之间的间距
  let $carousel = $('.carousel');
  let $expSection = $('#exp');
  let $aftSection = $('#Code');

  let offset1 = $carousel.offset();
  let offset2 = $expSection.offset();
  
  let carouselBottom = offset1.top + $carousel.outerHeight();
  let expBottom = offset2.top + $expSection.outerHeight();
  let dist = expBottom-carouselBottom;
  console.log("=================", dist)
  $aftSection.css('margin-top', (30-dist)+'px');

  // 限制section about 和 section exp之间的间距
  let $preSection = $('#About');
  let $expTitle = $('#carouselTitle');

  let dist2 = $expTitle.offset().top - ($preSection.offset().top + $preSection.outerHeight());
  $expSection.css('margin-top', (30-dist2)+'px');
}

function getData(filePath) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: filePath,
      dataType: 'text',
      success: function(data) {
        const regex = /tensor\(([\d.]+),/g;
        let match;
        const values = [];
  
        while ((match = regex.exec(data)) !== null) {
          values.push(parseFloat(match[1]).toFixed(2));
        }
  
        differences = ['N/A']
        for (let i = 0; i < values.length - 1; i++) {
          const diff = values[i+1] - values[i];
          differences.push(diff.toFixed(2));
        }
        resolve({ values, differences });
      },
      error: function() {
        console.log('An error occurred while loading the file.');
        reject('An error occurred while loading the file.');
      }
    });
  })
}

function setmatricesText(sia, siad, sie, sied) {
  console.log(sia, siad, sie, sied)
  $('#sia').html('<span style="font-weight: bold;">SIA:</span> <span style="color: #666;">' + sia + "</span> mil km<sup>2</sup>");
  $('#siad').html('<span style="font-weight: bold;">SIA &#x0394;:</span> <span style="color: #666;">' + siad + "</span> mil km<sup>2</sup>");
  $('#sie').html('<span style="font-weight: bold;">SIE:</span> <span style="color: #666;">' + sie + "</span> mil km<sup>2</sup>");
  $('#sied').html('<span style="font-weight: bold;">SIE &#x0394;:</span> <span style="color: #666;">' + sied + "</span> mil km<sup>2</sup>");
}

var SIAValues=[], SIADiffs=[], SIEValues=[], SIEDiffs = []

$(document).ready(function() {
  const SIAPath = './resource/SIA.txt'; 
  const SIEPath = './resource/SIE.txt'; 

  
  Promise.all([getData(SIAPath), getData(SIEPath)]).then(results => {
    const result1 = results[0];
    const result2 = results[1];

    SIAValues = result1.values;
    SIADiffs = result1.differences;

    
    SIEValues = result2.values;
    SIEDiffs = result2.differences;
  })

  // 预定义图片文件名列表
  let imageList = [
    'image_0.png',
    'image_1.png',
    'image_2.png',
    'image_3.png',
    'image_4.png',
    'image_5.png',
    'image_6.png',
    'image_7.png',
    'image_8.png',
    'image_9.png',
    'image_10.png',
  ];
  // console.log("=================", imageList)

  var $imageContainer = $('#img-container');

  // 遍历图片文件名列表，生成img标签并插入到div中
  $.each(imageList, function(index, imageName) {
    var imagePath = './resource/' + imageName;
    var $img = $('<div>').attr('class', 'carousel-item__image').css('background-image', 'url('+imagePath+')');
    var $wrap = $('<div>').attr('class', 'carousel-item');
    $wrap.append($img)
    $imageContainer.append($wrap);
  });
  // 设置第一个img样式
  $('.carousel-item:first').css({
    'transform': 'translateX(0)'
  });

  // 获取屏幕宽度（单位：像素），控制 #exp 容器的偏移（居中）
  let screenWidth = $(window).width();
  let dist = 200 - 0.1*screenWidth
  $('#exp').css('margin-left', -dist+'px')
  limitDist()

  $(window).resize(function() { // 窗口调整时，居中
    let screenWidth = $(window).width();
    let dist = 200 - 0.1*screenWidth
    $('#exp').css('margin-left', -dist+'px')
    limitDist()
  });

  for (let i=9; i>=-1; i--) {
    let str = getPreviousDate(i);
    strList.push(str)
  }
});

// NAVIGATION LOGO SCROLL TOP
$('.logo').on('click', function(e) {
    e.preventDefault();
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
    $('html, body').animate({
      scrollTop: 0
    }, 750, 'easeInOutQuad')
  });
  // LINKS TO ANCHORS
  $('a[href^="#"]').on('click', function(event) {
  
    var $target = $(this.getAttribute('href'));
  
    if($target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: $target.offset().top
      }, 750, 'easeInOutQuad');
    }
  });
  
  // TOGGLE HAMBURGER & COLLAPSE NAV
  $('.nav-toggle').on('click', function() {
    $(this).toggleClass('open');
    $('.menu-left').toggleClass('collapse');
  });
  // REMOVE X & COLLAPSE NAV ON ON CLICK
  $('.menu-left a').on('click', function() {
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
  });
  
  // SHOW/HIDE NAV
  
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('header').outerHeight();
  
  $(window).scroll(function(event){
      didScroll = true;
  });
  
  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);
  
  function hasScrolled() {
      var st = $(this).scrollTop();
  
      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;
  
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $('header').removeClass('show-nav').addClass('hide-nav');
          $('.nav-toggle').removeClass('open');
          $('.menu-left').removeClass('collapse');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
              $('header').removeClass('hide-nav').addClass('show-nav');
          }
      }
  
      lastScrollTop = st;
  }

// 轮播图的函数
$(function(){
  // $('.carousel-item').eq(0).addClass('active');
  var total = $('.carousel-item').length;
  var current = 0;
  var palying = false;
  var $indicator = $('.indicator');
  var $indicatorBar = $('.indicator-bar');
  // 初始更新指示器
  // 生成竖线
  for (var i = 0; i < total; i++) {
    let percentage = ((i+1) / total) * 100;
    let $indicatorLine = $('<div>').attr('class', 'indicator-line').css('left', percentage+'%');
    $indicator.append($indicatorLine);
  }
  setSlide(0, 0);

  /* 移动到第一张图片 */
  $('#moveFirst').on('click', function(){
    var next=current;
    current= 0;
    setSlide(next, current);
    if ($("#moveRight").hasClass('disabled')) { // 如果right btn被禁用，则激活
      $('#moveRight').toggleClass('disabled');
    }
    if (current == 0) { // 因为move first，所以禁用left btn
      $('#moveLeft').toggleClass('disabled');
    }
    for (let i=1; i<total; i++) { // 将所有图片放在右边，以便动画流畅
      $('.carousel-item').eq(i).css('transform', 'translateX(100%)');
    }
  });

  /* 自动播放图片 */
  $('#play').on('click', function(){
    if (palying) { 
      palying = false;
      $(this).find('span').removeClass('icon-stop').addClass('icon-play');
      clearInterval(timer)
    } else {
      palying = true;
      $(this).find('span').removeClass('icon-play').addClass('icon-stop');
      timer=setInterval(nexImg, 1500);
    }
  });

  /* 展示下一张图片 */
  $('#moveRight').on('click', nexImg);
  
  /* 展示前一张图片 */
  $('#moveLeft').on('click', preImg);

  function preImg() {
    if (current == 0  && !$(this).hasClass('disabled')) {
      $('#moveLeft').toggleClass('disabled');
    }
    if (!$(this).hasClass('disabled')) {
      var prev=current;
      current = current-1;
      setSlide(prev, current);
      
      if ($("#moveRight").hasClass('disabled')) {
        $('#moveRight').toggleClass('disabled');
      }
    } else {
      alert("It's the first one!");
    }
  }

  function nexImg() {
    if (current == total-1 && !$(this).hasClass('disabled')) {
      $('#moveRight').toggleClass('disabled');
      clearInterval(timer);
      $('.icon-stop').removeClass('icon-stop').addClass('icon-play');
      palying = false;
      return ;
    }
    if (!$(this).hasClass('disabled')) {
      var next=current;
      current= current+1;
      setSlide(next, current);
      
      if ($("#moveLeft").hasClass('disabled')) {
        $('#moveLeft').toggleClass('disabled');
      }
    } else {
      alert("It's the last one!");
    }
  }
  
  // 切换图片
  function setSlide(prev, next){
    if (next < 4) {
      $('.info').html('<span>Ground Truth</span>');
    } else {
      $('.info').html('<span style="color:blue;">Prediction</span>');
    }
    $("#timeMsg").text(strList[next]);
    setmatricesText(SIAValues[next], SIADiffs[next], SIEValues[next], SIEDiffs[next])
    var slide = next;
    if (prev > slide) {
      $('.carousel-item').eq(prev).removeClass('active');
      $('.carousel-item').eq(prev).css('transform', 'translateX(100%)');
      $('.carousel-item').eq(slide).css('transform', 'translateX(0)');
      setTimeout(function(){
      }, 800);
    } else {
      $('.carousel-item').eq(prev).removeClass('active');
      $('.carousel-item').eq(prev).css('transform', 'translateX(-100%)');
      $('.carousel-item').eq(slide).css('transform', 'translateX(0)');
      setTimeout(function(){
      }, 800);
    }
    updateIndicator();
    console.log('current '+current);
    console.log('prev '+prev);
  }

  // $('.carousel').hover(
  //     function() {
  //         // Mouse enters the container
  //         $('.carousel__nav').slideDown();
  //     },
  //     function() {
  //         // Mouse leaves the container
  //         $('.carousel__nav').slideUp();
  //     }
  // );

  // 更新指示器位置和宽度
  function updateIndicator() {
    let percentage = ((current+1) / total) * 100;
    $indicatorBar.css('width', percentage + '%');
  }
});