// максимальное число монстров в игре
var maxCountMonstr = 5;

// число монстров каждого вида
var countMonstr = [0,0,0,0];
// 0 - elf
// 1 - dog
// 2 - greench
// 3 - all

// массив в котором хранятся объекты монстров
var listMonstr = [
  [], // 0 - elf
  [], // 1 - dog
  []  // 2 - greench
];


// КОНСТРУКТОР МОНСТРОВ ========================================================
// =============================================================================
function Monstr(monstr){
  this.status = true;
  this.hpAll = 100;
  this.hp = this.hpAll;
  this.positionX = 0; // позиция монстра
  this.positionCenter = function() { return this.positionX + $('.' + this.name).outerWidth() / 2; }; // позиция героя + половина его ширины (позиция относительна центра героя)
  this.courseFace = 'Left'; // направление монстра
  this.oldCourseFace = this.courseFace; // сохраняем изночальное направление монстра
  this.power = 5;
  this.atac = false; // режим атаки постра
  this.shift = 1.2;
  this.markName = '';

  // работаем с позицией монстра на прогресс баре
  // ===========================================================================
  this.progress = function(position, add){
    if(add == true){ // если нужно создать маркер
      $('.conteiner_progress_bar').append('<div class="mark_monstr ' + this.markName + '"></div>');
    }
    let prog;
    if(this.courseFace == 'Left')
    prog = Math.abs(position) * ( 100 / $('.conteiner_game').outerWidth() );
    else if (this.courseFace == 'Right')
    prog = ( Math.abs(position) + $('.' + this.name).outerWidth() ) * ( 100 / $('.conteiner_game').outerWidth() );

    $('.' + this.markName).css({'left' : prog + "%"});
  };

  this.writeHP = function(power){
    this.hp -= power;
    $('.' + this.name).children('.cont_hp_monst').children('.hp_monst').css({'width' : ((this.hp*100)/this.hpAll) + '%'});

    if(this.hp <= 0){
      this.hp = 0;
      if(this.status){
        hero.exp += this.hpAll;
        $('.span_exp_hero').text(hero.exp);
      }
      this.status = false;
      $('.' + this.markName).css({'background' : 'rgba(255,255,255,.3)'});
      $('.' + this.name).children('.hp_monst').css({'width' : this.hp + '%'});
      $('.' + this.name).css({
        'transition' : '.3s',
        'animation' : 'death_monstr_anim .5s',
        'opacity' : '0',
        'visibility' : 'hidden'
      });
    }
    else {
      $('.' + this.name).children('.hp_monst').css({'width' : this.hp + '%'});
    }
  };

  // выбор случайного направления монстра
  // ===========================================================================
  this.courseFaceRandom = function(){
    let random = Math.random();
    if(random < 0.5) this.courseFace = "Left";
    else  this.courseFace = "Right";
  };
  // назначаем случайную сторону монстру
  this.courseFaceRandom();

  // метод смены анимации монстров
  // ===========================================================================
  this.imgReplay = function (image) {
    if(this.monstr == "dog") return; // на собаку нет онимаций кроме бега, так что выходим из функции

    // остальным монстрам меняем анимации
    if($('.' + this.name).children('img').attr('src') == 'img/' + this.monstr + '/gifs/'+ image +'.gif'){
      // если установленна нужная онимация, ничего не делаем
    }
    else {
      $('.' + this.name).children('img').attr('src', 'img/' + this.monstr + '/gifs/'+ image +'.gif');
    }
  };

  // направление монстра относительно игрока, ходьба за игроком
  // ===========================================================================
  this.trigFaseMons = function () {
    if(this.positionCenter() <= hero.positionCenter()){
      // если центр монстра левее монстра, меняем его направление на право, к герою
      this.courseFace = "Right";
      $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(1,1)'});
    }
    else if(this.positionCenter() >= hero.positionCenter()){
      // если центр монстра правее монстра, меняем его направление на лево, к герою
      this.courseFace = "Left";
      $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(-1,1)'});
    }

  };

  // направляем монстра к игроку если игрок подошел близко
  // ===========================================================================
  this.trigMove = function () {
    this.trigFaseMons(); // метод изменения направления монстра в сторону игрока
    // исли игрок слишком близко, начать бой
    if((this.positionX +  $('.' + this.name).outerWidth()) >= hero.position && this.positionX <= (hero.position + $('.hero').outerWidth())){
      this.imgReplay('atack'); // включаем анимацию атаки
      $('.' + this.name).children('.cont_hp_monst').addClass('cont_hp_monst_active'); // показываем hp монстра
      $('.' + this.name).children('.sigth').removeClass('sigth_active');  // убираем показатель, что монстр нас увидел
      this.atac = true;
    }
    // идём за игроком
    else{
      this.atac = false;
      $('.' + this.name).children('.cont_hp_monst').removeClass('cont_hp_monst_active');
      $('.' + this.name).children('.sigth').addClass('sigth_active');
      this.imgReplay('Run'); // выключаем анимацию атаки
      if(this.positionX < hero.position){
        this.positionX += this.shift;
        $('.' + this.name).css({'left': this.positionX + 'px'});
      }
      else if (this.positionX > hero.position){
        this.positionX -= this.shift;
        $('.' + this.name).css({'left': this.positionX + 'px'});
      }
    }
    this.progress(this.positionX, false);
  };

  // ДВИЖЕНИЕ МОНСТРА
  // ===========================================================================
  this.possivMove = function(){
    if(this.status){

      if (this.positionX >= ($(window).outerWidth() / 3) && (this.positionX + $('.' + this.name).outerWidth()) <= ($('.conteiner_game').outerWidth() - $(window).outerWidth() / 3)) {
        // если игрок вошел в зону видимости монстро
        if(this.positionX >= hero.position - ($(window).outerWidth() / 2) && this.positionX <= hero.position + ($(window).outerWidth() / 2)){
          // пока игрок не вышел из зоны видимости монстров
          this.trigMove(); // метод ходьбы монстров за игроком
        }
        // Бесцельная ходьба монстра
        else {
          $('.' + this.name).children('.sigth').removeClass('sigth_active');  // убираем показатель, что монстр нас увидел
          if(this.courseFace == "Right"){ // проверяем направление монстра, если он идёт вправо
            this.positionX += this.shift; // изменяем позицию на единицк сдвига
            if(this.positionX + $('.' + this.name).outerWidth() < ($('.conteiner_game').outerWidth() - $(window).outerWidth() / 3)){ // проверка не выходит ли за правый край
              // сдвигаем монстра вправо и разворачиваем
              $('.' + this.name).css({'left': this.positionX + 'px'});
              $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(1,1)'});
            }
            else{ // если выходит
              this.courseFace = "Left";   // меняем направление
              this.positionX = ($('.conteiner_game').outerWidth() - $(window).outerWidth() / 3) - $('.' + this.name).outerWidth();  // изингяем позицию монстра
              // сдвигаем монстра на правый край карты и разворачиваем
              $('.' + this.name).css({'left': this.positionX + 'px'});
              $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(-1,1)'});
            }
          }
          else if(this.courseFace == "Left"){ // проверяем направление монстра, если он идёт влево..
            this.positionX -= this.shift; // изменяем позицию на единицк сдвига
            if(this.positionX > ($(window).outerWidth() / 3)){ // проверка не выходит ли за левый край
              // сдвигаем монстра влева и разворачиваем
              $('.' + this.name).css({'left': this.positionX + 'px'});
              $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(-1,1)'});
            }
            else{ // если выходит за левый край
              this.courseFace = "Right";   // меняем направление
              this.position = $(window).outerWidth() / 3;  // изингяем позицию монстра
              // сдвигаем монстра на левый край карты и разворачиваем
              $('.' + this.name).css({'left': this.positionX + 'px'});
              $('.' + this.name).children('.animat_monstr_img').css({'transform': 'scale(1,1)'});
            }
          }
          this.progress(this.positionX, false);
        }
      } else {
        if (this.positionX < ($(window).outerWidth() / 3)) {
          this.positionX = $(window).outerWidth() / 3;
          $('.' + this.name).css({'left': this.positionX + 'px'});
        }
        else if ((this.positionX + $('.' + this.name).outerWidth()) > ($('.conteiner_game').outerWidth() - $(window).outerWidth() / 3)) {
          this.positionX = $('.conteiner_game').outerWidth() - $(window).outerWidth() / 3 - $('.' + this.name).outerWidth();
          $('.' + this.name).css({'left': this.positionX + 'px'});
        }
      }
    }
  };

  // return случайного число для рандомной позиции монстра
  // ===========================================================================
  this.randomPositio = function(min, max){
    this.positionX = Math.floor(min - 0.5 + Math.random() * (max - min + 1));
    if(this.positionX < ($(window).outerWidth() / 2) || this.positionX > ( $('.conteiner_game').outerWidth() - ($(window).outerWidth() / 2)))
    this.randomPositio(min,max);
    $('.' + this.name).css({'left': this.positionX + 'px'});
  };


  // определяем вид монстра
  // ===========================================================================
  if(monstr.name == 'ELF'){
    countMonstr[3] +=1;   // количество всех видов монстов
    countMonstr[0] +=1;   // количество монстров данного вида
    this.monstr = 'elf';
    this.name = 'elf_' + ($('.elf').length + 1);
    this.hpAll = 120;
    this.hp = this.hpAll;
    this.shift = 1.5 - 0.5 + Math.random() * (2.5 - 1.5 + 1);
    this.markName = 'mark_monstr_' + this.name;
    this.power = 5;

    $('.conteiner_game').append('<div class="monstrs elf ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><div class="sigth"></div><img class="animat_monstr_img" src="img/elf/gifs/Run.gif">');
  }
  else if(monstr.name == 'GREENCH'){
    countMonstr[3] +=1;   // количество всех видов монстов
    countMonstr[2] +=1;   // количество монстров данного вида
    this.monstr = 'greench';
    this.name = 'greench_' + ($('.greench').length + 1);
    this.hpAll = 210;
    this.hp = this.hpAll;
    this.shift = 0.7 - 0.5 + Math.random() * (1.5 - 0.7 + 1);
    this.markName = 'mark_monstr_' + this.name;
    this.power = 7;

    $('.conteiner_game').append('<div class="monstrs greench ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><div class="sigth"></div><img class="animat_monstr_img" src="img/greench/gifs/Run.gif">');
  }
  else if(monstr.name == 'DOG'){
    countMonstr[3] +=1;   // количество всех видов монстов
    countMonstr[1] +=1;   // количество монстров данного вида
    this.monstr = 'dog';
    this.name = 'dog_' + ($('.dog').length + 1);
    this.hpAll = 70;
    this.hp = this.hpAll;
    this.shift = 1 - 0.5 + Math.random() * (2 - 1 + 1);
    this.markName = 'mark_monstr_' + this.name;
    this.power = 2;

    $('.conteiner_game').append('<div class="monstrs dog ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><div class="sigth"></div><img class="animat_monstr_img" src="img/dog/gifs/run.gif">');
  }
}
// end КОНСТРУКТОР МОНСТРОВ ====================================================
// =============================================================================


