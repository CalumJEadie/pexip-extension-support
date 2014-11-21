/**
 * @module conference
 */
var conference = angular.module('conference', [
        'pexapp',
        'pexapp.popup',
        'pexapp.about',
        'pexapp.layout',
        'pexapp.diagnostics',
        'pexapp.presentation',
        'pexapp.dtmf'
]);


conference.controller('ConferenceController',
    function(
        $rootScope,
        $scope,
        $http,
        $timeout,
        $state,
        has_webrtc,
        hasChromeWebstore,
        conference,
        user,
        PopupService,
        version,
        translationControls,
        translationService,
        PexappBuild,
        ScreenSizeWatchers,
        LogService,
        PresentationImage,
        ConferencePresentation,
        DtmfMessages,
        ConferenceState) {

    var USE_REST_API = false;
    if (angular.isDefined(window.NETWORK_SETTINGS.USE_REST_API) && (window.NETWORK_SETTINGS.USE_REST_API === true)) {
        USE_REST_API = true;
    }

    // check for roster only
    var rosterOnly = localStorage.getItem('roster');
    if (angular.isDefined(rosterOnly) && (rosterOnly === 'true') && ($state.$current.name === 'conference')) {
        $state.go('conference-roster');
        return;
    }

    $scope.hasChromeWebstore = hasChromeWebstore;
    $scope.rosterOnly = (angular.isDefined(rosterOnly) && (rosterOnly === 'true'));

    ConferencePresentation.attachOnPresentationReload($scope);
    ConferencePresentation.attachPresentationActive($scope, $scope.presentation);

    $scope.conference = conference;
    $scope.user       = user;

    $scope.dialogList = [];
    $scope.popupList = {};

    $scope.windowHeight = null;
    $scope.windowWidth = null;

    $scope.participants = [];

    $scope.audioOnlyResolved = false;

    if ($scope.user.audioValue() === true) {
        $scope.audioOnlyResolved = true;
    }

    ScreenSizeWatchers.attachWindowWatchers($scope);
    ScreenSizeWatchers.detatchWindowWatchers($scope);

    DtmfMessages.receive($scope, function(data) {
        $scope.rtc.sendDTMF(data);
    });

    DtmfMessages.closeReceive($scope, function(data) {
        $scope.controls.dtmfVisible = false;
    });


    function dispose() {
        window.removeEventListener('keypress', $scope.keypress);

        ConferenceState.create();

        if (angular.isDefined($scope.rtc)) {
            $scope.rtc.disconnect();
        }
    }

    $scope.$on('$destroy', dispose);

    /**
     * Remove a popup from the popup array
     * @function
     */
    function removePopup(index, timestamp) {
        angular.forEach($scope.dialogList,
            function (item) {
                if (item.timestamp == timestamp) {
                this.splice(this.indexOf(item), 1);
            }
        }, $scope.dialogList);
        if (angular.isDefined($scope.popupList[timestamp])) {
            delete $scope.popupList[timestamp];
        }
    }

    /**
     * Event handler for a child popup requesting removal
     * @event
     */
    function popupAlertClose(event, data) {
        var index = parseInt(data.index, 10);
        removePopup(index, data.timestamp);
    }

    $scope.$on('popupAlert:close', popupAlertClose);


    $scope.controls = {
        disconnect: function(url) {
            $scope.$emit('dtmf:close');

            function checkToConfirmDisconnect() {
                PopupService.confirm(
                    $scope.dialogList,
                    translationService.instant('CONFERENCE_MESSAGE_LEAVE'),
                    function (data, scope, dataCheckbox) {
                        if (angular.isDefined(dataCheckbox) && dataCheckbox === 'save') {
                            localStorage.setItem('dontAskToDisconnect', 'true');
                        }
                        window.location.href = url;
                    }, {
                        rememberSetting: true
                    });
            }

            var dontAskToDisconnect = localStorage.getItem('dontAskToDisconnect');
            if (angular.isDefined(dontAskToDisconnect) && (dontAskToDisconnect === 'true')) {
                window.location.href = url;
            } else {
                checkToConfirmDisconnect();
            }
        },

        presentationEscalate: function() {
            if ($scope.presentation.showImage === true) {
                PopupService.confirm(
                        $scope.dialogList,
                        translationService.instant('VIEW_HD_PRESENTATION'),
                        function () {
                            $scope.presentation.elevateToVideo();
                        });
            } else {
                alert(translationService.instant('ALREADY_VIEWING_HD_PRESENTATION'));
            }
        },

        versionOverlay: function() {
            if ($scope.presentation.active && $scope.presentation.enableVideoPresentation && $scope.presentation.showImage) {
                PopupService.confirm(
                    $scope.dialogList,
                    translationService.instant('VIEW_HD_PRESENTATION'),
                    function () {
                        $scope.presentation.elevateToVideo();
                    });
            } else {
                var message = 'Version: ' + version + ' \n' +
                    'Built: ' + PexappBuild.Generated + '\n' +
                    'http://pexip.com';
                PopupService.alert($scope.dialogList, message);
            }
        },

        showSideBarClick: function() {
            $scope.selfview.collapse = !$scope.selfview.collapse;
        },

        language: {
            debug: function() {
                translationControls.useLanguage('debug');
            },
            en: function() {
                translationControls.useLanguage('en');
            }
        },

        lockConference: function() {
            $scope.rtc.setConferenceLock(true);
        },

        unlockConference: function() {
            $scope.rtc.setConferenceLock(false);
        },

        muteParticipant: function(uuid) {
            $scope.rtc.setParticipantMute(uuid, true);
        },

        unmuteParticipant: function(uuid) {
            $scope.rtc.setParticipantMute(uuid, false);
        },

        setParticipantCanReceivePresentation: function(uuid) {
            $scope.rtc.setParticipantRxPresentation(uuid, true);
        },

        setParticipantCannotReceivePresentation: function(uuid) {
            $scope.rtc.setParticipantRxPresentation(uuid, false);
        },

        unlockParticipant: function(uuid) {
            $scope.rtc.unlockParticipant(uuid);
        }
    };

    function alert(text, callback) {
        $timeout(function() {
            var newToast = PopupService.toast($scope.popupList, text, function () {
                if (angular.isDefined(callback)) {
                    callback();
                }
            });
        }, 0);
    }

    function notify(text, callback) {
        $timeout(function() {
            PopupService.alert($scope.dialogList, text, function () {
                if (angular.isDefined(callback)) {
                    callback();
                }
            });
        }, 0);
    }

    // make sure the user role is valid
    user.getRole($scope.user.pin, function(role) {
        LogService.log('fetched role: ' + role);
        // invalid credentials -> let's log them out.
        if(role != 'HOST' && role != 'GUEST') {
            if (typeof(conference.isGateway) != 'function' && conference.isGateway) {
                $scope.call();
            }
            else {
                conference.isGateway(function(response) {
                    if(response) {
                        $scope.conference.isGateway = true;
                        $scope.call();
                    } else {
                        window.location.href = './';
                    }
                });
            }
        } else {
            // store the user role
            $scope.user.role = role;
            $scope.conference.isGateway = false;
            $scope.call();
        }
    });


    // global credentials for all api calls
    var REST_CREDENTIALS = {
        headers: {
            'pin': $scope.user.pin
        }
    };

    /**
     * Menu handler
     */
    $scope.menu = {
        active : false,
        isOpen: function(menu) {
            return menu == $scope.menu.active;
        },
        open: function(menu, $event) {
            $scope.menu.active = menu;
            $event.stopPropagation();
        },
        close: function() {
            $scope.menu.active = false;
        },
        toggle: function(menu, $event) {
            if ($scope.menu.isOpen(menu)) {
                $scope.menu.close();
            } else {
                $scope.menu.open(menu, $event);
            }
        },
        showLanguage: false
    };

    /**
     * Participant object
     */
    $scope.participant = {
        uri : function(id, task) {
            return window.REST_URI + $scope.conference.id + '/' + id + '/' + task;
        },
        add : function() {

            function addParticipant(userText, externalScope) {
                console.log(userText);

                if(userText === null) {
                    return;
                }

                var protocol = externalScope.dataCheckbox;
               // var protocol = null;
                var destination = userText;
                var ind = userText.indexOf(':');
                if (ind > 0) {
                    protocol = userText.substr(0, ind);
                }

                if (protocol != null) {
                    if (protocol == 'lync' || protocol == 'mssip' || protocol == 'skype') {
                        protocol = 'mssip';
                        destination = 'sip:' + userText.substr(ind+1);
                    } else if (protocol == 'h323') {
                        destination = userText.substr(ind+1);
                    }
                // else protocol and destination left alone
                } else {
                    protocol = 'sip';
                    destination = 'sip:' + destination;
                }

                var role = 'guest';

                if (USE_REST_API) {
                    $scope.rtc.dialOut(destination, protocol, role);
                } else {
                    var apiURI = window.REST_URI + $scope.conference.id + '/dial?destination=' + destination + '&protocol=' + protocol;

                    $http.post(apiURI, null, REST_CREDENTIALS)
                        .success(function(data, status, headers, config) {
                            alert('calling. destination: ' + destination + '. protocol: ' + protocol);
                        })
                        .error(function(data, status, headers, config) {
                            alert('Call failed');
                        });
                }
            }

            PopupService.prompt(
                $scope.dialogList,
                translationService.instant('CONFERENCE_ADD_PARTICIPANT_DIALOG'),
                addParticipant, {
                    protocol: true
                }
            );
        },
        disconnect : function(participant) {
            function disconnectParticipant() {
                LogService.log('disconnect participant with uuid: ' + participant.uuid);

                if (USE_REST_API) {
                    $scope.rtc.disconnectParticipant(participant.uuid);
                } else {
                    $http.post($scope.participant.uri(participant.uuid, 'disconnect'), null, REST_CREDENTIALS);
                }
            }

            PopupService.confirm(
                $scope.dialogList,
                translationService
                    .instant('CONFERENCE_DISCONNECT_PARTICIPANT_DIALOG')
                    .replace(/\{display_name\}/gm, participant.display_name),
                disconnectParticipant
            );
        },
        mute: function(participant) {
            LogService.log('mute/unmute participant with uuid: ' + participant.uuid);
            // toggle the particpants mute status immediatedly
            participant.is_muted = !participant.is_muted;

            if (USE_REST_API) {
                $scope.rtc.setParticipantMute(participant.uuid, participant.is_muted);
            } else {
                $http.post($scope.participant.uri(participant.uuid, 'mute'), null, REST_CREDENTIALS);
            }
        }
    };

    /**
     * The main video
     */
    $scope.video = {
        active:  true,
        element: $('#video'),
        start: function(src) {

            // on screensharing
            if($scope.user.screenValue()) {
                $scope.video.element.attr('poster', '../assets/images/presentation.png');
            } else {
                $scope.video.element.attr('poster', '');
                $scope.video.element.attr('src', src);
            }

        },
        toggle: function() {
            if($scope.rtc.muteVideo()) {
                $scope.video.active = false;
            } else {
                $scope.video.active = true;
            }
        }
    };

    /**
     * The selfview
     */
    $scope.selfview = {
        active:  true,
        element: $('#selfview'),
        collapse: false,
        start: function(src) {
            $scope.selfview.element.attr('poster', '');
            $scope.selfview.element.attr('src', src);
        },
        show: function() {
            $scope.selfview.active = true;
        },
        hide: function() {
            $scope.selfview.active = false;
        },
        toggle: function() {
            $scope.selfview.active = !$scope.selfview.active;
        }
    };

    /**
     * Audio
     */
    $scope.audio = {
        active: true,
        toggle: function() {
            if($scope.rtc.muteAudio()) {
                $scope.audio.active = false;
            } else {
                $scope.audio.active = true;
            }
        }
    };

    /**
     * Fullscreen modus
     */
    $scope.fullscreen = {
        active: false,
        enable: function() {
            $scope.fullscreen.previousSelfviewCollapse = $scope.selfview.collapse;

            if ($scope.selfview.collapse === false) {
                $scope.controls.showSideBarClick();
            }

            $(document).fullScreen(true);

            $scope.fullscreen.active = true;
        },
        disable: function() {
            if (($scope.selfview.collapse === true) && ($scope.fullscreen.previousSelfviewCollapse === false)) {
                $scope.controls.showSideBarClick();
            }

            $(document).fullScreen(false);
            $scope.fullscreen.active = false;
        },
        toggle: function() {
            if($scope.fullscreen.active) {
                $scope.fullscreen.disable();
            } else {
                $scope.fullscreen.enable();
            }
        },
        setup : function() {

            $(document).bind('fullscreenchange', function(e) {
                $scope.$apply(function() {
                    $scope.fullscreen.active = $(document).fullScreen();
                });
            });

            $(document).bind('fullscreenerror', function(e) {
                alert(translationService.instant('CONFERENCE_FULLSCREEN_FAILED'));
            });

        }
    };

    $scope.fullscreen.setup();

    /**
     * Screen presentation
     */
    $scope.presentation = {
        active    : false,
        maximised : false,
        available : false,
        element   : $('#presentation'),
        poster    : $('#presentation').attr('poster'),
        video     : null,
        imageSrc  : '',
        showImage : true,
        blocked   : false,
        closedEvent: false, // has the presentation been closed
        enableVideoPresentation: parseInt($scope.user.bandwidth, 10) >= (window.NETWORK_SETTINGS.ENABLE_VIDEO_PRESENTATION_AT_BANDWIDTH),
        /**
         * Switch the view
         * @param  {[type]} viewType [description]
         * @return {[type]}          [description]
         */
        toggleView: function(viewType) {
            if ($scope.presentation.active === false) {
                return false;
            }

            if (angular.isDefined(viewType)) {
                if (viewType === 'video') {
                    $scope.presentation.maximised = false;
                } else {
                    $scope.presentation.maximised = true;
                }
            } else {
                $scope.presentation.maximised = !$scope.presentation.maximised;
            }
        },
        start: function(video) {
            $scope.presentation.element.attr('poster', '');
            $scope.presentation.element.attr('src', video);
            $scope.presentation.active = true;
        },
        stop: function() {
            $scope.presentation.available = false;
            $scope.presentation.element.attr('poster', $scope.presentation.poster);
            $scope.presentation.element.attr('src', '');
            $scope.presentation.active = false;
        },
        open: function() {
            if(!$scope.presentation.available) {
                //alert(translationService.instant('CONFERENCE_NO_PRESENTATION_AVAILABLE'));
                return false;
            }

            $scope.presentation.imageSrc = 'assets/images/spinner.gif';
            $scope.presentation.active = true;
            $scope.presentation.showImage = true;

            // now refresh the image
            var refreshImage = $scope.rtc.getPresentationURL();
            $scope.$emit('rtc:onPresentationReload', refreshImage);
        },
        elevateToVideo: function() {
            $scope.presentation.element.attr('poster', '');
            $scope.presentation.element.attr('src', video);
            $scope.rtc.getPresentation();
            $scope.presentation.showImage = false;
            $scope.presentation.closedEvent = false;
        },
        close : function() {
            $scope.rtc.stopPresentation();
            $scope.presentation.active = false;
        }
    };

    $scope.isChrome = function() {
        return (navigator.userAgent.indexOf('Chrome') !== -1) || (navigator.userAgent.indexOf('Node Webkit') !== -1);
    };

    /**
     * Screenshare modus
     */
    $scope.screenshare = {
        active : false,
        connected : false,
        disabled: !$scope.isChrome(),
        className : function() {
            if($scope.screenshare.disabled) {
                return 'disabled';
            }
            if(!$scope.screenshare.active) {
                return 'inactive';
            }
        },
        start: function() {

            if($scope.screenshare.active) {
                return true;
            }

            if($scope.screenshare.disabled) {
                if(!$scope.isChrome()) {
                    return alert(translationService.instant('CONFERENCE_SCREENSHARING_ONLY_AVAILABLE_GOOGLE_CHROME'));
                } else {
                    return alert(translationService.instant('CONFERENCE_SCREENSHARING_CURRENTLY_DISABLED'));
                }
            }

            LogService.log('rtc.present("screen")');
            $scope.rtc.present('screen');
            $scope.screenshare.active = true;

        },
        stop: function() {
            if(!$scope.screenshare.active) return true;
            $scope.rtc.present(null);
        },
        toggle: function() {
            if($scope.screenshare.active) {
                $scope.screenshare.stop();
            } else {
                $scope.screenshare.start();
            }
        }
    };

    /**
     * Roster List
     */
    $scope.rosterList = {
        fetch : function(show_roles) {

            // don't update the roster list on gateway calls
            if($scope.conference.isGateway) {
                return false;
            }

            if (USE_REST_API === true) {

            } else {
                $http.get(REST_URI + $scope.conference.id + '/roster_list', REST_CREDENTIALS)
                    .success(function(data, status, headers, config) {
                        LogService.log(data.result);
                        $scope.rosterList.digest(data.result, show_roles);
                    });
            }
        },

        digest : function(roster, show_roles) {

            $scope.participants = [];

            for(var worker in roster) {
                var subroster = roster[worker];
                for(var i = 0; i < subroster.length; i++) {

                    LogService.log(subroster[i]);

                    participant = subroster[i];

                    $scope.rosterList.addParticipant(participant, show_roles);
                }
            }
        },

        findParticipantIndex: function(uuid) {
            for(var i=0; i < $scope.participants.length; i++) {
                if ($scope.participants[i].uuid === uuid) {
                    return i;
                }
            }

            return -1;
        },

        formatParticipantData: function(participant, show_roles) {
            if (angular.isDefined(participant)) {
                if(participant.display_name === '') {
                    participant.name = participant.uri.replace('sip:', '');
                } else {
                    participant.name = participant.display_name;
                }

                if(participant.role !== 'unknown' && show_roles) {
                    participant.role = (participant.role === 'guest') ? 'Guest' : 'Host';
                } else {
                    participant.role = null;
                }

                participant.is_muted      = participant.is_muted      === 'YES' ? true : false;
                participant.is_presenting = participant.is_presenting === 'YES' ? true : false;
                participant.video_call    = participant.video_call    === 'YES' ? true : false;
            }

            return participant;
        },

        addParticipant: function(participant, show_roles) {
            if (angular.isDefined(participant)) {
                participant = $scope.rosterList.formatParticipantData(participant, show_roles);

                if(participant.service_type !== 'waiting_room') {

                    // check it is not already in the list
                    var index = $scope.rosterList.findParticipantIndex(participant.uuid);

                    if (index === -1) {
                        $scope.participants.push(participant);
                    } else {
                        // update it maybe?
                    }
                }
            }
        },

        updateParticipant: function(participant, show_roles) {
            participant = $scope.rosterList.formatParticipantData(participant, show_roles);

            if(participant.service_type !== 'waiting_room') {

                // check it is not already in the list
                var index = $scope.rosterList.findParticipantIndex(participant.uuid);

                if (index === -1) {
                    $scope.participants.push(participant);
                } else {
                    $scope.participants[index] = participant;
                }
            }
        },

        deleteParticipant: function(uuid) {
            var index = $scope.rosterList.findParticipantIndex(uuid);

            if (index !== -1) {
                $scope.participants.splice(index, 1);
            }
        }
    };

    $scope.call = function() {

        LogService.log('call');

        $scope.rtc = new PexRTC();
        $scope.rtc.audio_source = $rootScope.settings.audioSource;
        $scope.rtc.video_source = $rootScope.settings.videoSource;

        $scope.rtc.onMicActivity = function() {
            if (!$scope.audio.active) {
                // console.log('Looks like you are talking, but the mic is muted.');
            }
        };

        $scope.rtc.onSetup = function(video, pinStatus) {
            LogService.log('rtc.onSetup');
            if (video) {
                $scope.selfview.start(video);
            }
            $scope.rtc.connect($scope.user.pin);
        };

        $scope.rtc.onConnect = function(video) {
            LogService.log('rtc.onConnect: ' + video);
            $scope.$apply(function() {
                $scope.callConnected = true;
                $scope.video.start(video);
            });
        };

        $scope.rtc.onParticipantCreate = function(participant) {
            console.log('New participant');
            console.log(participant);

            $timeout(function() {
                $scope.rosterList.addParticipant(participant);
            }, 0);
        };

        $scope.rtc.onParticipantUpdate = function(participant) {
            console.log('Participant updated');
            console.log(participant);

            $timeout(function() {
                $scope.rosterList.updateParticipant(participant);
            }, 0);
        };

        $scope.rtc.onParticipantDelete = function(participant) {
            console.log('Participant deleted');
            console.log(participant);

            $timeout(function() {
                $scope.rosterList.deleteParticipant(participant.uuid);
            }, 0);
        };

        $scope.rtc.onConferenceUpdate = function(data) {
            console.log('Conference Updated');
            console.log(data);

            $timeout(function() {
                angular.forEach(data, function(value, key) {
                    $scope.conference[key] = value;
                });
            }, 0);

            console.log($scope.conference);
        };

        $scope.rtc.onDisconnect = function(reason) {
            LogService.log('rtc.onDisconnect');
            notify(translationService.instant('CONFERENCE_DISCONNECTED'), function() {
                window.location.href = './';
            });
        };

        $scope.rtc.onError = function(reason) {
            LogService.log('rtc.onError');
            notify(reason, function() {
                window.location.href = './';
            });
        };

        $scope.rtc.onPresentation = function(setting) {
            LogService.log('rtc.onPresentation');

            $scope.$apply(function() {
                $scope.presentation.available = setting;
                if(setting === true) {
                    LogService.log('rtc.onPresentation:true');

                    if($scope.screenshare.connected) {
                        LogService.log('stopping screenshare');
                        $scope.screenshare.stop();
                    }

                    if(!$scope.user.screenValue()) {
                        LogService.log('starting presentation');
                        $scope.presentation.open();

                        PopupService.toast($scope.popupList, translationService.instant('CONFERENCE_SHARING_CONTENT_NOW'));
                    }
                } else {
                    LogService.log('rtc.onPresentation:false');
                    $scope.presentation.closedEvent = true;
                    $scope.presentation.close();
                }
            });
        };

        $scope.rtc.onPresentationDisconnected = function(reason) {
            LogService.log('rtc.onPresentationDisconnected');

            if ($scope.presentation.closedEvent === false) {
                $scope.presentation.showImage = true;
                return;
            }

            if (reason) {
                alert(reason);
            }

            $scope.presentation.stop();
        };

        $scope.rtc.onScreenshareMissing = function() {
            $timeout(function() {
                PopupService.confirm(
                    $scope.dialogList,
                    translationService.instant('CONFERENCE_SCREENSHARE_MISSING'),
                    function () {
                        var url = translationService.instant('SCREENSHARE_EXTENSION_URL');
                        window.open(url, '_blank');
                    });
            }, 0);
        };

        $scope.rtc.onPresentationConnected = function(src) {
            LogService.log('rtc.onPresentationConnected: ' + src);
            $scope.presentation.start(src);
        };

        $scope.rtc.onPresentationReload = function(data) {
            $scope.$broadcast('rtc:onPresentationReload', data);
        };

        $scope.rtc.onStageUpdate = function(data) {
            $scope.$broadcast('rtc:onStageUpdate', data);
        };

        $scope.rtc.onScreenshareStopped = function(reason) {
            LogService.log('rtc.onScreenshareStopped');

            if (reason) {
                alert(reason);
            }

            $scope.$apply(function() {
                $scope.screenshare.active = false;
                $scope.screenshare.connected = false;
            });
        };

        $scope.rtc.onScreenshareConnected = function(src) {
            LogService.log('rtc.onScreenshareConnected');
            $scope.$apply(function() {
                $scope.presentation.close();
                $scope.screenshare.connected = true;
            });
        };

        $scope.rtc.onRosterList = function(roster) {
            if (angular.isDefined(roster[0])) {
                $scope.rosterList.fetch('role' in roster[0]);
            }
        };

        window.addEventListener('beforeunload', function (event) {
            $scope.rtc.disconnect();
        });

        $scope.keypress = function (event) {
            if (event.keyCode == 42) {
                $scope.$apply(function () {
                    var stats_func = function(newScope) { return $scope.rtc.getMediaStatistics(newScope); };
                    var p = PopupService.mediaStatistics($scope.dialogList, stats_func);
                });
            }
        };
        window.addEventListener('keypress', $scope.keypress);

        var mode = $scope.user.screenValue() ? 'screen' :
            $scope.user.audioValue() ? 'audioonly' : null;

        if ($scope.rosterOnly === true) {
            $scope.rtc.makeCall(RTC_NODE, $scope.conference.id, $scope.user.username, parseInt($scope.user.bandwidth), 'none');
        } else {
            $scope.rtc.makeCall(RTC_NODE, $scope.conference.id, $scope.user.username, parseInt($scope.user.bandwidth), mode);
        }

        /*function toastTest() {
            $timeout(function() {
                var newToast = PopupService.toast($scope.popupList, 'hello I am a toast', function () {

                });
            }, 0);
        }

        window.setInterval(toastTest, 2000);*/

    };
});
