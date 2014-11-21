angular.module('pexapp')
	.run(function($rootScope, version) {

		// simple info window with version and link to pexip
		$rootScope.versionOverlay = function() {
			alert(
				'Version: ' + version + '\n' +
				'http://pexip.com'
			);
		};

		$rootScope.settings = {
			audioSource: null,
			videoSource: null
		};

	});
