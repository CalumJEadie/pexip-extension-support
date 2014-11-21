// config
var RTC_NODE           = (typeof(window.top.rtcNode) !== 'undefined' && window.top.rtcNode) || document.domain;
var REST_URI           = '/api/client/v1/conferences/';
var PRES_ACTIVE_RATE   = 1000;
var PRES_INACTIVE_RATE = 3000;


/**
 * Override RTC_NODE with
 *
 * window.NETWORK_SETTINGS.RTC_NODE
 *
 * if it exists.
 */
if (typeof window.NETWORK_SETTINGS !== 'undefined') {
	if (typeof window.NETWORK_SETTINGS.RTC_NODE !== 'undefined') {
		if (window.NETWORK_SETTINGS.RTC_NODE !== null) {
			RTC_NODE = window.NETWORK_SETTINGS.RTC_NODE;
			REST_URI = 'https://' + window.NETWORK_SETTINGS.RTC_NODE + window.REST_URI;
		}
	}
}


angular.module('pexapp.config', [])

.constant('brandingCss',
    window.top.brandingCss || 'application_settings/branding.css'
)

.controller('PexappConfig', function($scope, brandingCss) {
	'use strict';
	$scope.brandingCss = brandingCss;
	$scope.isDesktopClient = window.top.isDesktopClient || false;
});
