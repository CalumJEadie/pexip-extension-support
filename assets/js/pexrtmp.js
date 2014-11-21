/* global window */
/* global navigator */
/* global WebSocket */
/* global console */
/* global URL */
/* global setTimeout */
/* global setInterval */
/* global clearInterval */

function PexRTMP(flash) {
    var self = this;

    self.state = 'IDLE';
    self.api_uuid = null;
    self.uuid = null;
    self.flash = flash;
    self.conference = null;
    self.display_name = null;
    self.bandwidth_in = 1280;
    self.bandwidth_out = 1280;
    self.localStream = null;
    self.node = null;
    self.socket = null;
    self.uuid = null;
    self.onHold = false;
    self.last_ping = null;
    self.pc = null;
    self.pcConfig = {};
    self.pcConstraints = {};
    self.heartbeat = null;
    self.mutedAudio = false;
    self.mutedVideo = false;
    self.config_msg = { 'type': 'config' };
    self.pin_status = 'none';
    self.call_type = '';
    self.audio_source = null;
    self.video_source = null;
    self.recv_audio = true;
    self.recv_video = true;
    self.event_listener = null;
    self.roll = null;
    self.screenshare_api = 'pexGetScreen';
    self.token_refresh = null;
    self.token = null;

    self.screenshare = null;
    self.presentation = null;

    self.rtmpDisabled = null;
    self.onError = null;
    self.onSetup = null;
    self.onConnect = null;
    self.onHoldResume = null;
    self.onDisconnect = null;
    self.onPresentation = null;
    self.onPresentationReload = null;
    self.onPresentationConnected = null;
    self.onPresentationDisconnected = null;
    self.onRosterList = null;
    self.onScreenshareStopped = null;
    self.onCallTransfer = null;

    self.trans = {
        SUFFIX_PRESENTER: " (Presenter)",
        SUFFIX_PRESENTATION: " (Presentation)",
        ERROR_USER_MEDIA: "Error: Could not get access to camera/microphone.\n\nHave you allowed access? Has any other application locked the camera?",
        ERROR_SCREENSHARE_CANCELLED: "Screenshare cancelled",
        ERROR_CALL_FAILED: "Call Failed: ",
        ERROR_PRESENTATION_ENDED: "Presentation ended",
        ERROR_DISCONNECTED_PRESENTATION: "Presentation stream remotely disconnected",
        ERROR_DISCONNECTED: "You have been remotely disconnected from this conference",
        ERROR_CONNECTING_PRESENTATION: "Presentation stream unavailable",
        ERROR_CONNECTING: "Error connecting to conference"
    };

    if (navigator.userAgent.indexOf("Chrome") != -1) {
        self.chrome_ver = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    } else {
        self.chrome_ver = 0;
    }
}


PexRTMP.prototype.makeCall = function (node, conf, name, bw, call_type, pin) {
    var self = this;
    self.state = 'ACTIVE';
    self.node = node;
    self.conference = conf;
    self.display_name = name;
    self.bandwidth_in = parseInt(bw);
    self.bandwidth_out = self.bandwidth_in;
    self.config_msg.name = name;
    self.config_msg.pin = pin;
    self.createParticipant();
    var remoteServiceUri = self.createCall(bw, call_type);
    var uuid = remoteServiceUri.substr(remoteServiceUri.indexOf('pexip/')+6);
    var rtmp_url = remoteServiceUri.substr(0, remoteServiceUri.indexOf('pexip/')+6);

    self.flash = swfobject.getObjectById(self.flash.id);
    self.flash.startCall(rtmp_url, uuid, self.display_name, self.bandwidth_out,
                         self.audio_source, self.video_source);
    self.onConnect();
};

PexRTMP.prototype.sendRequest = function(request, params, cb) {
    var self = this;
    // Only do async if explicitly asked
    var async = cb === false ? false : true;
    var xhr = new XMLHttpRequest();
    var xhrUrl = "https://" + self.node + "/api/client/v2/conferences/" + self.conference + "/" + request;
    console.log("Requesting: " + xhrUrl);
    xhr.open("POST", xhrUrl, async);
    if (cb) {
        xhr.onload = cb;
    }
    if (self.token) {
        xhr.setRequestHeader('token', self.token);
    } else if (self.config_msg.pin) {
        xhr.setRequestHeader('pin', self.config_msg.pin);
    }
    if (params) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }
    if (cb === false) {
        console.log("Response: " + xhr.responseText);
        try {
            var msg = JSON.parse(xhr.responseText);
        } catch (e) {
            var msg = {"result": xhr.responseText};
        }
        msg.http_status = xhr.status;
        return msg;
    }
};

