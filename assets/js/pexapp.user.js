angular.module('pexapp.user', [])
.factory('user', function($http, conference) {
    'use strict';

    function readAudioVideoSource(user) {
        var readSource = localStorage.getItem('sources');

        if ((angular.isDefined(readSource)) && (readSource !== null)) {
            var parseSource = JSON.parse(readSource);
            user.audioSource = parseSource.audio;
            user.videoSource = parseSource.video;
        }
    }

    var user = {
        videoSource: '',
        audioSource: '',
        username   : localStorage.getItem('username'),
        pin        : '',
        screenValue: function() {
            return (localStorage.getItem('screen') === 'true') ? true : false;
        },
        audioValue: function() {
            return (localStorage.getItem('audio') === 'true') ? true : false;
        },
        bandwidth  : localStorage.getItem('bandwidth'),
        disconnect : function(url) {
            // this has now moved into the controller.
            if(confirm('Do you really want to leave the conference?')) {
                window.location.href = url;
            } else {
                return false;
            }
        },
        isHost : function() {
            return user.role === 'HOST';
        },
        getRole : function(pin, callback) {

            return $http.get(REST_URI + conference.id + '/role', {headers: {'pin': pin}})
                .success(function(data, status, headers, config) {
                    switch(data.result) {
                        case 'GUEST':
                        case 'HOST':
                        case 'INVALID_PIN':
                        case 'INVALID_CONF_NAME':
                            return callback(data.result);
                            break;
                        default:
                            return callback('SERVER_ERROR');
                            break;
                    }
                })
                .error(function(data, status, headers, config) {
                    switch(data.result) {
                        case 'INVALID_PIN':
                        case 'INVALID_CONF_NAME':
                            return callback(data.result);
                            break;
                        default:
                            return callback('SERVER_ERROR');
                            break;
                    }
                });

        }
    };

    readAudioVideoSource(user);

    return user;

});
