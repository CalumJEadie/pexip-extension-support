/* global $:false */

angular.module('pexapp.diagnostics.network', [])
    .factory('BandwidthEstimator', [
        /**
         * @module
         */
        '$timeout',
        '$rootScope',
        '$q',
        function BandwidthEstimator($timeout, $rootScope, $q) {
            'use strict';

            var remotePath = 'assets/estimates/estimate';
            var remoteExtension = '.png';
            var maximumIndex = 15;

            var module = {
                pageLoadTime: function (text) {
                    var deferred = $q.defer();

                    module.testUsingImages()
                        .then(function(data) {
                            var result = module.bytesPerSecond(data.totalBytesDownloaded, data.totalTimeTaken);

                            deferred.resolve(result);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },

                /**
                 * @description Return number of bytes per second
                 *
                 * @param  {int} size        Total bytes transferred
                 * @param  {float} loadTime  Time taken in milliseconds
                 *
                 * @return {object} containing:
                 *
                 * numberOfBytesPerSecond
                 * numberOfKBytesPerSecond
                 * numberOfkbitsPerSecond
                 *
                 */
                bytesPerSecond: function(size, loadTime) {
                    var results = {
                        size: size,
                        loadTimeSecs: loadTime / 1000
                    };

                    results.numberOfBytesPerSecond = results.size / results.loadTimeSecs;
                    results.numberOfKBytesPerSecond = results.numberOfBytesPerSecond / 1024;
                    results.numberOfkbitsPerSecond = results.numberOfKBytesPerSecond * 8;

                    return results;
                },

                /**
                 * @description Return a metrics object to maintain state
                 */
                Metrics: function() {
                    return {
                        totalBytesDownloaded: 0,
                        totalTimeTaken: 0,
                        timing: {},
                        loadTimes: []
                    };
                },

                returnFastestMetric: function(metrics) {
                    var result = {
                        numberOfBytesPerSecond: null
                    };

                    for (var i = metrics.length - 1; i >= 0; i--) {
                        if ((result.numberOfBytesPerSecond === null) ||
                            (metrics[i].singleMetric.numberOfBytesPerSecond > result.numberOfBytesPerSecond)) {
                            result = metrics[i].singleMetric;
                        }
                    }

                    return result;
                },

                /**
                 * @description Run tests using images.
                 *
                 * Will start to download images from
                 * @return {[type]} [description]
                 */
                testUsingImages: function() {
                    var deferred = $q.defer();
                    var metrics = new module.Metrics();
                    var useFastest = false;

                    function success(data) {
                        data.singleMetric = module.bytesPerSecond(data.size, data.time);

                        metrics.loadTimes.push(data);
                        metrics.totalBytesDownloaded += data.size;
                        metrics.totalTimeTaken += data.time;

                        // calculate an average and broadcast it
                        var results = module.bytesPerSecond(metrics.totalBytesDownloaded, metrics.totalTimeTaken);
                        var fastestResults = module.returnFastestMetric(metrics.loadTimes);

                        if (useFastest === true) {
                            $rootScope.$emit('bandwidth:estimated', fastestResults);
                        } else {
                            $rootScope.$emit('bandwidth:estimated', results);
                        }

                        getTiming();
                    }

                    function fail() {
                        deferred.resolve(metrics);
                    }

                    function getTiming() {
                        // don't 404 if we run out of images
                        if (metrics.loadTimes.length >= maximumIndex) {
                            fail();
                        } else {
                            var fileName = module.createRemoteFileName(metrics.loadTimes.length);

                            module.getImage(fileName)
                                .then(success, fail);
                        }
                    }

                    $timeout(getTiming, 0);

                    return deferred.promise;
                },

                /**
                 * @description Return the path of a file on the server, based on a
                 * known remote path, plus incrementing index and extension.
                 *
                 * @return {string} File path without domain
                 */
                createRemoteFileName: function(index) {
                    var fileName = [
                        remotePath,
                        index,
                        remoteExtension,
                        '?q=',
                        new Date().getTime()
                    ].join('');

                    return fileName;
                },

                /**
                 * Get an image, then in another request, get the content-length the server thinks it sent.
                 *
                 * This may be compressed, so let's use different files.
                 */
                getImage: function(src) {
                    var deferred = $q.defer();
                    var startDateTime = new Date().getTime();
                    var endDateTime;
                    var image = new Image();

                    image.onload = function() {
                        endDateTime = new Date().getTime();

                        module.getFileSize(src)
                            .then(function(contentLength) {
                                deferred.resolve({
                                    time: parseFloat(endDateTime - startDateTime),
                                    size: contentLength
                                });
                            });
                    };

                    image.onerror = function() {
                        deferred.reject();
                    };

                    image.src = src;

                    return deferred.promise;
                },

                /**
                 * @description Request content-length of a path
                 *
                 * @param  {string} src Remote file to get
                 *
                 * @return {int}    file size as reported by server
                 */
                getFileSize: function(src) {
                    var deferred = $q.defer();

                    var xhr = $.ajax({
                        type: 'HEAD',
                        url: src,
                        success: function(data) {
                            deferred.resolve(parseInt(xhr.getResponseHeader('Content-Length'), 10));
                        },
                        error: function(error) {
                            deferred.reject(error);
                        }
                    });

                    return deferred.promise;
                },

                /**
                 * @description POST data back to an endpoint which will tell us when we've finished
                 * @param  {[type]} data [description]
                 * @return {[type]}      [description]
                 */
                uploadData: function(data) {
                    var deferred = $q.defer();
                    var startDateTime = new Date().getTime();
                    var endDateTime;

                    $.ajax({
                        url: '/uploadData',
                        type: 'POST',
                        data: data,
                        cache: false,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function(data, textStatus, jqXHR)
                        {
                            if(typeof data.error === 'undefined')
                            {
                                //submitForm(event, data);
                            }
                            else
                            {
                                console.log('ERRORS: ' + data.error);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown)
                        {
                            deferred.reject({
                                textStatus: textStatus,
                                errorThrown: errorThrown
                            });
                        }
                    });

                    return deferred.promise;
                }
            };

            return module;
        }
    ]);
