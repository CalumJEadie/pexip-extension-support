// custom log function
var log = function(message) {
  // IE8 has no window.console.if the developer tools are turned off
  if (!angular.isDefined(window.console)) {
    console.log(message);
  }
};

angular.module('pexapp', [
    'ui.router',
    'pascalprecht.translate',
    'pexapp.popup',
    'pexapp.translations',
    'pexapp.translations.constants',
    'pexapp.diagnostics',
    'pexapp.layout',
    'ngAnimate',
    'pexapp.user',
    'pexapp.dtmf'
  ])
  .constant('has_webrtc',
    navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia
  )
  .constant('hasChromeWebstore',
    window.top.overrideHasChromeWebstore || window.chrome && window.chrome.webstore
  )
  .factory('conference', function($http) {
    /*global RTC_NODE*/
    var conference = {
      id : localStorage.getItem('conference'),
      isGateway: function(callback) {
        return $http.get('https://' + RTC_NODE + '/api/client/v1/services/' + conference.id + '/service_type')
          .success(function(data, status, headers, config) {
            if (data.result == 'gateway') {
              callback(true);
            }
            else {
              callback(false);
            }
          })
          .error(function(data, status, headers, config) {
            callback(false);
          });
      }
    };

    return conference;

  })
  .value('version', '1.0')
  .value('bandwidths', [
    {name:'Low Bandwidth (256kbps)',   value: '192'},
    {name:'Medium Bandwidth (576kbps)',   value: '512'},
    {name:'High Bandwidth (1264kbps)', value: '1200'},
    {name:'Maximum Bandwidth (1864kbps)',  value: '1800'}
  ]);


/**
 * @description State storage for conference
 * @memberOf conference
 */
angular.module('pexapp').factory('ConferenceState', function() {
    'use strict';

    var _conferenceState = {};

    return {
        'create': function() {
            _conferenceState = {};
        },

        'get': function(key) {
            return _conferenceState[key];
        },

        'set': function(key, value) {
            _conferenceState[key] = value;
        }
    };
});
