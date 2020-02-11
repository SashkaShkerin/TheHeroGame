
var hero = {
  name: "",
  hp: 100, // жизнь героя
  st: 100, // выносливасть героя
  power: 30,  // сила героя
  route: 'right',    // направление движения героя
  shift: 3,  // один шаг сдвига героя
  position: parseInt($('.hero').css('left')),   // позиция героя
  exp: 0, // опыт игрока
  rotateRoute: function(route){   // метод поворота героя
    if(route == "right"){
      this.route = route;
      $('.hero').children('img').css({"transform":"scale(1,1)"});
    }
    else if (route == "left") {
      this.route = route;
      $('.hero').children('img').css({"transform":"scale(-1,1)"});
    }
  },
  positionCenter: function() { return this.position + $('.hero').outerWidth() / 2; }, // позиция героя + половина его ширины (позиция относительна центра героя)
  outputPosition: function(position){
    $('.hero').css({'left' : position + "px"});    // выводим переменну, изменяем позицию героя
  },
  animation_src: function(animation_src){
      if ($('.animat_hero_img').attr('src') == animation_src){  // если необходимая анимация уже задана
        // ничего не изменяем
      } else {
        $('.animat_hero_img').attr('src', animation_src);
      }
  },
  console: function(){   // вывод всех значений объекта в сонсоль
    console.table(this);
  },
  writeHTML: function () {
    // вывод жизни героя
    $('.span_hp').text(this.hp);
    $('.line_hp').css({'width' : this.hp + "%"});
    // вывод энергии героя
    $('.span_st').text(this.st);
    $('.line_st').css({'width' : this.st + "%"});
  },
  writeHP: function(power, atack){
      this.hp -= power;
      if(this.hp <= 0){
        this.hp = 0;
        this.status('death');
        this.writeHTML();
      }
      else if (this.hp > 100) {
        this.hp = 100;
        this.writeHTML();
      }
      else {
        this.writeHTML();
      }
  },
  writeST: function(power){
      this.st -= power;
      if(this.st <= 0){
        this.st = 0;
        this.writeHTML();
      }
      else if (this.st > 100) {
        this.st = 100;
        this.writeHTML();
      }
      else {
        this.writeHTML();
      }
  },
  status: function (status) {
    $('.status_hero').removeClass('status_hero_win');
    $('.status_hero').removeClass('status_hero_daeth');
    $('.status_hero').removeClass('status_hero_new');

    if (status == 'new') {
      $('.start_zon').show();
      $('.win_zon').show();
      $('.status_hero').addClass('status_hero_new');
      $('.status_hero').text('hero game');
    }
    else if(status == 'death'){
      $('.start_zon').hide();
      $('.win_zon').hide();

      $('.status_hero').addClass('status_hero_daeth');
      $('.status_hero').text('death');
      $('.header_game').addClass('blur');  // блюрим header
      $('.conteiner_game').addClass('blur');  // блюрим игру
      game.game = false;  // останавливаем игровой процесс
      $('.hero').css({'opacity': '0'}); // скрываем героя
      // скрываем всех монстров
      if(listMonstr[0].length + listMonstr[1].length + listMonstr[2].length == maxCountMonstr) {
        for (var l = 0; l < listMonstr.length; l++) {
          for (var v = 0; v < listMonstr[l].length; v++) {
            $("." + listMonstr[l][v].name).css({'opacity': '0'});
          }
        }
      }
    }
    else if (status == 'win') {
      $('.start_zon').hide();
      $('.win_zon').hide();

      $('.status_hero').addClass('status_hero_win');
      $('.status_hero').text('win');
      $('.header_game').addClass('blur');  // блюрим header
      $('.conteiner_game').addClass('blur');  // блюрим игру
      game.game = false;  // останавливаем игровой процесс
      $('.hero').css({'opacity': '0'}); // скрываем героя
      // скрываем всех монстров
      if(listMonstr[0].length + listMonstr[1].length + listMonstr[2].length == maxCountMonstr) {
        for (var l = 0; l < listMonstr.length; l++) {
          for (var v = 0; v < listMonstr[l].length; v++) {
            $("." + listMonstr[l][v].name).css({'opacity': '0'});
          }
        }
      }
    }
  },
  restart: function(){
    this.hp = 100;
    this.st = 100;
    this.writeHTML();
    this.damage = 30;
    this.route = 'right';
    this.position = 0;
    this.outputPosition(this.position);
    this.animation_src('img/hero/gif/idle.gif');
  }

};