setInterval(function(){
  if(listMonstr[0].length + listMonstr[1].length + listMonstr[2].length < maxCountMonstr) {
    let randomMonstr = Math.random();
    // console.log(randomMonstr);
    if(randomMonstr < 0.5){
      listMonstr[0][countMonstr[0]] = new Monstr({name: 'ELF'});  // создаюм монстра
      listMonstr[0][countMonstr[0] - 1].randomPositio(0, $('.conteiner_game').outerWidth());  // задаём рандомную позицию монстру
      listMonstr[0][countMonstr[0] - 1].progress(listMonstr[0][countMonstr[0] - 1].positionX, true);  // создаём маркер прогресс-бар монстра
    }
    else if(randomMonstr >= 0.5 && randomMonstr <= 0.8){
      listMonstr[1][countMonstr[1]] = new Monstr({name: 'DOG'});  // создаюм монстра
      listMonstr[1][countMonstr[1] - 1].randomPositio(0, $('.conteiner_game').outerWidth());  // задаём рандомную позицию монстру
      listMonstr[1][countMonstr[1] - 1].progress(listMonstr[1][countMonstr[1] - 1].positionX, true);  // создаём маркер прогресс-бар монстра
    }
    else if(randomMonstr > 0.8 && randomMonstr <= 1){
      listMonstr[2][countMonstr[2]] = new Monstr({name: 'GREENCH'});  // создаюм монстра
      listMonstr[2][countMonstr[2] - 1].randomPositio(0, $('.conteiner_game').outerWidth());  // задаём рандомную позицию монстру
      listMonstr[2][countMonstr[2] - 1].progress(listMonstr[2][countMonstr[2] - 1].positionX, true);  // создаём маркер прогресс-бар монстра
    }

    $('.cou_mon').html(listMonstr[0].length + listMonstr[1].length + listMonstr[2].length);   // выводим количество монстров в html
  }
}, 450);

// функция удаления монстров
var removeObjectMonstr = function () {
  // удаляем все объекты в массиве
  for (var l = 0; l < listMonstr.length; l++) {
    for (var c = 0; c < listMonstr[l].length; c++) {
      listMonstr[l][c] = null;
    }
  }

  $('.monstrs').remove();

  // перезаписываем массивы
  countMonstr = [0,0,0,0];
  listMonstr = [
    [],
    [],
    []
  ];
};
