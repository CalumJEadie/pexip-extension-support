angular.module('pexapp.dropdown', [])
	.directive('inputDropdown', function inputDropdown($compile, $filter, $templateCache, $timeout, $window) {
		'use strict';

		return {
			restrict: 'A',
			scope: {
				data: '=data',
				model: '=ngModel'
			},
			link: function Link(scope, element, attrs) {

				scope.visible = false;
				scope.selectedItem = '';
				scope.preview = '';
				scope.filteredData = [];

				var previewElement = null;

				function startsWith(fullText, startsWithText) {
					if (fullText === null) {
						return false;
					}

					if (startsWithText === null) {
						return false;
					}

					var testText = fullText.toLowerCase().substr(0, startsWithText.toLowerCase().length);

					if (testText === startsWithText.toLowerCase()) {
						return true;
					} else {
						return false;
					}
				}

				scope.$watch('model', function(newValue, oldValue) {
					//
					// only filter while the selected item is ''
					//
					//
					// If the user clears the text, unselect everything
					//
					if ((newValue === '') && (angular.isDefined(oldValue)) && (oldValue.length > 0)) {
						scope.selectedItem = '';
						scope.preview = '';
						return;
					}

					if (scope.selectedItem === '') {
						if (newValue === '') {
							scope.filteredData = scope.data;
						}

						if (angular.isDefined(newValue) &&
							(newValue !== null) &&
							(newValue.length > 0)) {
							scope.filteredData = scanData();

							if (scope.filteredData.length === 0) {
								scope.visible = false;
							}
						}
					}

					//
					// Blank the preview if we've started typing and it doesn't match
					//
					if (angular.isDefined(scope.model)) {
						if (startsWith(scope.preview, scope.model) === false) {
							scope.preview = '';
						}
					}
				});

				scope.$watch('data', function(newValue, oldValue) {
					scope.filteredData = scope.data;
				});

				function scanData() {
					var result = [];

					angular.forEach(scope.data, function(item) {
						if (item.toLowerCase().indexOf(scope.model) !== -1) {
							result.push(item);
						}
					});

					return result;
				}

				function find(array, value) {
					var item = null;

					for(var i = 0; i < array.length; i++) {
						item = array[i];

						if (item.toLowerCase().indexOf(value.toLowerCase()) === 0) {
							return item;
						}
					}

					return '';
				}

				function selectTop() {
					if (scope.preview === '') {
						scope.preview = find(scanData(), scope.model);
					}
				}

				function openIfNot() {
					if (scope.visible === false) {

						if (scanData().length > 0) {
							scope.visible = true;

							selectTop();
						}
					}
				}

				function blur() {
					$timeout(function() {
						scope.visible = false;
						scope.preview = '';
					}, 100);
				}

				function onKeyDown(evt) {
					var KEY_DOWN = 40;
					var KEY_UP = 38;
					var KEY_ENTER = 13;
					var KEY_TAB = 9;
					var KEY_ESCAPE = 27;

					var filteredData = scope.filteredData;// $filter('filter')(scope.data, scope.model);
					var index;

					//
					// No key pressed
					//
					if (angular.isDefined(evt.keyCode) === false) {
						return;
					}

					//
					// Shift, control, alt should not open the dropdown
					//
					if ((evt.shiftKey || evt.metaKey || evt.ctrlKey || evt.altKey) === true) {
						return;
					}

					if (evt.keyCode === KEY_TAB) {
						return;
					}

					//
					// Escape should close dropdown
					//
					if (evt.keyCode === KEY_ESCAPE) {
						scope.visible = false;
						scope.$apply();
						return;
					}

					//
					// Press enter when dropdown collapsed should submit the form
					//
					if ((evt.keyCode === KEY_ENTER) &&
						(scope.visible === false)) {

						return;
					}

					// press enter when dropdown expanded, but nothing selected should submit the form
					if ((evt.keyCode === KEY_ENTER) &&
						(scope.visible === true) &&
						(scope.selectedItem === '')) {

						return;
					}

					scope.preview = '';

					//
					// Handle typing
					//
					openIfNot();
					selectTop();

					//
					// Move up and down with arrow keys
					//
					if (evt.keyCode === KEY_DOWN) {
						index = filteredData.indexOf(scope.selectedItem);
						index++;
						if (index < filteredData.length) {
							scope.selectedItem = filteredData[index];
							scope.model = scope.preview = scope.selectedItem;
						}
					}

					if (evt.keyCode === KEY_UP) {
						index = filteredData.indexOf(scope.selectedItem);
						index--;
						if (index === -1) {
							scope.selectedItem = scope.model;
						}
						if (index >= 0) {
							scope.selectedItem = filteredData[index];
							scope.model = scope.preview = scope.selectedItem;
						}
					}

					//
					// Pressing enter on a list item should select the
					// item then collapse the menu
					//
					if ((evt.keyCode === KEY_ENTER) &&
						(scope.visible === true)) {

						if (scope.filteredData.length > 0) {

							scope.model = scope.selectedItem;
							scope.visible = false;

							evt.preventDefault();
						}
					}

					scope.$apply();
				}

				function onKeyUp(evt) {
					// ignore deleting the whole word
					if (angular.isDefined(evt.keyCode) &&
						(evt.keyCode === 8) &&
						(scope.model === '')) {
						return;
					}

					selectTop();

					scope.$apply();
				}

				function clickItem(item) {
					scope.model = item;
					scope.visible = false;
					scope.selectedItem = '';
				}

				function onClick() {
					if (scope.visible === false) {
						scope.visible = true;
					}

					cloneCss();

					scope.$apply();
				}

				function getPreviewElement() {
					var previewElement = element.parent().find('.autocomplete__preview');

					return previewElement;
				}

				function cloneCss() {
					$timeout(function() {
						previewElement.css({
							'background': '#eee',
							'padding-left': element.css('padding-left'),
							'margin': element.css('margin'),
							'border': '2px solid transparent',
							'color': '#aaa'
						});
					}, 0);
				}

				function initialisePreview() {
					previewElement.css({
						'position': 'absolute',
						'color': '#aaa'
					});

					cloneCss();

					element.css({
						'background-color': 'transparent',
						'position': 'relative'
					});
				}

				function positionPreview() {
					var bounds = element[0].getBoundingClientRect();

					var top = bounds.top;
					var left = bounds.left;

					var body = document.documentElement || document.body;
					var scrollTop = window.pageYOffset || body.scrollTop;
					var scrollLeft = window.pageXOffset || body.scrollLeft;

					top += scrollTop;
					left += scrollLeft;

					$timeout(function() {
						previewElement.css({
							'position': 'absolute',
							'top': '32',
							'left': '0',
							'color': '#aaa',
							'width': bounds.width + 'px',
							'height': bounds.height + 'px'
						});
					}, 100);
				}

				function resize() {
					positionPreview();

					scope.$apply();
				}

				scope.clickItem = clickItem;

				element.bind('keydown', onKeyDown);
				element.bind('blur', blur);
				element.bind('keyup', onKeyUp);
				element.bind('click', onClick);

				element.wrap(angular.element('<span class="autocomplete"></span>'));

				var template = $templateCache.get('assets/templates/directives/inputDropdown.html');
				var content = $compile(template)(scope);
				element.after(content);

				var cloneHtml = '<input class="autocomplete__preview" type="text" ng-model="preview" spellcheck="false" readonly="" autocomplete="off" tabindex="-1" aria-labelledby="conference-id-field" />';
				var previewCompiled = $compile(cloneHtml)(scope);
				previewElement = angular.element(previewCompiled[0]);

				element.before(previewCompiled);

				initialisePreview();
				positionPreview();

				angular.element($window).bind('resize', resize);
			}
		};
	});
