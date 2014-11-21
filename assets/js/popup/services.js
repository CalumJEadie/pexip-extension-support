'use strict';

angular.module('pexapp.popup')
	.service('PopupService', [
		'$injector', // Add injector as dependency so we can resolve extensions when needed
		'$timeout',
		'$rootScope',
		'LogService',
		function ($injector, $timeout, $rootScope, LogService) {
			return {
				/**
				 * Create an alert box.
				 *
				 * @param {Array} popups  The list of popups to add to
				 * @param {String} message The message to display
				 * @param {function} doneCallback Callback when done
				 */
				alert: function alert(popups, message, doneCallback) {
                    var prune = popups.reduce(function(a, b) { return (a || b.message == message); }, false);
                    if (prune)
                        return;
					var newPopup = {
						popupType: 'alert',
						message: message,
						buttons: [
							{
								'label': 'OK',
								'callback': function() {
									LogService.log('Popup.alert: clicked OK');

									if (angular.isDefined(doneCallback)) {
										LogService.log('Popup.alert: executing callback');

										doneCallback();
									}
								},
								'class': 'ok'
							}
						],
						timestamp: new Date().getTime()
					};

					popups.push(newPopup);

					LogService.log('Popup.alert: ' + message);
				},

				/**
				 * Create a toast popup.
				 *
				 * @param {Array} popups  The list of popups to add to
				 * @param {String} message The message to display
				 * @param {function} doneCallback Callback when done
				 */
				toast: function alert(popups, message, doneCallback) {
					var values = []
					for (var key in popups){
						values.push(popups[key]);
					}
                    var prune = values.reduce(function(a, b) { return (a || b.message == message); }, false);
                    if (prune)
                        return;

					var newIndex = 0;
					var changed = false;

					function checkForChanged() {
						changed = false;

						angular.forEach(popups, function(item) {
							if (item.index == newIndex) {
								newIndex++;
								changed = true;
							}
						});

						return changed;
					}

					do {
					} while(checkForChanged());

					var newPopup = {
						popupType: 'toast',
						message: message,
						buttons: [],
						timestamp: new Date().getTime(),
						index: newIndex
					};

					popups[newPopup.timestamp] = newPopup;

					LogService.log('Popup.toast: ' + message);

					return newPopup;
				},

				/**
				 * Create a confirm box.
				 *
				 * @param {Array} popups  The list of popups to add to
				 * @param {String} message The message to display
				 * @param {function} callback Callback when YES clicked. No cancels
				 */
				confirm: function confirm(popups, message, callback, options) {
                    var prune = popups.reduce(function(a, b) { return (a || b.message == message); }, false);
                    if (prune)
                        return;
					var newPopup = {
						popupType: 'confirm',
						message: message,
						buttons: [
							{
								'label': 'OK',
								'callback': function(data, scope, dataCheckbox) {
									LogService.log('Popup.confirm: clicked OK');

									callback(data, scope, dataCheckbox);
								},
								'class': 'ok'
							},
							{
								'label': 'Cancel',
								'class': 'cancel',
								'callback': function () {
									// do nothing, this is the cancel button
									LogService.log('Popup.confirm: clicked cancel');
								}
							}
						],
						timestamp: new Date().getTime(),
						options: options
					};

					popups.push(newPopup);

					LogService.log('Popup.confirm: ' + message);
				},

				/**
				 * Create a prompt box.
				 *
				 * @param {Array} popups  The list of popups to add to
				 * @param {String} message The message to display
				 * @param {function(data)} callback Callback passing in data when YES clicked. No cancels
				 *
				 * @param {String} hook Optional. Name of hook.
				 */
				prompt: function confirm(popups, message, callback, options, hook) {
					var newPopup;
					
					// Check if hook is available and extension is loaded for hook
					if (hook && $injector.has(hook)) {
						var extension = $injector.get(hook);
						newPopup = {
							popupType: 'prompt',
							extension: function(htmlElement, popupCb) { // Wrap extension in function for popup
								extension.init(htmlElement, options, function(data, dataCheckbox) {
									popupCb(); // Signal to popup that we're done
									callback(data, dataCheckbox); // Pass result on to popup requestor
								})
							}
						}
					}
					else
					{
						newPopup = {
							popupType: 'prompt',
							message: message,
							buttons: [
								{
									'label': 'OK',
									'callback': function(data, dataCheckbox) {
										LogService.log('Popup.prompt: clicked OK');
										LogService.log('Popup.prompt: ' + data);

										callback(data, dataCheckbox);
									},
									'class': 'ok'
								},
								{
									'label': 'Cancel',
									'class': 'cancel',
									'callback': function () {
										// do nothing, this is the cancel button
										LogService.log('Popup.prompt: clicked cancel');
									}
								}
							],
							data: '',
							timestamp: new Date().getTime(),
							options: options
						};
					}

					popups.push(newPopup);

					LogService.log('Popup.prompt: ' + message);
				},

				mediaStatistics: function mediaStatistics(popups, func, doneCallback) {
					var newPopup = {
						popupType: 'mediaStatistics',
						message: func(),
						buttons: [
							{
								'label': 'OK',
								'callback': function() {
									LogService.log('Popup.alert: clicked OK');

									if (angular.isDefined(doneCallback)) {
										LogService.log('Popup.alert: executing callback');

										doneCallback();
									}
								},
								'class': 'ok'
							}
						],
						updater: func,
						timestamp: new Date().getTime()
					};

					popups.push(newPopup);
				}
			};
		}
	]);
