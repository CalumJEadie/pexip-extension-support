angular.module('pexapp')
	.directive('resizable', function($window) {
		'use strict';

		return function($scope) {
			$scope.initializeWindowSize = function() {
				$scope.windowHeight = $window.innerHeight;
				$scope.windowWidth  = $window.innerWidth;
			};
			angular.element($window).bind('resize', function() {
				$scope.initializeWindowSize();
				$scope.$apply();
			});
			$scope.initializeWindowSize();
		};
	})
	.directive('rosterHeight', function($window, $timeout) {
		'use strict';

		return function($scope, attr, element) {
			$scope.initializeRosterHeight = function() {
				var windowHeight = $window.innerHeight;
				var windowWidth  = $window.innerWidth;

				var rosterTop = element.$$element[0].getBoundingClientRect().top;

				$scope.rosterHeight = windowHeight - rosterTop;
			};
			angular.element($window).bind('resize', function() {
				$scope.initializeRosterHeight();
				$scope.$apply();
			});

			$timeout(function() {
				$scope.initializeRosterHeight();
			}, 0);
		};
	});
