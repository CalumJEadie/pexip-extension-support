'use strict';

var pexapp = angular.module('pexapp');

/**
 * Internationalisation
 *
 * @requires window.PEXIP_TRANSLATIONS
 * @requires window.PEXIP_PREFERRED_LANGUAGE
 */
pexapp.config([
	'$translateProvider',
	'defaultTranslationValues',
	function($translateProvider, defaultTranslationValues) {
		/**
		 * Add user defined labels, if they exist
		 */
		function addUserDefinedLabels() {
			if (angular.isDefined(window.PEXIP_TRANSLATIONS) === true) {
				angular.forEach(window.PEXIP_TRANSLATIONS, function(item, key) {
					$translateProvider.translations(key, item);
				});
			}
		}


		/**
		 * Add the Pexip provided defaults into the translation provider
		 */
		function addDefaultLabels() {
			$translateProvider.translations('default', defaultTranslationValues);
		}


		/**
		 * Add each key of the translation dictionary to a new translation pack
		 */
		function addDebugLabels() {
			var generatedLabels = {};
			angular.forEach(defaultTranslationValues, function(key, item) {
				generatedLabels[item] = item;
			});

			$translateProvider.translations('debug', generatedLabels);
		}


		/**
		 * Now tell the internationalisation which language to use
		 *
		 * default and debug are Pexip-controlled.
		 *
		 * Debug will be the actual label key and should not ever be shown to a user.
		 */
		function setPreferredLanguage() {
			$translateProvider.preferredLanguage(window.PEXIP_TRANSLATIONS_PREFERRED_LANGUAGE);
		}


		/**
		 * Create a language fallback stack.
		 *
		 * This stack defines the order languages should be looked up. In order of most important:
		 *
		 * - User defined (optional)
		 * - Pexip defined 'default'
		 * - Pexip defined 'debug'
		 *
		 * The debug language is automatically generated and will display the labels as the underlying keys, to aid translation.
		 */
		function setLanguageFallbackStack() {
			var fallbackLanguageStack = [];
			if (angular.isDefined(window.PEXIP_TRANSLATIONS_FALLBACK_LANGUAGE)) {
				fallbackLanguageStack.push(window.PEXIP_TRANSLATIONS_FALLBACK_LANGUAGE);
			}

			fallbackLanguageStack.push('default');
			fallbackLanguageStack.push('debug');

			$translateProvider.fallbackLanguage(fallbackLanguageStack);
		}


		addUserDefinedLabels();
		addDefaultLabels();
		addDebugLabels();
		setPreferredLanguage();
		setLanguageFallbackStack();


		if (window.top.languageUrl) {
			$translateProvider.useStaticFilesLoader({
				prefix: window.top.languageUrl,
				suffix: '.json'
			});
			$translateProvider.preferredLanguage(window.top.clientLanguage);
		}
	}
]);
