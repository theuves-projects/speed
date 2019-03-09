'use strict';

// scrollToRate -> ./js/utils.js
// rateToScroll -> ./js/utils.js

var RATES = 9;

//
// Inicia
//
function onLoad() {
  addMessageListener();
  initPlaybackRate(true);
  plotRates();
  configScrollEffect();
}

//
// Para a conexão da página do popup e do usuário
//
function addMessageListener() {
  chrome.tabs.executeScript(null, {
    file: './js/content.js'
  });
}

//
// Sincroniza o `.playbackRate` do video da página com a do popup
//
function initPlaybackRate() {
  chrome.tabs.query({ currentWindow: true, active : true }, function (tabArr) {
    chrome.tabs.sendMessage(tabArr[0].id, 'GET_DEFAULT_PLAYBACK_RATE', {}, function (res) {
      if (!res) {
        return;
      }

      var defaultPlaybackRate = res.defaultPlaybackRate;

      if (defaultPlaybackRate === false) {
        document.getElementById('no-video').style.display = 'block';
        return;
      }

      document.getElementById('no-video').style.display = 'none';

      var container = document.getElementById('container');
      var value = document.getElementById('value');

      value.innerText = defaultPlaybackRate.toFixed('2');
      container.scrollLeft = rateToScroll(defaultPlaybackRate, 3, 1, 300, 0);
    });
  });
}

//
// Adiciona as taxas de velocidade na tela
//
function plotRates() {
  var range = document.getElementById('range');

  for (var i = 0; i < RATES; i++) {
    var rate = document.createElement('div');
    rate.classList.add('rate');

    if (i % 2 === 0) {
      rate.classList.add('special');
      rate.setAttribute('data-value', 1 + i * 0.25)
    }

    range.appendChild(rate);
  }
}

//
// Configura o efeito de arrastar para selecionar um valor
//
function configScrollEffect() {
  var container = document.getElementById('container');
  var range = container.querySelector('#range');
  var value = document.getElementById('value');

  //
  // Documentation: <https://github.com/ilyashubin/scrollbooster#readme>
  //
  var sb = new ScrollBooster({
    viewport: container, //
    content : range,     // 
    friction: 0.075,     // Em relação à continuação após soltar
    bounce  : false,     // Não "bater e voltar" na borda
    mode    : 'x',       // Referente ao eixo "x"
    onUpdate: onUpdate   // Ao atualizar
  });

  // Quando o usuário selecionar um valor
  function onUpdate(data) {
    if (value.hasAttribute('data-is-default')) {
      value.removeAttribute('data-is-default');
      return;
    }

    var posX = data.position.x;
    var rate = scrollToRate(posX, 3, 1, 300, 0).toFixed(2);

    container.scrollLeft = posX;

    // Demonstra o valor na tela
    document.getElementById('value').innerText = rate;

    if (!data.isRunning && !data.isDragging && !data.isScrolling) {
      updatePlaybackRate(rate);
    }
  }

  // Atualiza a velocida quando o usuário terminar de selecionar
  function updatePlaybackRate(rateValue) {
    chrome.tabs.executeScript(null, {
      code: 'document.querySelector("video").playbackRate = ' + rateValue
    });
  }
}

window.addEventListener('load', onLoad)