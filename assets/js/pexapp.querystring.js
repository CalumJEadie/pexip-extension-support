var querystring = angular.module('pexapp.querystring', []);

querystring.factory('QueryString', function() {
	'use strict';

	return {
		getSearchFromLocation: function() {
			if (window.location.search !== '') {
				return window.location.search;
			} else {
				return '';
			}
		},

		all: function(inputString) {
			// import settings from query parameters
			var qp = {};
			var params = decodeURI(inputString).replace('?', '').split('&');
			var i;
			for (i=0;i<params.length;i++) {
				var kv = params[i].split('=');
				qp[kv[0]] = kv[1];
			}

			return qp;
		}
	};
});

