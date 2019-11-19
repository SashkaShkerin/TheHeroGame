
// эффект волны при нажатие на кнопки
// =============================================================================
$(".wave_effect").on('click', function(event){
  $(this).css({'--size_wave_effect' : ($(this).outerWidth() * 2) + 'px'});

  $(this).html($(this).attr('data-text') + '<span class="span_wave_effect"></span>');
  $('.span_wave_effect').css({
    'left' :  (event.pageX - $(this).offset().left ) + 'px',
    'top' :  (event.pageY - $(this).offset().top ) + 'px'
  });
});





// скрол бар в меню (горячие клавиши)
// =============================================================================
var scroll = {
  scrolPx: 0,   // количества проскроленного в пикселях
  scrolPer: 0,   // количества проскроленного в процентах
  scrolPerFun: function(){   // переводм пиксели в проценты
    this.scrolPer = Math.abs(this.scrolPx * 100 / this.scrolHeight);
  },
  scrolPxFun: function (scrolShift) {   // увеличиваем scrolPx с проверками
    this.scrolPx += scrolShift;
    if(this.scrolPx < -this.scrolHeight) this.scrolPx = -this.scrolHeight;
    else if (this.scrolPx > 0) this.scrolPx = 0;
    return this.scrolPx;
  },
  scrolShift: 50,   // шаг скролла
  cursScroll: '',   // направление скрола (вверх/вниз)
  heightConteinerList : $('.hot_key_list').outerHeight(), // высота контейнера
  heightList : $('.conteiner_hot_key_list_scroll').outerHeight(), // высота всего листа
  scrolHeight: 0,   // общий размер возможного количества скрола
  scrolHeightFun : function(){    // определяем scrolHeight
    this.scrolHeight = this.heightList - this.heightConteinerList; // количество скрытого контетка(объем скролла)
  },
  inputValCss: function(){ // выводим все значения
    $('.conteiner_hot_key_list_scroll').css({'top': this.scrolPx + "px"});
    $('.scroll').css({'top': this.scrolPer + "%"});
    $('.scroll').addClass('scroll_active');
  },

  functionScroll: function(event){  // механизм работы
    this.scrolHeightFun();  // инициализируем значение scrolHeight
    this.scrolPerFun();  // инициализируем значение scrolPer
    // this.console();

    // определяем направления скролла
    if(event.originalEvent.wheelDeltaY < 0)  this.cursScroll = 'down';
    else this.cursScroll = 'up';


    if(scroll.cursScroll == 'down'){
      scroll.scrolPxFun(-scroll.scrolShift);
      scroll.inputValCss();
    }

    if(scroll.cursScroll == 'up'){
      scroll.scrolPxFun(+scroll.scrolShift);
      scroll.inputValCss();
    }

  },
  console: function(){    // вывод в console
    console.table(this);
  }
};


// =============================================================================
$('.hot_key_list').on('mousewheel', function(event){
  scroll.functionScroll(event);
});


// =============================================================================
$('.btn_restart_game_menu').on('click', function(){
  // убираем меню
  game.game = true;
  game.keyPress.esc = false;
  $('.conteiner_menu').removeClass('active_conteiner_menu');
  $('.menu').removeClass('active_menu');
  $('.header_game').removeClass('blur');
  $('.conteiner_game').removeClass('blur');
  $('.mark_monstr').remove();
  hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
  // ============

  hero.restart();
  game.restart();
  removeObjectMonstr();
});
