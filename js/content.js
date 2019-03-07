'use strict';

chrome.runtime.onMessage.addListener(function (req, _, sendResponse) {
  switch (req) {
    case 'GET_DEFAULT_PLAYBACK_RATE':
      sendResponse({
        defaultPlaybackRate: (function () {
          var video = document.querySelector('video');

          return video && typeof video.playbackRate === 'number'
            ? video.playbackRate
            : 1;
        })()
      });
      break
    default:
      sendResponse({});
  }
})