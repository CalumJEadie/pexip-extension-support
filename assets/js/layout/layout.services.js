angular.module('pexapp.layout', [])
	.factory('ScreenSizeWatchers', [
		function() {
			'use strict';

			var _windowWidthWatcher;

			return {
				attachWindowWatchers: function($scope) {
					/**
					* If the browser gets bigger, put the roster back and re-enable it
					*/
					_windowWidthWatcher = $scope.$watch('windowWidth', function() {
						if (angular.isDefined($scope.windowWidth)) {
							if ($scope.windowWidth !== null) {
								if ($scope.windowWidth >= 800) {
									$scope.selfview.collapse = false;
								}
							}
						}
					});
				},

				/**
				 * When the scope gets destroyed, remove any watchers
				 */
				detatchWindowWatchers: function($scope) {
					$scope.$on('$destroy', function() {
						_windowWidthWatcher();
					});
				}
			};
		}
	]);
