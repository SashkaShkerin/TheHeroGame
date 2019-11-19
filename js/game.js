
// ИГРОВОЙ ФУНКЦИОНАЛ

// объект игры
var game = {
  game: true,   // тригер запуска игры (игра включен\выключенна)
  time: {   // объект игрового времени
    time: '',
    sec: 0,
    min: 0,
    eventTime: function () {
      if(game.game == true) { // если игра запущенна
        this.sec++;
        if(this.sec > 59) {
          this.sec = 0;
          this.min++;
        }
      }
      return this.time = this.min +":"+ this.sec;
    },
    restart: function(){
      this.time = '';
      this.sec = 0;
      this.min = 0;
      this.time = this.min +":"+ this.sec;
      $('.span_time').text(this.eventTime());
    }
  },
  keyPress: {   // тригирим нажатые клавиши движения влево/право
    start: false,
    esc: false,
    pouse: false,
    rigthMove: false,
    leftMove: false,
    keyShift: false,
    keyAlt: false,
    restart: function(){
      start = false;
      esc = false;
      pouse = false;
      rigthMove = false;
      leftMove = false;
      keyShift = false;
      keyAlt = false;
    }
  },
  position: parseInt($('.conteiner_game').css('left')),   // позиция карты
  outputPosition: function(position){
    $('.conteiner_game').css({'left': position + 'px'});
  },
  progress: function(){
    let prog = Math.abs(hero.position) * ( 100 / $('.conteiner_game').outerWidth() )
    $('.progress_bar').css({'width' : prog + "%"});
    if(prog == 100) $('.progress_bar').addClass('progress_bar_win');
    else if (prog != 100) $('.progress_bar').removeClass('progress_bar_win');
  },
  console: function(){  // вывод всех значений объекта в сонсоль
    console.table(this);
  },
  restart: function(){   // метод перезагрузки игры
    this.game = true;
    this.time.restart();
    this.keyPress.restart();
    this.position = 0;
    this.outputPosition(this.position);
    this.progress();
  }

}

// вывод таймера игры
setInterval(function(){
  $('.span_time').text(game.time.eventTime());
}, 1000);


//вызываем функцию движения если нажаты клавиши
setInterval(function(){
  if(listMonstr[0].length + listMonstr[1].length + listMonstr[2].length == maxCountMonstr) {
    for (var l = 0; l < listMonstr.length; l++) {
      for (var v = 0; v < listMonstr[l].length; v++) {
        listMonstr[l][v].possivMove();
      }
    }
  }
}, 5);


//  событие движения игрока
$('.hero').on('shift', function(){
  // функционал сдвига ==========
  let functionShift = function(){
    if (game.game == true) {
      // меняем агтмацию движения героя
      if( hero.shift == 3) hero.animation_src('img/hero/gif/walk.gif');
      else if ( hero.shift == 5 ) hero.animation_src('img/hero/gif/run.gif');

      // сдвигаем ВПРАВО героя
      if(game.keyPress.rigthMove == true){    // если зажата клавиша вправо
        hero.position += hero.shift;     // увеличиваем переменную сдвига
        hero.rotateRoute('right');   // разворачиваем героя

        if ( hero.position <= $('.conteiner_game').outerWidth()) { // если герой не вышел за правый край карты
          hero.outputPosition(hero.position);   // выводим переменну, изменяем позицию героя
        } else {  // если герой вышел за правый край карты
          hero.position = $('.conteiner_game').outerWidth();  // возвращаем его на правый край
          hero.outputPosition(hero.position);   // выводим переменну, изменяем позицию героя
        }

        // если герой идя ВПРАВО прошел центер экрана и ещё не дошел до правого края карты
        if(hero.positionCenter() >= ($(window).outerWidth() / 2) && hero.positionCenter() < $('.conteiner_game').outerWidth() - ($(window).outerWidth() / 2) ) {
          // сдвигаем карту влево на один шаг героя
          game.position -= hero.shift;
          game.outputPosition(game.position);
        }
      }

      // сдвигаем ВЛЕВО героя
      if(game.keyPress.leftMove == true) {    // если зажата клавиша влево
        hero.position -= hero.shift;     // уменьшаем переменную сдвига
        hero.rotateRoute('left');   // разворачиваем героя


        if ( hero.position > 0) {   // если герой не ушёл за левый край карты
          hero.outputPosition(hero.position);   // выводим переменну, изменяем позицию героя
        } else { // если ушёл, возвращаем на левый край
          hero.position = 0;
          hero.outputPosition(hero.position);   // выводим переменну, изменяем позицию героя
        }

        // если герой идя ВЛЕВО прошел центер экрана и ещё не дошел до правого края карты
        if(hero.positionCenter() >= ($(window).outerWidth() / 2) && hero.positionCenter() < $('.conteiner_game').outerWidth() - ($(window).outerWidth() / 2) ) {
          // сдвигаем карту влево на один шаг героя
          game.position += hero.shift;
          game.outputPosition(game.position);
        }
      }

      // контролируем прогресс бар
      game.progress()
    }
  };

  // вызываем функцию движения если нажаты клавиши
  setInterval(function(){
    if (game.keyPress.start == true) functionShift();
  }, 5);

  // снимаем событие, чтобы событие не накладывалось
  $('.hero').off('shift');
});  // END .on('shift')




