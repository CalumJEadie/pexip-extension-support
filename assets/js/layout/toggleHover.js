angular.module('pexapp')
    .directive('toggleHover', function ToggleHover($timeout, $window) {
        'use strict';

        /**
         * @description Directive to handle showing the buttonbar when the user wants
         * to do something, then hide it after inactivity.
         */
        return {
            restrict: 'AECM',
            scope: {
                toggleHover: '@toggleHover',
                toggleOverlaid: '@toggleOverlaid',
                wait: '@wait'
            },
            link: function (scope, element, attr) {
                var waitFor = parseInt(scope.wait, 10);

                /**
                 * Show the buttonbar
                 */
                function toggle() {
                    if (!element.hasClass(scope.toggleHover)) {
                        element.addClass(scope.toggleHover);
                    }
                }

                /**
                 * Hide the buttonbar
                 */
                function untoggle() {
                    if (element.hasClass(scope.toggleHover)) {
                        element.removeClass(scope.toggleHover);
                    }
                }

                /**
                 * Start counting after the mouse has stopped working
                 */
                function startTimer() {
                    scope.cancelTimer = $timeout(untoggle, scope.wait);
                }

                /**
                 * Track the mouse moving
                 */
                function mouseMove(evt) {
                    $timeout.cancel(scope.cancelTimer);

                    toggle();
                    startTimer();
                }

                function isOverlaid() {
                    if (!element.hasClass(scope.toggleOverlaid)) {
                        element.addClass(scope.toggleOverlaid);
                    }
                }

                function isNotOverlaid() {
                    if (element.hasClass(scope.toggleOverlaid)) {
                        element.removeClass(scope.toggleOverlaid);
                    }
                }

                function checkForOverlaidVideo() {
                    var screenBar = element[0].querySelector('.screenbar');
                    var screenBarElement = angular.element(screenBar);
                    var screenBarElementBoundingBox = screenBarElement[0].getBoundingClientRect();
                    var screenBarElementTop = screenBarElement.offset().top;
                    var findVideos = element.find('.stage__child,.presentation__child');
                    var hasAnyOverlaidElement = false;

                    angular.forEach(findVideos, function(item) {
                        var boundingClient = item.getBoundingClientRect();
                        var top = angular.element(item).offset().top;
                        var height = angular.element(item).height();

                        if (screenBarElementTop < (top + height)) {
                            hasAnyOverlaidElement = true;
                        } else {
                            isNotOverlaid();
                        }

                        if (hasAnyOverlaidElement === true) {
                            isOverlaid();
                        } else {
                            isNotOverlaid();
                        }
                    });
                }

                element.bind('mousemove', mouseMove);
                element.bind('click', mouseMove);
                element.bind('mouseout', untoggle);

                angular.element($window).bind('resize', function() {
                    checkForOverlaidVideo();
                    scope.$apply();
                });

                toggle();
                startTimer();
                checkForOverlaidVideo();
            }
        };
    });
