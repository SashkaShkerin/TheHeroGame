
var hero = {
  name: "",
  hp: 100, // жизнь героя
  mp: 100, // сила героя
  damage: 30,
  route: 'right',    // направление движения героя
  rotateRoute: function(route){   // метод поворота героя
    if(route == "right"){
      this.route = route;
      $('.hero').css({"transform":"scale(1,1)"});
    }
    else if (route == "left") {
      this.route = route;
      $('.hero').css({"transform":"scale(-1,1)"});
    }
  },
  position: parseInt($('.hero').css('left')),   // позиция героя
  positionCenter: function() { return this.position + $('.hero').outerWidth() / 2; }, // позиция героя + половина его ширины (позиция относительна центра героя)
  shift: 3,  // один шаг сдвига героя
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
    $('.span_hp').text(this.hp);
    $('.line_hp').css({'width' : this.hp + "%"})
  },
  writeHP: function(shiftHP){
    if( (this.hp - shiftHP) <= 0) this.hp = 0;
    else this.hp += shiftHP;
    this.writeHTML();
  },
  restart: function(){
    this.hp = 100;
    this.mp = 100;
    this.damage = 30;
    this.route = 'right';
    this.position = 0;
    this.outputPosition(this.position);
    this.animation_src('img/hero/gif/idle.gif');
  }

};