$(document).on('keydown', function(event){
  // console.log(event.keyCode);

  // KEYDOWN ESC
  if( event.keyCode == 27) {
    event.preventDefault();
    if ( game.keyPress.esc == false){ // если меню выключенно, включаем
      if ( game.keyPress.pouse == true){ // если стоит пауза
        game.keyPress.pouse = false;
        $('.conteiner_pause').addClass('active_conteiner_start');
        $('.conteiner_pause').removeClass('active_conteiner_stop');
      }

      game.game = false;
      game.keyPress.esc = true;
      $('.conteiner_menu').addClass('active_conteiner_menu');
      $('.header_game').addClass('blur');
      $('.conteiner_game').addClass('blur');
      $('.menu').addClass('active_menu');
      hero.animation_src('img/hero/img/idle/idle0001.png'); // ставим стандартную анимацию движения

    } else { // если меню включенно, выключаем
      game.game = true;
      game.keyPress.esc = false;
      $('.conteiner_menu').removeClass('active_conteiner_menu');
      $('.header_game').removeClass('blur');
      $('.conteiner_game').removeClass('blur');
      $('.menu').removeClass('active_menu');
      hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
    }
  }

  // KEYDOWN POUSE
  if( event.keyCode == 80) {
    if(game.keyPress.esc != true){
      event.preventDefault();
      if ( game.keyPress.pouse == false){ // если пауза выключенна - включаем
        game.game = false;
        game.keyPress.pouse = true;
        $('.conteiner_pause').addClass('active_conteiner_stop');
        $('.conteiner_pause').removeClass('active_conteiner_start');
        $('.header_game').addClass('blur');
        $('.conteiner_game').addClass('blur');
        hero.animation_src('img/hero/img/idle/idle0001.png'); // ставим стандартную анимацию движения

      } else { // если пауза включенна - выключаем
        console.log("hi");
        game.game = true;
        game.keyPress.pouse = false;
        $('.conteiner_pause').addClass('active_conteiner_start');
        $('.conteiner_pause').removeClass('active_conteiner_stop');
        $('.header_game').removeClass('blur');
        $('.conteiner_game').removeClass('blur');
        hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
      }
    }
  }

  // KEYDOWN RIGHT
  if( event.keyCode == 39 || event.keyCode == 68) {
    event.preventDefault();
    game.keyPress.start = true;
    game.keyPress.rigthMove = true;
    $('.hero').trigger('shift');
  }
  // KEYDOWN RIGHT + SHIFT
  else if (event.keyCode == 16) { // (быстрый бег)
    game.keyPress.keyShift = true;
    if(game.keyPress.rigthMove && game.keyPress.keyShift)
    hero.shift = 5;
  }
  // KEYDOWN RIGHT + SHIFT + ALT
  else if (event.keyCode == 18) { //(очень быстрый бег)
    game.keyPress.keyAlt = true;
    if(game.keyPress.keyShift && game.keyPress.keyAlt)
    hero.shift = 7;
  }

  // KEYDOWN LEFT
  if( event.keyCode == 37 || event.keyCode == 65) {
    event.preventDefault();
    game.keyPress.start = true;
    game.keyPress.leftMove = true;
    $('.hero').trigger('shift');
  }
  // KEYDOWN RIGHT + SHIFT
  else if (event.keyCode == 16) { // (быстрый бег)
    game.keyPress.keyShift = true;
    if(game.keyPress.leftMove && game.keyPress.keyShift)
    hero.shift = 5;
  }
  // KEYDOWN RIGHT + SHIFT + ALT
  else if (event.keyCode == 18) { // (очень быстрый бег)
    game.keyPress.keyAlt = true;
    if(game.keyPress.leftMove && game.keyPress.keyAlt)
    hero.shift = 7;
  }
});

$(document).on('keyup', function(event){

  // если отдажа любая клафиша движения
  if( event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 37 || event.keyCode == 65) {
    event.preventDefault();
    game.keyPress.start = false;
    game.keyPress.leftMove = false;
    game.keyPress.rigthMove = false;
    game.keyPress.keyShift = false;
    game.keyPress.keyAlt = false;
    $('.hero').off('shift');
    hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
    hero.shift = 3;
  }

  if (event.keyCode == 16) {
    event.preventDefault();
    game.keyPress.keyShift = false;
    hero.shift = 3;
  }

  if (event.keyCode == 18) {
    event.preventDefault();
    game.keyPress.keyAlt = false;
    if( game.keyPress.keyShift == false){
      hero.shift = 3;
    } else {
      hero.shift = 5;
    }
  }

});


// умираем МЕНЮ по нажатию на bg_menu
$('.bg_menu').on('click', function(){
  game.game = true;
  game.keyPress.esc = false;
  $('.conteiner_menu').removeClass('active_conteiner_menu');
  $('.menu').removeClass('active_menu');
  $('.header_game').removeClass('blur');
  $('.conteiner_game').removeClass('blur');
  hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
});

$('.conteiner_pause').on('click', function(){
  game.game = true;
  game.keyPress.pouse = false;
  $('.conteiner_pause').addClass('active_conteiner_start');
  $('.conteiner_pause').removeClass('active_conteiner_stop');
  $('.header_game').removeClass('blur');
  $('.conteiner_game').removeClass('blur');
  hero.animation_src('img/hero/gif/idle.gif'); // ставим стандартную анимацию движения
});
