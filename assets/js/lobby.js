// define angular module
var lobby = angular.module('lobby', ['pexapp', 'pexapp.querystring']);

lobby.controller('LobbyController', function($rootScope, $scope, $state, $stateParams, $http, has_webrtc, conference, user, ConferenceState) {

    // reset the loader
    $scope.message    = '';
    $scope.conference = conference;
    $scope.user       = user;

    if (angular.isDefined(ConferenceState.get('pin'))) {
        $scope.user.pin = ConferenceState.get('pin');
    }

    // get the current user role
    user.getRole('', function(role) {
        switch(role) {
        case 'GUEST':
            $scope.user.role = 'GUEST';
            break;
        case 'INVALID_PIN':
            $scope.user.role = 'HOST';
            $state.go('login.pin');
            break;
        case 'HOST':
            if(has_webrtc) {
                $state.go('conference');
            }
            else {
                $state.go('conference-flash-merge');
            }
            break;
        default:
            // something went wrong -> go back to login
            $state.go('login.settings');
            break;
        }
    });

    $scope.selectRole = function() {
        if($scope.user.role == 'GUEST') {
            if(has_webrtc) {
                $state.go('conference');
            }
            else {
                $state.go('conference-flash-merge');
            }
        } else {
            $state.go('login.pin');
        }
    };

    $scope.login = function() {

        if($scope.user.pin.length == 0) {
            $scope.message = 'Please enter a PIN';
            return false;
        }

        user.getRole($scope.user.pin, function(role) {

            if(role != 'HOST' && role != 'GUEST') {
                $scope.message = 'Invalid PIN';
            } else {
                if(has_webrtc) {
                    $state.go('conference');
                }
                else {
                    $state.go('conference-flash-merge');
                }
            }

        });

    };

    if (angular.isDefined(ConferenceState.get('join'))) {
        $scope.login();
    }

    if ($stateParams.role) {
        $scope.user.role = $stateParams.role.toUpperCase();
        $scope.selectRole();
    }

});
