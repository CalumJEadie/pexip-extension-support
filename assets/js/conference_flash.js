/**
 * @module conferenceFlash
 */
function callAngularScopeFunc(func_name) {
    console.log("Calling " + func_name);
    // BLACK MAGIC
    angular.element(document.getElementById('flashvideo')).scope()[func_name]();
}

var conferenceFlash = angular.module('conferenceFlash', [
    'pexapp',
    'pexapp.popup',
    'pexapp.about',
    'pexapp.layout',
    'pexapp.diagnostics',
    'pexapp.presentation',
    'pexapp.dtmf'
]);


conferenceFlash.controller('ConferenceFlashController', function($rootScope, $scope, $state, $http, $timeout, conference, user, PopupService, version, translationControls, translationService, PexappBuild, ScreenSizeWatchers, LogService, PresentationImage, ConferencePresentation, DtmfMessages, ConferenceState) {
  console.log(conference);
  $scope.conference = conference;
  $scope.user       = user;
  $scope.ready = false;
  $scope.when_ready_callbacks = [];
  $scope.use_native_selfview = false;

  $scope.dialogList = [];
  $scope.popupList = {};

  $scope.rtc = null;
  $scope.windowHeight = null;
  $scope.windowWidth = null;
  $scope.flash = null;

  ConferencePresentation.attachOnPresentationReload($scope);
  ConferencePresentation.attachPresentationActive($scope, $scope.presentation);

  ScreenSizeWatchers.attachWindowWatchers($scope);
  ScreenSizeWatchers.detatchWindowWatchers($scope);

  DtmfMessages.receive($scope, function(data) {
      $scope.rtc.sendDTMF(data);
  });

  DtmfMessages.closeReceive($scope, function(data) {
      $scope.controls.dtmfVisible = !!!$scope.controls.dtmfVisible;
  });

  $scope.rtmp_disabled = function() {
    $state.go('login.browser');
  };

  $scope.flash_is_ready = function() {
    $scope.ready = true;
    $scope.flash = swfobject.getObjectById('flashvideo');
    $scope.rtc = new PexRTMP($scope.flash);
    $scope.rtc.rtmpDisabled = $scope.rtmp_disabled;
    $scope.rtc.audio_source = $rootScope.settings.audioSource;
    $scope.rtc.video_source = $rootScope.settings.videoSource;
    $scope.rtc.onError = $scope.call_failed;
    console.log("FLASH IS READY", $scope.when_ready_callbacks);
    $scope.when_ready_callbacks.forEach(
      function(cb) {
        console.log("FLASH CB", cb);
        cb();
    });
    $scope.when_ready_callbacks = [];
  };

  $scope.callWhenReady = function(cb) {
    if ($scope.ready) {
      cb();
    }
    $scope.when_ready_callbacks.push(cb);
  };

  // make sure the user role is valid
  user.getRole($scope.user.pin, function(role) {
    log('fetched role: ' + role);
    // invalid credentials -> let's log them out.
    if(role != 'HOST' && role != 'GUEST') {
      conference.isGateway(function(response) {
        if(response) {
          $scope.conference.isGateway = true;
          $scope.call(role);
        } else {
          window.location.href = '../'
        }
       });
    } else {
      // store the user role
      $scope.user.role = role;
      $scope.conference.isGateway = false;
      $scope.callWhenReady($scope.call);
    }
  });


  // global credentials for all api calls
  var REST_CREDENTIALS = {
    headers: {
      'pin': $scope.user.pin
    }
  };


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

  $scope.keypress = function (event) {
    if (event.keyCode == 42) {
      $scope.$apply(function () {
          var stats_func = function() { return $scope.rtc.getMediaStatistics(); };
          PopupService.mediaStatistics($scope.dialogList, stats_func);
          });
      }
  };
  window.addEventListener('keypress', $scope.keypress);

  $scope.controls = {
    disconnect: function(url) {
      PopupService.confirm(
        $scope.dialogList,
        translationService.instant('CONFERENCE_MESSAGE_LEAVE'),
        function () {
          $scope.rtc.deleteParticipant();
          window.location.href = url;
        });
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
    versionOverlay: function() {
      PopupService.alert(
        $scope.dialogList,
        'Version: ' + version + ' \n' +
        'Built: ' + PexappBuild.Generated + '\n' +
        'http://pexip.com'
      );
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
    }
  };


  function alert(text, callback) {
    $timeout(function() {
      PopupService.toast($scope.popupList, text, function () {
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
  $scope.alert = alert;

  $scope.call_failed = function() {
    var error = translationService.instant('Error connecting to conference');

    notify(error, function() {
      window.location.href = '../';
    });
  }

  $scope.mic_activity = function() {
    var error = "Looks like you muted your microphone but are still talking - unmute?";
    alert(error);
  }

  $scope.camera_failed = function() {
    var error = translationService.instant($scope.rtc.trans.ERROR_USER_MEDIA);

    notify(error, function() {
      window.location.href = '../';
    });
  }

  $scope.call_ended = function() {
    var error = translationService.instant("You have been remotely disconnected from this conference");

    notify(error, function() {
      window.location.href = '../';
    });
  }

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
      return REST_URI + $scope.conference.id + '/' + id + '/' + task;
    },
    add : function() {
      function addParticipant(userText) {
        //var userText = prompt('Please enter (protocol:)destination');
        if(userText == null) return;

        var resolved = userText.split(':');
        if(resolved.length > 2) {
          alert('Invalid input. Must not contain more than one semicolon.')
          return;
        }

        if(resolved.length == 2) {
          var protocol = resolved[0];
          var destination = userText;
          if(protocol == 'lync') {
            protocol = 'mssip';
            destination = 'sip:' + resolved[1];
          }
        } else {
          var protocol = 'sip';
          var destination = 'sip:' + userText;
        }

        var apiURI = REST_URI + $scope.conference.id + '/dial?destination=' + destination + '&protocol=' + protocol;

        $http.post(apiURI, null, REST_CREDENTIALS)
          .success(function(data, status, headers, config) {
            alert('calling. destination: ' + destination + '. protocol: ' + protocol);
          })
          .error(function(data, status, headers, config) {
            alert('Call failed');
          });
      }

      PopupService.prompt(
        $scope.dialogList,
        translationService.instant('CONFERENCE_ADD_PARTICIPANT_DIALOG'),
        addParticipant
      );

    },
    disconnect : function(participant) {
      log('disconnect participant with uuid: ' + participant.uuid);
      $http.post($scope.participant.uri(participant.uuid, 'disconnect'), null, REST_CREDENTIALS);
    },
    mute: function(participant) {
      log('mute/unmute participant with uuid: ' + participant.uuid);
      // toggle the particpants mute status immediatedly
      participant.is_muted = !participant.is_muted;
      $http.post($scope.participant.uri(participant.uuid, 'mute'), null, REST_CREDENTIALS);
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
    collapse: true,
    element: $('#selfview'),
    start: function() {
    },
    show: function() {
      $scope.flash.showSelfview();
      $scope.selfview.active = true;
    },
    hide: function() {
      $scope.flash.hideSelfview();
      $scope.selfview.active = false;
    },
    toggle: function() {
      $scope.flash.toggleSelfview();
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
      $(document).fullScreen(true);
      $scope.fullscreen.active = true;
    },
    disable: function() {
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
         alert('Your browser won\'t enter full screen mode for some unexpected reason.');
      });

    }
  };

  $scope.fullscreen.setup();


  /**
   * Roster List
   */
  $scope.rosterList = {
    fetch : function(show_roles) {

      // don't update the roster list on gateway calls
      if($scope.conference.isGateway) return false;

      $http.get(REST_URI + $scope.conference.id + '/roster_list', REST_CREDENTIALS)
        .success(function(data, status, headers, config) {
          log(data.result);
          $scope.rosterList.digest(data.result, show_roles);
        });

    },
    digest : function(roster, show_roles) {

      $scope.participants = [];

      for(var worker in roster) {
        var subroster = roster[worker];
        for(var i = 0; i < subroster.length; i++) {

          log(subroster[i]);

          participant = subroster[i];

          if(participant.display_name == '') {
            participant.name = participant.uri.replace('sip:', '');
          } else {
            participant.name = participant.display_name;
          }

          if(participant.role !== 'unknown' && show_roles) {
            participant.role = (participant.role == 'guest') ? 'Guest' : 'Host';
          } else {
            participant.role = null;
          }

          participant.is_muted      = participant.is_muted      == 'YES' ? true : false;
          participant.is_presenting = participant.is_presenting == 'YES' ? true : false;
          participant.video_call    = participant.video_call    == 'YES' ? true : false;

          if(participant.service_type != 'waiting_room') {
            $scope.participants.push(participant);
          }
        }
      }
    }

  };

  $scope.call = function(role) {

    console.log('call');

    var deleted = false;
    var intervalId = window.setInterval(function() {$scope.rosterList.fetch("host");}, 3000);
    $scope.$on('$destroy', function() {
      window.removeEventListener('keypress', $scope.keypress);
      if (deleted) {
        return;
      }
      deleted = true;
      $scope.rtc.deleteParticipant();
      window.clearInterval(intervalId);
    });
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if (deleted) {
        return;
      }
      deleted = true;
      $scope.rtc.deleteParticipant();
      window.clearInterval(intervalId);
    });

    $scope.rosterList.fetch('host');
    console.log('called');
    var mode = $scope.user.screenValue() ? 'screen' :
      $scope.user.audioValue() ? 'audioonly' : null;
    console.log(RTC_NODE, $scope.conference.id, $scope.user.bandwidth, mode);
    $scope.rtc.role = role;
    $scope.rtc.makeCall(RTC_NODE, $scope.conference.id, $scope.user.username, parseInt($scope.user.bandwidth), mode, $scope.user.pin);
  };

});
