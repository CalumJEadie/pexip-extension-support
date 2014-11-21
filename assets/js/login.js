/* global $:false */

/**
 * @module login
 */
var login = angular.module('login', [
    'pexapp',
    'pexapp.querystring',
    'pexapp.media',
    'pexapp.diagnostics.network',
    'pexapp.dropdown'
]);


login.factory('ScopeWatchers', function() {
    'use strict';

    return {
        attachUserAudioWatcher: function($scope) {
            $scope.$watch('user.audio', function (newValue, oldValue) {
                if (angular.isDefined(newValue) && (newValue === true)) {
                    if (angular.isDefined($scope.user.screen) && ($scope.user.screen === true)) {
                        $scope.user.screen = false;
                    }

                    if (angular.isDefined($scope.user.roster) && ($scope.user.roster === true)) {
                        $scope.user.roster = false;
                    }
                }
            });
        },

        attachUserScreenWatcher: function($scope) {
            $scope.$watch('user.screen', function (newValue, oldValue) {
                if (angular.isDefined(newValue) && (newValue === true)) {
                    if (angular.isDefined($scope.user.audio) && ($scope.user.audio === true)) {
                        $scope.user.audio = false;
                    }

                    if (angular.isDefined($scope.user.roster) && ($scope.user.roster === true)) {
                        $scope.user.roster = false;
                    }
                }
            });
        },

        attachUserRosterWatcher: function($scope) {
            $scope.$watch('user.roster', function (newValue, oldValue) {
                if (angular.isDefined(newValue) && (newValue === true)) {
                    if (angular.isDefined($scope.user.roster) && ($scope.user.roster === true)) {
                        $scope.user.audio = false;
                        $scope.user.screen = false;
                    }
                }
            });
        }
    };
});


login.factory('ConferenceHistory',
    /**
     * @function
     *
     * @memberOf login
     */
    function ConferenceHistory() {
        'use strict';

        var _localStorageKey = 'CONFERENCE_HISTORY';

        var module = {
            /**
             * @description Clear history
             */
            clear: function() {
                delete window.localStorage[_localStorageKey];
            },

            /**
             * @description List all conferences
             *
             * @function
             *
             * @memberOf login
             *
             * @return {list} List of conference names in the history
             */
            list: function() {
                var result = [];

                try {
                    var storage = localStorage.getItem(_localStorageKey);

                    result = JSON.parse(storage);

                    if (result === null) {
                        result = [];
                    }
                } catch (e) {

                }

                return result;
            },

            /**
             * @description Add a conference to history
             *
             * @function
             *
             * @memberOf login
             *
             * @param {string} name Conference ID/name
             */
            add: function(name) {
                // add name to localstorage
                var history = module.list();

                if (history.indexOf(name) === -1) {
                    history.push(name);

                    var jsonObject = JSON.stringify(history);

                    localStorage.setItem(_localStorageKey, jsonObject);
                }
            }
        };

        return module;
    });


login.factory('LoginMediaSources', function(has_webrtc, translationService) {
    'use strict';
    if (has_webrtc) {
        var module = {
            audioSources: function(mediaSources) {
                var result = [];

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_DEFAULT'),
                    id: ''
                });

                angular.forEach(mediaSources, function(source) {
                    if ((source.kind === 'audio') && (source.label !== 'Default')) {
                        result.push({
                            id: source.id,
                            label: source.label || translationService.instant('LOGIN_MICROPHONE'),
                            d: source
                        });
                    }
                });

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_NONE'),
                    id: false
                });


                return result;
            },

            videoSources: function(mediaSources) {
                var result = [];

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_DEFAULT'),
                    id: ''
                });

                angular.forEach(mediaSources, function(source) {
                    if ((source.kind === 'video') && (source.label !== 'Default')) {
                        result.push({
                            id: source.id,
                            label: source.label || translationService.instant('LOGIN_CAMERA'),
                            d: source
                        });
                    }
                });

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_NONE'),
                    id: false
                });


                return result;
            }
        };
    }
    else {
        var flash = null;
        var module = {
            audioSources: function() {
                var result = [];
                flash = swfobject.getObjectById('flashvideo');
                result.push({
                    label: translationService.instant('LOGIN_MEDIA_DEFAULT'),
                    id: ''
                });
                var mediaSources = flash.enumerateAudioSources();
                angular.forEach(mediaSources, function(source, value){
                    if (source == "Default"){
                        return;
                    }
                    console.log(source, value);
                    result.push({
                        label: source,
                        id: value
                    });
                });

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_NONE'),
                    id: false
                });
                return result;
            },
            videoSources: function() {
                var result = [];
                flash = swfobject.getObjectById('flashvideo');
                result.push({
                    label: translationService.instant('LOGIN_MEDIA_DEFAULT'),
                    id: ''
                });
                var mediaSources = flash.enumerateVideoSources();
                angular.forEach(mediaSources, function(source){
                    console.log(source);
                    result.push({
                        label: source,
                        id: source
                    });
                });

                result.push({
                    label: translationService.instant('LOGIN_MEDIA_NONE'),
                    id: false
                });
                return result;
            }
        };
    }
    return module;
});