PexRTMP.prototype.createParticipant = function() {
    var self = this;

    if (!self.token) {
        var msg = self.sendRequest("request_token", {'display_name': self.display_name}, false);
        console.log(msg, msg.http_status);
        if (msg.http_status == 200) {
            self.token = msg.result.token;
            self.api_uuid = msg.result.participant_uuid;
        } else if (msg.http_status == 403) {
            if ('pin' in msg.result) {
                if (msg.result.guest_pin == 'none') {
                    self.pin_status = 'optional';
                } else {
                    self.pin_status = 'required';
                }
            }
        } else {
            return self.handleError(msg.result);
        }

        if (!self.token_refresh && self.token) {
            var expires = msg.result.expires || 120;
            self.token_refresh = setInterval(function() {
                self.sendRequest("refresh_token", null,  function(e) {
                    console.log("Response: " + e.srcElement.responseText);
                    var msg = JSON.parse(e.srcElement.responseText);
                    msg.http_status = e.srcElement.status;
                    if (msg.http_status == 200) {
                        self.token = msg.result.token;
                    } else {
                        return self.handleError(msg.result);
                    }
                });
            }, (expires * 1000) / 2);
        }
    }

    //self.onSetup(null, self.pin_status);
};
PexRTMP.prototype.deleteParticipant = function () {
    var self = this;
    clearInterval(self.refresh_token);
    var msg = self.sendRequest('release_token', {}, false);
    if (msg.http_status == 200) {
        return msg.result.url;
    }
    else {
        console.error("RELEASE TOKEN FAILED");
        self.onError();
    }
};

PexRTMP.prototype.createCall = function (bw, call_type) {
    var self = this;
    var msg = self.sendRequest(
        'participants/' + self.api_uuid + '/calls',
        {"call_type": "RTMP", "bandwidth": bw},
        false);
    if (msg.http_status == 200) {
        return msg.result.url;
    }
    if (msg.http_status == 404 && msg.result == "Disabled") {
        self.rtmpDisabled();
    }
    else {
        console.log("Call creation failed " + msg);
        self.onError();
    }
};

PexRTMP.prototype.dialOut = function(destination, protocol, role) {
    var self = this;

    if (!destination) {
        return;
    }

    var params = {'destination': destination,
                  'protocol': (protocol ? protocol : "sip")};

    if (role && role.toUpperCase() == "GUEST") {
        params['role'] = "GUEST";
    }

    var msg = self.sendRequest("dial", params, false);
    return msg;
};

PexRTMP.prototype.handleError = function (err) {
    var self = this;
    console.log("Handle error", err, self.state);
    if (self.state != 'DISCONNECTING') {
        console.log("Handle error1", err, self.state);
        if (self.onError) {
            if (err.hasOwnProperty('message')) {
                err = err.message;
            }
            console.log("Handle error2", err, self.state);
            self.onError(self.trans.ERROR_CALL_FAILED + err);
        }
    }
};

PexRTMP.prototype.processError = function(msg) {
    var self = this;

    var reason;
    if (self.call_type == 'presentation') {
        reason = self.trans.ERROR_CONNECTING_PRESENTATION;
    } else if (self.call_type == 'screen') {
        reason = self.trans.ERROR_CONNECTING_SCREENSHARE;
    } else {
        reason = self.trans.ERROR_CONNECTING;
    }
    if ('reason' in msg) {
        reason += ": " + msg.reason;
    }

    self.handleError(reason);
};

PexRTMP.prototype.muteAudio = function() {
    //mutedAudio is a toggle, opposite to enabled value, so toggle at end
    var self = this;
    var r = self.flash.toggleMuteAudio();
    return r;
};

PexRTMP.prototype.muteVideo = function() {
    var self = this;
    var r = self.flash.toggleMuteVideo();
    return r;
};

PexRTMP.prototype.getMediaStatistics = function() {
    var self = this;
    return self.flash.getMediaStatistics();
};

PexRTMP.prototype.setConferenceLock = function(setting) {
    var self = this;

    var command = setting ? "lock" : "unlock";
    console.log("command: " + command);
    self.sendRequest(command);
};

PexRTMP.prototype.setParticipantMute = function(uuid, setting) {
    var self = this;
    var command = "participants/" + uuid + "/";
    command += setting ? "mute" : "unmute";
    console.log("command: " + command);
    self.sendRequest(command);
};
