/* global MediaStreamTrack */

angular.module('pexapp.media', [])
  .factory('media', function($q) {
    'use strict';

    return {
      getSources: function() {
        var sourcesDeferred = $q.defer();

        if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
          MediaStreamTrack.getSources(function(sources) {
            sourcesDeferred.resolve(sources);
          });
        } else {
          sourcesDeferred.resolve(null);
        }

        return sourcesDeferred.promise;
      }
    };
  });
