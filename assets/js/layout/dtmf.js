/**
 * @module pexapp.dtmf
 *
 * @memberOf pexapp
 */
angular.module('pexapp.dtmf', [])
	.directive('dtmf', [
		'DtmfMessages',
		function Dtmf(DtmfMessages) {
			'use strict';

			return {
				transclude: false,
				templateUrl: 'assets/templates/dtmf/pinpad.html',
				link: function (scope, element, attr) {
					scope.buttonClick = function(message) {
						DtmfMessages.send(scope, message);
					};

					scope.closeClick = function() {
						DtmfMessages.closeSend(scope);
					};
				}
			};
		}
	])

	.factory('DtmfMessages', [
		function () {
			'use strict';

			return {
				/**
				 * @function button
				 *
				 * @description Emits event dtmf:button:pressed up the scope, with a single data payload
				 */
				send: function(scope, data) {
					scope.$emit('dtmf:button:pressed', data);
				},

				/**
				 * @function
				 *
				 * @description Pass a delegate function to receive the data
				 */
				receive: function(scope, fn) {
					scope.$on('dtmf:button:pressed', function(evt, data) {
						fn(data);
					});
				},

				closeSend: function(scope) {
					scope.$emit('dtmf:close');
				},

				closeReceive: function(scope, fn) {
					scope.$on('dtmf:close', function(evt) {
						fn();
					});
				}
			};
		}
	]);