function callAngularScopeFunc(func_name) {
    console.log("Calling " + func_name);
    // BLACK MAGIC
    angular.element(document.getElementById('flashvideo')).scope()[func_name]();
}

login.controller('LoginController', function(
        $timeout,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $http,
        has_webrtc,
        hasChromeWebstore,
        bandwidths,
        conference,
        user,
        mediaSources,
        ScopeWatchers,
        ConferenceHistory,
        BandwidthEstimator,
        LoginMediaSources,
        ConferenceState) {
    'use strict';

    // some way to optimise the bandwidth estimator
    var BANDWIDTH_ADJUSTMENT = 0.25;

    $scope.bandwidths = bandwidths;
    $scope.message    = null;
    $scope.conference = conference;
    $scope.user       = user;
    $scope.conferenceHistory = ConferenceHistory.list();
    $scope.audioMediaSources = [];
    $scope.videoMediaSources = [];
    $scope.load_flash = !has_webrtc;
    $scope.hasChromeWebstore = hasChromeWebstore;
    ConferenceState.create();

    $scope.pageLoadTime = null;
    $scope.bandwidthEstimated = 'testing...';
    $scope.pageSize = 685 * 1024;

    function bandwidthUpdated(event, data) {
        // massage the speed to a more reasonable result
        data.numberOfkbitsPerSecond =  data.numberOfkbitsPerSecond * BANDWIDTH_ADJUSTMENT;

        console.log('Estimated BW: ' + data.numberOfkbitsPerSecond);

        if ($scope.overrideBandwidth === true) {
            console.log('BW already set. Ignoring.');
            return;
        }
        // page size is in bytes
        $timeout(function() {
            $scope.bandwidthEstimated = data.numberOfkbitsPerSecond.toFixed(0);

            angular.forEach($scope.bandwidths, function(item) {
                if (parseInt($scope.bandwidthEstimated, 10) > parseInt(item.value, 10)) {
                    $scope.user.bandwidth = item.value;
                }
            });
        }, 0);
    }

    //$rootScope.$on('bandwidth:estimated', bandwidthUpdated);

    /*
    BandwidthEstimator.pageLoadTime()
        .then(function(data) {
            // data returns an average time not the fastest time
            bandwidthUpdated(null, data);
        });
    */

    $scope.overrideBandwidth = false;
    if($stateParams.conference) $scope.conference.id = $stateParams.conference;
    if($stateParams.name) $scope.user.username= $stateParams.name;
    if($stateParams.bw) {
        $scope.user.bandwidth = (parseInt($stateParams.bw) - 64).toString();
        $scope.overrideBandwidth = true;
    }
    if($stateParams.screen) $scope.user.screen = true;
    if($stateParams.audio) $scope.user.audio = true;
    if($stateParams.pin) ConferenceState.set('pin', $stateParams.pin);
    if($stateParams.join) ConferenceState.set('join', $stateParams.join);

    // if the user already has a preferred bandwidth
    // take that as a default for the select box
    if(!$scope.user.bandwidth) {
        $scope.user.bandwidth = $scope.bandwidths[1].value;
    } else {
        $scope.overrideBandwidth = true;
    }

    $rootScope.settings = {
        audioSource: $scope.user.audioSource,
        videoSource: $scope.user.videoSource,
        videoSourceObject: null,
        audioSourceObject: null
    };

    $rootScope.$watch('settings.videoSourceObject', function(newValue, oldValue) {
        if (angular.isDefined(newValue) && (newValue !== null)) {
            $rootScope.settings.videoSource = newValue.id;
        }
    });

    $rootScope.$watch('settings.audioSourceObject', function(newValue, oldValue) {
        if (angular.isDefined(newValue) && (newValue !== null)) {
            $rootScope.settings.audioSource = newValue.id;
        }
    });

    // nasty hack to force Chrome to repaint to avoid leaving artefacts on the page
    $scope.forceRepaint = function() {
        try {
            if ($('.form__container')[0].style.webkitTransform == '') {
                $('.form__container')[0].style.webkitTransform = 'scale(1)';
            } else {
                $('.form__container')[0].style.webkitTransform = '';
            }
        } catch (e) {
            // do nothing
        }
    };

    function findSelect(iterator, value, key) {
        var changed = false;
        var changeTo = null;

        angular.forEach(iterator, function(item) {
            if (item[key] === value) {
                changeTo = item;
                changed = true;
            }
        });

        if (changed) {
            return changeTo;
        }

        return null;
    }


    $scope.flash_is_ready = function() {
        console.log("FLASH IS READY");
        $scope.$apply($scope.onready);
    }


    $scope.onready = function() {
        if ($stateParams.audioSourceIndex && mediaSources) {
            // Passing the source.id as does not work between domains (hash is different),
            // so we need to pass the index in the device enumeration array
            var audioSource = mediaSources[$stateParams.audioSourceIndex];
            $rootScope.settings.audioSource = audioSource && audioSource.id;
        }
        if ($stateParams.videoSourceIndex && mediaSources) {
            var videoSource = mediaSources[$stateParams.videoSourceIndex];
            $rootScope.settings.videoSource = videoSource && videoSource.id;
        }
        $scope.audioMediaSources = LoginMediaSources.audioSources(mediaSources);
        $scope.videoMediaSources = LoginMediaSources.videoSources(mediaSources);
        //
        // now the selects have data, connect up the default values
        //
        $rootScope.settings.videoSourceObject = findSelect($scope.videoMediaSources, $rootScope.settings.videoSource, 'id');
        $rootScope.settings.audioSourceObject = findSelect($scope.audioMediaSources, $rootScope.settings.audioSource, 'id');

        ScopeWatchers.attachUserScreenWatcher($scope);
        ScopeWatchers.attachUserAudioWatcher($scope);
        ScopeWatchers.attachUserRosterWatcher($scope);
    }

    if (has_webrtc) {
        $scope.onready();
    }
    $scope.advancedControls = false;

    /**
     * Autotab to the next item to make the tabindex a little friendlier
     *  when pressing enter on the advanced link.
     */
    $scope.$watch('advancedControls', function(newValue, oldValue) {
        if (newValue === true) {
            $timeout(function() {
                $('#user-bandwidth-field').focus();
                $('#user-bandwidth-field').select();
            }, 0);
        }
    });

    var rosterOnly = localStorage.getItem('roster');
    if (angular.isDefined(rosterOnly) && (rosterOnly === 'true')) {
        $scope.user.roster = true;
        $scope.advancedControls = true;
    }

    $scope.enterConference = function() {
        if(has_webrtc) {
            $state.go('conference');
        }
        else {
            $state.go('conference-flash');
        }
    };

    $scope.login = function() {

        if($scope.conference.id === null || $scope.conference.id.length === 0) {
            $scope.message = 'Please enter a conference name';
            return;
        }

        if($scope.user.username === null || $scope.user.username.length === 0) {
            $scope.message = 'Please enter a username';
            return;
        }

        // store user credentials
        localStorage.setItem('username',   $scope.user.username);
        localStorage.setItem('bandwidth',  $scope.user.bandwidth);
        localStorage.setItem('screen',     $scope.user.screen);
        localStorage.setItem('audio',      $scope.user.audio);
        localStorage.setItem('conference', $scope.conference.id);
        localStorage.setItem('roster',     $scope.user.roster);
        localStorage.setItem('sources', JSON.stringify({
            video: $scope.settings.videoSource,
            audio: $scope.settings.audioSource
        }));

        user.getRole('', function(role) {
            switch(role) {
            case 'GUEST':
                ConferenceHistory.add($scope.conference.id);
                $state.go('login.role', $stateParams);
                break;
            case 'INVALID_PIN':
                ConferenceHistory.add($scope.conference.id);
                $state.go('login.pin');
                break;
            case 'HOST':
                ConferenceHistory.add($scope.conference.id);
                $scope.enterConference();
                break;
            case 'INVALID_CONF_NAME':
                conference.isGateway(function(response) {
                    if(response) {
                        $scope.enterConference();
                    } else {
                        $scope.message = 'Invalid conference';
                    }
                });
                break;
            default:
                $scope.message = 'Server error. Please try again!';
                break;
            }
        });

    };

    if ($stateParams.join) {
        $scope.login();
    }
});
