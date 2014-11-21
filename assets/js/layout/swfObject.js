angular.module('pexapp')
    .directive('swfObject', function ToggleHover($timeout, $window) {
        /**
         * @description Directive to handle showing the buttonbar when the user wants
         * to do something, then hide it after inactivity.
         */
        return {
            restrict: 'A',
            scope: {
                replaceId: '@',
                width: '@',
                height: '@',
                src: '@'
            },
            link: function (scope, element, attr) {
                //<!--<video class="centered" width="100%" id="video" autoplay="autoplay" poster="../assets/images/spinner.gif"/>-->

                // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection.
                $timeout(function() {
                    var swfVersionStr = "11.1.0";
                    // To use express install, set to playerProductInstall.swf, otherwise the empty string.
                    var xiSwfUrlStr = "playerProductInstall.swf";
                    //var flashvars = {"pexipRTMPServer" : "127.0.0.1"};
                    var flashvars = {};
                    var params = {};
                    params.quality = "high";
                    params.bgcolor = "#262626";
                    //params.allowscriptaccess = "sameDomain";
                    params.allowscriptaccess = "always";
                    params.allowfullscreen = "true";
                    params.wmode = "transparent";
                    var attributes = {};
                    attributes.id = "flashvideo";
                    attributes.name = "PexVideo";
                    attributes.align = "middle";
                    swfobject.embedSWF(
                        scope.src, scope.replaceId, scope.width, scope.height,
                        swfVersionStr, xiSwfUrlStr,
                        flashvars, params, attributes);
                    // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
                    swfobject.createCSS("#flashContent", "display:block;text-align:left;");
                }, 10);
            }
        }
    });
 var swfobject;
