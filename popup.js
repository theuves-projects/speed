'use strict';

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.executeScript(null, {
    file: 'content.js'
  });

  chrome.tabs.query({ currentWindow: true, active : true }, function (tabArr) {
    chrome.tabs.sendMessage(tabArr[0].id, 'GET_DEFAULT_PLAYBACK_RATE', {}, function (res) {
      var defaultPlaybackRate = res.defaultPlaybackRate

      document.getElementById('value').innerText = defaultPlaybackRate
    })
  })

  var range = $('.flex')

  for (var i = 0; i < 9; i++) {
    var rate = $('<div>')
    range.append(rate)
  }

  console.log('Hello!')

  const getRate = (x, lMax, lMin, gMax, gMin) => x * (lMax - lMin) / (gMax - gMin) + lMin

  let viewport = document.querySelector('.range')
  let content = viewport.querySelector('.flex')

  let sb = new ScrollBooster({
    viewport,
    content,
    friction: 0.075,
    bounce: false,
    mode: 'x',
    onUpdate: (data) => {
      var value = data.position.x

      viewport.scrollLeft = value
      rate = getRate(value, 3, 1, 300, 0).toFixed(2)

      $('#value').text(rate)
      
      // On stop...
      if (!data.isRunning && !data.isDragging && !data.isScrolling) {
        chrome.tabs.executeScript(null, {
          code: 'document.querySelector("video").playbackRate = ' + rate
        });
      }
    }
  })
});