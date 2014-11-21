'use strict';

angular.module('pexapp.diagnostics', [])
	.service('LogService',[
		/**
		 * @module
		 */
		'$log',
		function LogService($log) {
			return {
				/**
				 * @static
				 * @description Log to console if it exists
				 * @param {string} [text] Message to send to log
				 */
				log: function (text) {
					$log.log(text);
				},


				/**
				 * @static
				 * @description Warn to console if it exists
				 * @param {string} [text] Message to send to log
				 */
				warn: function (text) {
					$log.warn(text);
				},

				/**
				 * @static
				 * @description Info to console if it exists
				 * @param {string} [text] Message to send to log
				 */
				info: function (text) {
					$log.info(text);
				},


				/**
				 * @static
				 * @description Error to console if it exists
				 * @param {string} [text] Message to send to log
				 */
				error: function (text) {
					$log.error(text);
				}
			};
		}
	]);
