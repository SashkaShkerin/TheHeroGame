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

  this.positionX = 0; // позиция монстра
  this.positionCenter = function() { return this.positionX + $('.' + this.name).outerWidth() / 2; }; // позиция героя + половина его ширины (позиция относительна центра героя)

  this.courseFace = 'Left'; // направление монстра
  this.power = 20;

  // работаем с позицией монстра на прогресс баре
  // ===========================================================================
  this.progress = function(position, add){
    if(add == true){ // если нужно создать маркер
      $('.conteiner_progress_bar').append('<div class="mark_monstr ' + this.markName + '"></div>');
    } else;
    let prog = Math.abs(position) * ( 100 / $('.conteiner_game').outerWidth() );
    $('.' + this.markName).css({'left' : prog + "%"});
  };


  this.imgReplay = function (image) {
      if(this.monstr == "dog") return;
      if($('.' + this.name).children().attr('src') == 'img/' + this.monstr + '/gifs/'+ image +'.gif'){
        // если установленна нужная онимация, ничего не делаем
      }
      else {
        $('.' + this.name).children().attr('src', 'img/' + this.monstr + '/gifs/'+ image +'.gif');
      }
  };

  // направление монстра относительно игрока, ходьба за игроком
  // ===========================================================================
  this.trigFaseMons = function () {
    if(this.positionCenter() <= hero.positionCenter()){
    // если центр монстра левее монстра, меняем его направление на право, к герою
      this.courseFace = "Right";
      $('.' + this.name).children('.animat_hero_img').css({'transform': 'scale(-1,1)'}); 
    }
    else if(this.positionCenter() >= hero.positionCenter()){
    // если центр монстра правее монстра, меняем его направление на лево, к герою
      this.courseFace = "Left";
      $('.' + this.name).children('.animat_hero_img').css({'transform': 'scale(1,1)'});
    }
    
  };

  // направляем монстра к игроку если игрок подошел близко
  // ===========================================================================
  this.trigMove = function () {
    this.trigFaseMons();
    // исли игрок слишком близко, начать бой
    if((this.positionX +  $('.' + this.name).outerWidth()) >= hero.position && this.positionX <= (hero.position + $('.hero').outerWidth())){
      this.imgReplay('atack'); // включаем анимацию атаки
      $('.' + this.name).children('.cont_hp_monst').addClass('cont_hp_monst_active');
      
    }
    // идём за игроком
    else{
      $('.' + this.name).children('.cont_hp_monst').removeClass('cont_hp_monst_active');
      this.imgReplay('Run'); // выключаем анимацию атаки
      if(this.positionX < hero.position){
          this.positionX += this.shift;
          $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(-1,1)'});
      }
      else if (this.positionX > hero.position){
        this.positionX -= this.shift;
        $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(1,1)'});
      }
    }
    this.progress(this.positionX, false);
  };

  // ДВИЖЕНИЕ МОНСТРА
  // ===========================================================================
  this.possivMove = function(){
    // если игрок вошел в зону видимости монстро
    if(this.positionX >= hero.position - ($(window).outerWidth() / 3) && this.positionX <= hero.position + ($(window).outerWidth() / 3)){
      this.trigMove(); // метод ходьбы монстров за игроком

      // пока игрок не вышел из зоны видимости монстров
    }
    // Бесцельная ходьба монстра
    else {
      if(this.courseFace == "Right"){ // проверяем направление монстра, если он идёт вправо
        if(this.positionX + $('.' + this.name).outerWidth() < $('.conteiner_game').outerWidth()){ // проверка не выходит ли за правый край
          this.positionX += this.shift; // изменяем позицию на единицк сдвига
          $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(-1,1)'}); // сдвигаем монстра вправо и разворачиваем
        }
        else if (this.positionX + $('.' + this.name).outerWidth() >= $('.conteiner_game').outerWidth()) { // если выходит
          this.courseFace = "Left";   // меняем направление
          this.position = $('.conteiner_game').outerWidth() - $('.' + this.name).outerWidth();  // изингяем позицию монстра
          $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(1,1)'}); // ставим монстра на павый край карты и разворачиваем
        }
      }
      else if(this.courseFace == "Left"){ // проверяем направление монстра, если он идёт влево..
        if(this.positionX > 0){ // проверка не выходит ли за левый край
          this.positionX -= this.shift; // изменяем позицию на единицк сдвига
          $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(1,1)'}); // сдвигаем монстра влево и разворачиваем
        }
        else if(this.positionX <= 0) { // если выходит за левый край
          this.courseFace = "Right";   // меняем направление
          this.position = 0;  // изингяем позицию монстра
          $('.' + this.name).css({'left': this.positionX + 'px', 'transform': 'scale(-1,1)'}); // ставим монстра на павый край карты и разворачиваем
        }
      }
      this.progress(this.positionX, false);

      // console.log(this.name  +"||"+this.positionX +"||"+this.courseFace);
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
    this.hp =  monstr.hp || 120;
    this.shift = Math.floor(1.5 - 0.5 + Math.random() * (2.5 - 1.5 + 1));
    this.markName = 'mark_monstr_' + this.name;

    $('.conteiner_game').append('<div class="monstrs elf ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><img class="animat_monstr_img" src="img/elf/gifs/Run.gif">');
  }
  else if(monstr.name == 'GREENCH'){
    countMonstr[3] +=1;   // количество всех видов монстов
    countMonstr[2] +=1;   // количество монстров данного вида
    this.monstr = 'greench';
    this.name = 'greench_' + ($('.greench').length + 1);
    this.hp =  monstr.hp || 210;
    this.shift = Math.floor(0.7 - 0.5 + Math.random() * (1.5 - 0.7 + 1));
    this.markName = 'mark_monstr_' + this.name;

    $('.conteiner_game').append('<div class="monstrs greench ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><img class="animat_monstr_img" src="img/greench/gifs/Run.gif">');
  }
  else if(monstr.name == 'DOG'){
    countMonstr[3] +=1;   // количество всех видов монстов
    countMonstr[1] +=1;   // количество монстров данного вида
    this.monstr = 'dog';
    this.name = 'dog_' + ($('.dog').length + 1);
    this.hp =  monstr.hp || 70;
    this.shift = Math.floor(1 - 0.5 + Math.random() * (2 - 1 + 1));
    this.markName = 'mark_monstr_' + this.name;

    $('.conteiner_game').append('<div class="monstrs dog ' + this.name + '"></div>');
    $('.' + this.name).html('<div class="cont_hp_monst"><div class="hp_monst"></div></div><img class="animat_monstr_img" src="img/dog/gifs/run.gif">');
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
