'use strict';

/**
 * Get an instant translation, without using a promise
 */
angular.module('pexapp.translations', [
	'pascalprecht.translate'
])
	.factory('translationService', [
		'$translate',
		function($translate) {
			return {
				/**
				 * Return a translation of a key
				 * @param  {string} key The key listed in i18n/default-labels.js
				 * @return {string}     The value resolved for the users current language
				 */
				instant: function(key) {
					return $translate.instant(key);
				}
			};
		}
	])

	.factory('translationControls', [
		'$translate',
		function($translate) {
			return {
				/**
				 * Switch the users current language
				 * @param  {string} language The language code defined in default-labels.js or application_settings/translations.js
				 */
				useLanguage: function(language) {
					$translate.use(language);
				}
			};
		}
	]);
