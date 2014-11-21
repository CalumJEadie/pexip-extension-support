'use strict';
/* globals $:false */

angular.module('pexapp.popup')
	.directive('popupContainer', [
		/**
		 * Container element to put popups in.
		 * Pass in the items array with @items
		 *
		 * @function
		 * @scope
		 */
		function popupContainer() {
			return {
				replace: true,
				templateUrl: 'assets/templates/popup/container.html',
				scope: {
					items: '='
				},
				link: function ($scope, element, attrs) {
					/**
					 * Remove a popup from the popup array
					 * @function
					 */
					function removePopup(index, timestamp) {
						for(var i=0; i < $scope.items; i++) {
							if ($scope.items[i].timestamp === timestamp) {
								index = i;
							}
						}
						$scope.items.splice(index, 1);
					}

					/**
					 * Event handler for a child popup requesting removal
					 * @event
					 */
					function popupAlertClose(event, data) {
						var index = parseInt(data.index, 10);
						removePopup(index, data.timestamp);
					}

					//$scope.$on('popupAlert:close', popupAlertClose);

					//$scope.removePopup = removePopup;
				}
			};
		}
	]);



angular.module('pexapp.popup')
	.filter('keyHumanReadable', [
		function() {
			return function(input) {
				var out = input.replace('_', ' ').replace('-', ' ');
				return out.charAt(0).toUpperCase() + out.slice(1);
			};
		}
	]);

angular.module('pexapp.popup')
	.directive('popupAlert', [
		'$timeout',
		'$rootScope',
		'DefaultSettings',

		/**
		 * single alert popup directive
		 * @function
		 */
		function popupAlert($timeout, $rootScope, DefaultSettings) {
			return {
				replace: true,
				templateUrl: 'assets/templates/popup/alert.html',
				scope: {
					message: '=message',
					buttons: '=buttons',
					index: '@index',
					popupType: '=popupType',
					data: '=data',
					timestamp: '@timestamp',
					updater: '=updater',
					options: '=options'
				},
				link: function ($scope, element, attrs) {

					$scope.toastTop = 0;
					$scope.dataCheckbox = 'sip';

					function removeElementFromDom() {
						var cssSelector = '*[timestamp=' + $scope.timestamp + ']';
						$(cssSelector).each(function(index, element) {
							var $element = $(element);
							$element.remove();
						});
					}


					/**
					 * Request this popup is removed
					 * @function
					 */
					function dismiss() {
						$scope.updater = null;
						removeElementFromDom();

						$timeout(function() {
							$rootScope.$broadcast('popupAlert:close', {
								index: $scope.index,
								timestamp: $scope.timestamp
							});
						}, 0);
					}

					/**
					 * Click handler for the button. This calls the callback
					 * @event
					 */
					function clickButton(button, data, dataCheckbox) {
						$scope.data = data;

						if (angular.isDefined($scope.dataCheckbox)) {
							$scope.dataCheckbox = dataCheckbox;
						}

						if ((button['class'] === 'ok') &&
							($scope.popupType === 'prompt') &&
							($scope.data === '')) {

							$scope.required = true;

							return;
						}

						button.callback($scope.data, $scope, $scope.dataCheckbox);
						if (button['class'] !== 'update') {
							dismiss();
						}
					}

					/**
					 * Fired when toast is ready to be dismissed
					 * @event
					 */
					function timeoutEvent() {
						dismiss();
					}

					/**
					 * User has moved the mouse over the popup
					 * @event
					 */
					function mouseOver() {
						if ($scope.popupType === 'toast') {
							$timeout.cancel($scope.timeout);
						}
					}

					/**
					 * User has moved the mouse out of the popup
					 * @event
					 */
					function mouseLeave() {
						setToastTimeout();
					}

					/**
					 * Set the timer counting for toast to be removed
					 * @function
					 */
					function setToastTimeout() {
						if ($scope.popupType === 'toast') {
							$scope.timeout = $timeout(timeoutEvent, DefaultSettings.TOAST_TIMEOUT);
						}
					}


					/**
					 * Handle user pressing the keyboard shortcuts
					 * @param  {event} event $event
					 */
					function keyUp(event, data, dataCheckbox) {
						var KEY_ENTER = 13;
						var KEY_ESCAPE = 27;

						switch (event.keyCode) {
						case KEY_ENTER:
							clickButton($scope.buttons[0], data, dataCheckbox);
							break;

						case KEY_ESCAPE:
							clickButton($scope.buttons[1]);
							break;
						}
					}

					function updateTimeoutEvent() {
						if (!$scope.updater){
							return;
						}
						$scope.message = $scope.updater($scope);
						setUpdaterTimeout();
					}

					function setUpdaterTimeout() {
						if ($scope.updater !== undefined) {
							$scope.updater_timeout = $timeout(updateTimeoutEvent, 1000);
						}
					}
					/**
					 * Destroy
					 * @function
					 */
					function destroy() {
						$scope.updater = null;
						$timeout.cancel($scope.timeout);
						$timeout.cancel($scope.updater_timeout);

					}

					/**
					 * Initialise
					 * @function
					 */
					function initialise() {
						$scope.clickButton = clickButton;
						$scope.mouseOver = mouseOver;
						$scope.mouseLeave = mouseLeave;
						$scope.keyUp = keyUp;
						$scope.required = false;

						$scope.$on('$destroy', destroy);

						if ($scope.popupType === 'prompt') {
							$timeout(function() {
								window.$('.popup__input').focus();
							}, 0);
						}

						$timeout(function() {
							$scope.toastTop = ($scope.index * 6 + 10)
						}, 0);

						setToastTimeout();
						setUpdaterTimeout();
					}

					initialise();
				}
			};
		}
	]);
