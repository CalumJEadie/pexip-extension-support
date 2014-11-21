angular.module('pexapp.router', [
    'ui.router',
    'login',
    'lobby',
    'conference',
    'conferenceFlash',
    'pexapp.config'
])
.config(function($stateProvider, $urlRouterProvider) {
    'use strict';

    $urlRouterProvider.otherwise(function($injector, $location) {
        if (window.location.search !== '') {
            var url = window.location.origin +
                window.location.pathname +
                '#/' +
                window.location.search;

            window.location.href = url;

            return;
        }

        $location.path('/');
    });

    $stateProvider
        .state('login', {
            abstract: true,
            templateUrl:  angular.isDefined(window.PEXIP_USE_FLEXBOX) ?
                'assets/templates/login-flex.html' :
                'assets/templates/login.html'
        })
        .state('login.settings', {
            url: '/?name&conference&bw&pin&role&join&screen&audio&videoSourceIndex&audioSourceIndex',
            templateUrl: 'assets/templates/login.settings.html',
            resolve: {
                mediaSources: function(media) {
                    return media.getSources();
                }
            },
            controller: 'LoginController'
        })
        .state('login.role', {
            url: '/role?role',
            templateUrl: 'assets/templates/login.role.html',
            controller: 'LobbyController'
        })
        .state('login.pin', {
            url: '/pin',
            templateUrl: 'assets/templates/login.pin.html',
            controller: 'LobbyController'
        })
        .state('login.browser', {
            url: '/browser',
            templateUrl: 'assets/templates/login.browser.html'
        })
        .state('login.download', {
            url: '/download',
            templateUrl: 'assets/templates/login.download.html'
            // controller: 'LobbyController'
        })
        .state('conference', {
            url: '/conference',
            templateUrl: angular.isDefined(window.PEXIP_USE_FLEXBOX) ?
                'assets/templates/conference-flex.html' :
                'assets/templates/conference.html',
            controller: 'ConferenceController'
        })
        .state('conference-roster', {
            url: '/conference-roster',
            templateUrl: 'assets/templates/conference-roster.html',
            controller: 'ConferenceController'
        })
        .state('conference-flash', {
            url: '/conference-flash',
            templateUrl: angular.isDefined(window.PEXIP_USE_FLEXBOX) ?
                'assets/templates/conference-flash-flex.html' :
                'assets/templates/conference-flash.html',
            controller: 'ConferenceFlashController'
        });
});
