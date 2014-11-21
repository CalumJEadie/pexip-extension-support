angular.module('pexapp.presentation', [])

.factory('PresentationImage', function($q, $rootScope) {
	'use strict';

	return {
		/**
		 * Load the presentation image, then emit an event
		 * when we have completed
		 *
		 * @param  {string} url URL of the image
		 *
		 * @return {promise} $q.defer().promise which resolves when the image is downloaded
		 */
		loadImage: function($scope, url) {
			var deferred = $q.defer();
			var image = new Image();

			image.onload = function() {
				deferred.resolve(url);

				$scope.$apply();
			};

			image.onerror = function() {
				deferred.reject();

				$scope.$apply();
			};

			try {
				image.src = url;
			} catch (e) {
				deferred.reject();
			}

			return deferred.promise;
		}
	};
})

.factory('ConferencePresentation', function(PresentationImage) {
	'use strict';

	return {
		/**
		 * Watch for new image to be available
		 * @param  {ngScope} $scope
		 */
		attachOnPresentationReload: function($scope) {
			function success(image) {
				$scope.presentation.imageSrc = image;
			}

			function fail(error) {
				// handle error here?
			}

			$scope.$on('rtc:onPresentationReload', function(event, data) {
				PresentationImage
					.loadImage($scope, data)
					.then(success, fail);
			});
		},

		attachPresentationActive: function($scope, presentation) {
			$scope.$watch('presentation.active', function(newValue, oldValue) {
				if (newValue === false) {
					$scope.presentation.maximised = false;
				}
				if (newValue === true) {
					$scope.presentation.maximised = true;
				}
			});
		}
	};
});
