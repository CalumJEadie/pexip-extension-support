/* global window */
/* global navigator */
/* global WebSocket */
/* global console */
/* global URL */
/* global setTimeout */
/* global setInterval */
/* global clearInterval */

var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

function t2b(text) {
    return text == "YES" || text == "ALLOW" ? true : false;
}

function b2t(val) {
    return val ? "YES" : "NO";
}
function b2p(val) {
    return val ? "ALLOW" : "DENY";
}

function PexRTCCall() {
    var self = this;

    self.state = 'IDLE';
    self.parent = null;
    self.bandwidth_in = 1280;
    self.bandwidth_out = 1280;
    self.localStream = null;
    self.onHold = false;
    self.pc = null;
    self.mutedAudio = false;
    self.mutedVideo = false;
    self.call_type = '';
    self.audio_source = null;
    self.video_source = null;
    self.recv_audio = true;
    self.recv_video = true;
    self.force_hd = true;
    self.event_listener = null;
    self.call_uuid = null;

    self.onError = null;
    self.onSetup = null;
    self.onConnect = null;
    self.onHoldResume = null;
    self.onDisconnect = null;
    self.onMicActivity = null;
    self.onScreenshareMissing = null;

    if (navigator.userAgent.indexOf("Chrome") != -1) {
        self.chrome_ver = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    } else {
        self.chrome_ver = 0;
    }
}


PexRTCCall.prototype.sdpAddPLI = function(sdplines) {
    var self = this;
    var state = 'notinvideo';
    var newlines = [];

    for (var i = 0; i < sdplines.length; i++) {
        if (state === 'notinvideo') {
            newlines.push(sdplines[i]);

            if (sdplines[i].lastIndexOf('m=video', 0) === 0) {
                state = 'invideo';
            }
        } else if (state === 'invideo') {
            if (sdplines[i].lastIndexOf('m=', 0) === 0 || sdplines[i] === '') {
                newlines.push('a=rtcp-fb:* nack pli');
                if (self.call_type == 'presentation' || self.call_type == 'screen') {
                    newlines.push('a=content:slides');
                }

                if (sdplines[i].lastIndexOf('m=video', 0) !== 0) {
                    state = 'notinvideo';
                }
            }

            newlines.push(sdplines[i]);

            if (sdplines[i].lastIndexOf('c=', 0) === 0) {
                newlines.push('b=AS:' + self.bandwidth_in);
            }
        }
    }

    return newlines;
};

PexRTCCall.prototype.sdpChangeBW = function(sdplines) {
    var self = this;
    var state = 'notinvideo';
    var newlines = [];

    for (var i = 0; i < sdplines.length; i++) {
        newlines.push(sdplines[i]);
        if (sdplines[i].lastIndexOf('m=video', 0) === 0) {
            state = 'invideo';
        } else if (state === 'invideo') {
            if (sdplines[i].lastIndexOf('c=', 0) === 0) {
                if (sdplines[i+1].lastIndexOf('b=AS:', 0) === 0) {
                    var oldbw = sdplines[i+1];
                    oldbw = oldbw.substr(oldbw.indexOf(":")+1);
                    if (parseInt(oldbw) < self.bandwidth_out) {
                        // If remote end has lower bandwidth, retain this line
                        continue;
                    } else {
                        // Otherwise skip it on next iteration and use us instead
                        i++;
                    }
                }
                newlines.push('b=AS:' + self.bandwidth_out);
            } else if (sdplines[i].lastIndexOf('m=', 0) === 0 || sdplines[i] === '') {
                if (sdplines[i].lastIndexOf('m=video', 0) !== 0) {
                    state = 'notinvideo';
                }
            }

        }
        if (navigator.userAgent.indexOf("Chrome") != -1 && sdplines[i].lastIndexOf('a=sendonly', 0) === 0) {
            newlines.push('a=sendrecv');
        }
    }

    return newlines;
};


PexRTCCall.prototype.makeCall = function (parent, call_type) {
    var self = this;

    self.state = 'ACTIVE';
    self.parent = parent;
    self.bandwidth_in = self.parent.bandwidth_in;
    self.bandwidth_out = self.parent.bandwidth_out;

    if (call_type == 'presentation') {
        self.call_type = call_type;
        self.audio_source = false;
        self.video_source = false;
        self.recv_audio = false;
    } else if (call_type == 'audioonly') {
        self.video_source = false;
        self.recv_video = false;
    } else if (call_type && call_type.indexOf('recvonly') === 0) {
        self.audio_source = false;
        self.video_source = false;
        if (call_type == 'recvonlyvideo') {
            self.recv_audio = false;
        }
    } else if (call_type == 'screen') {
        self.call_type = call_type;
        self.audio_source = false;
        self.recv_audio = false;
        self.recv_video = false;
        if (self.bandwidth_out < 384) {
            // Chrome does not support screensharing at under 384kbps
            self.bandwidth_out = 384;
        }
    } else {
        self.audio_source = self.parent.audio_source;
        self.video_source = self.parent.video_source;
        self.recv_audio = self.parent.recv_audio;
        self.recv_video = self.parent.recv_video;
    }

    if (call_type == 'screen' && self.chrome_ver >= 34) {
        var pending = window.setTimeout(function() {
            var err = new Error('NavigatorUserMediaError');
            err.name = 'EXTENSION_UNAVAILABLE';
            self.gumError(err);
        }, 2000);
        self.event_listener = function (event) {
            if (event.origin != window.location.origin) {
                return;
            }
            if (event.data.type == self.parent.screenshare_api + 'Done') {
                self.getMedia(event.data.sourceId);
            } else if (event.data.type == self.parent.screenshare_api + 'Pending') {
                window.clearTimeout(event.data.id);
            }
        };
        window.addEventListener('message', self.event_listener);
        window.postMessage({ type: self.parent.screenshare_api, id: pending}, '*');
    } else {
        self.getMedia();
    }
};

PexRTCCall.prototype.sendRequest = function(request, params, cb) {
    var self = this;

    // Only do async if explicitly asked
    var async = cb === false ? false : true;
    var xhr = new XMLHttpRequest();
    var xhrUrl = "https://" + self.parent.node + "/api/client/v2/conferences/" + self.parent.conference + "/participants/" + self.parent.uuid + "/" + request;
    console.log("Requesting: " + xhrUrl);
    xhr.open("POST", xhrUrl, async);
    if (cb) {
        xhr.onload = cb;
    }
    if (self.parent.token) {
        xhr.setRequestHeader('token', self.parent.token);
    }
    if (params) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }
    if (cb === false) {
        console.log("Response: " + xhr.responseText);
        var msg = {};
        try {
            msg = JSON.parse(xhr.responseText);
        } catch (error) {
            msg.reason = xhr.status + " " + xhr.statusText;
        }
        msg.http_status = xhr.status;
        return msg;
    }
};

PexRTCCall.prototype.handleError = function (err) {
    var self = this;

    if (self.state != 'DISCONNECTING') {
        self.state = 'DISCONNECTING';
        self.cleanup();
        if (self.onError) {
            if (self.call_type == 'presentation' || self.call_type == 'screen') {
                self.onError(err);
            } else {
                if (err.hasOwnProperty('message')) {
                    err = err.message;
                }
                self.onError(self.parent.trans.ERROR_CALL_FAILED + err);
            }
        }
    }
};

PexRTCCall.prototype.getMedia = function(sourceId) {
    var self = this;

    if (self.call_type == 'screen' && self.chrome_ver >= 34) {
        if (sourceId) {
            self.video_source = sourceId;
        } else {
            return self.handleError(self.parent.trans.ERROR_SCREENSHARE_CANCELLED);
        }
    }

    if (!self.localStream && !(self.audio_source === false && self.video_source === false)) {
        var audioConstraints = !(self.audio_source === false);
        var videoConstraints = {};
        if (self.call_type == 'screen') {
            if (self.video_source) {
                videoConstraints.chromeMediaSource = 'desktop';
                videoConstraints.chromeMediaSourceId = self.video_source;
            } else {
                videoConstraints.chromeMediaSource = self.call_type;
            }
            videoConstraints.maxWidth = "1280";
            videoConstraints.maxHeight = "720";
            videoConstraints.googLeakyBucket = true;
        } else if (self.force_hd) {
            videoConstraints.minWidth = "1280";
            videoConstraints.minHeight = "720";
        }

        if (self.audio_source && audioConstraints) {
            audioConstraints = {'optional': [{'sourceId': self.audio_source}]};
        }

        var constraints = { 'audio' : audioConstraints,
                            'video' : { 'mandatory' : videoConstraints, 'optional' : [] }
                          };

        if (self.video_source && self.call_type != 'screen') {
            constraints.video.optional = [{'sourceId': self.video_source}];
        }

        if (self.video_source === false) {
            constraints.video = false;
        }

        navigator.getMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);

        if (!navigator.getMedia) {
            return self.handleError(self.parent.trans.ERROR_WEBRTC_SUPPORT);
        }

        try {
            navigator.getMedia(constraints,
                               function(stream) { self.gumSuccess(stream); },
                            function(err) { self.gumError(err); });
        } catch (error) {
            self.gumError(error);
        }
    } else {
        if (self.localStream) {
            var url = window.URL || window.webkitURL || window.mozURL;
            self.onSetup(url.createObjectURL(self.localStream));
        } else {
            self.onSetup();
        }
    }
};

PexRTCCall.prototype.gumSuccess = function (stream) {
    var self = this;

    self.localStream = stream;
    var url = window.URL || window.webkitURL || window.mozURL;
    self.onSetup(url.createObjectURL(stream));

    var audioCtx = (window.AudioContext || window.webkitAudioContext || undefined);
    if (audioCtx != undefined) {
        audioContext = new audioCtx();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.1;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            var array =  new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
                values += array[i];
            }

            var average = values / length;
            if (average > 70) {
                if (self.onMicActivity != null) {
                    self.onMicActivity();
                }
            }
        }
    }
};


PexRTCCall.prototype.gumError = function(err) {
    var self = this;

    console.log("getUserMedia error:");
    console.log(err);

    if (self.call_type == 'screen') {
        self.cleanup();
        self.onScreenshareMissing();
    } else if (self.force_hd) {
        self.force_hd = false;
        return self.getMedia();
    } else {
        self.handleError(self.parent.trans.ERROR_USER_MEDIA);
    }
};

PexRTCCall.prototype.connect = function() {
    var self = this;

    if ('iceServers' in self.parent.pcConfig) {
        self.pc = new PeerConnection(self.parent.pcConfig, self.parent.pcConstraints);
    } else {
        self.pc = new PeerConnection(null);
    }

    self.pc.onicecandidate = function(evt) { self.pcIceCandidate(evt); };
    //pc.onnegotiationneeded = this.pcNegotiationNeeded;
    self.pc.onaddstream = function(evt) { self.pcAddStream(evt); };
    //pc.onremovestream = this.pcRemoveStream;
    //pc.onsignalingstatechange = this.pcSignalingStateChange;

    if (self.call_type == 'screen') {
        self.localStream.onended = function() {
            self.disconnect();
            self.onDisconnect(self.parent.trans.ERROR_PRESENTATION_ENDED);
        };
    }

    if (self.localStream) {
        self.pc.addStream(self.localStream);
    }

    self.pcCreateOffer();
};

PexRTCCall.prototype.pcCreateOffer = function() {
    var self = this;

    var constraints = { 'mandatory': { 'OfferToReceiveAudio': self.recv_audio, 'OfferToReceiveVideo': self.recv_video } };

    self.pc.createOffer(function(sdp) { self.pcOfferCreated(sdp); },
                        function(err) { self.handleError(err); },
                        constraints);
};

PexRTCCall.prototype.pcIceCandidate = function (evt) {
    var self = this;

    console.log("Ice Gathering State: " + self.pc.iceGatheringState);
    if (evt.candidate) {
        console.log("Gathered ICE candidate: " + evt.candidate.candidate);
    } else if (self.pc.iceGatheringState == "complete") {
        if (self.state == 'ACTIVE') {
            self.state = 'CONNECTING';
            console.log("Finished gathering candidates: " + self.pc.localDescription.sdp);
            setTimeout(function() {
                self.pcOfferCreated(self.pc.localDescription);
            }, 200);
        }
    }
};

PexRTCCall.prototype.mutateOffer = function(description) {
    var self = this;
    var lines = description.sdp.split('\r\n');
    lines = self.sdpAddPLI(lines);

    var sdp = lines.join('\r\n');
    console.log("Mutated offer: " + sdp);

    return new SessionDescription({ 'type' : 'offer', 'sdp' : sdp });
};


PexRTCCall.prototype.pcAddStream = function(evt) {
    var self = this;

    console.log("Stream added: " + evt.stream.label);
    self.state = 'CONNECTED';
    self.stream = evt.stream;
    self.onConnect(URL.createObjectURL(evt.stream), self.call_uuid);
};

PexRTCCall.prototype.pcOfferCreated = function(sdp) {
    var self = this;

    console.log("Created offer: " + sdp.sdp);
    self.pc.setLocalDescription(sdp,
                        function () { console.log("Local description active"); },
                        function (err) { console.log("Local description failed"); console.log(err); }
                       );

    if (self.state == 'CONNECTING') {
        var mutatedOffer = {'call_type' : 'WEBRTC', 'sdp' : self.mutateOffer(sdp).sdp};
        if (self.call_type == 'screen') {
            mutatedOffer.present = 'send';
        } else if (self.call_type == 'presentation') {
            mutatedOffer.present = 'receive';
        }
        self.sendRequest('calls', mutatedOffer, function(e) {
            self.processAnswer(e);
        });
    }
};

PexRTCCall.prototype.processAnswer = function(e) {
    var self = this;

    var msg;
    try {
        msg = JSON.parse(e.target.responseText);
    } catch (SyntaxError) {
        return self.handleError("Unexpected Response: " + e.target.status + " Detail: " + e.target.responseText);
    }
    if (e.target.status != 200) {
        return self.handleError(msg.result);
    }

    console.log("Received answer: " + msg.result);
    self.call_uuid = msg.result.call_uuid;

    if (self.state != 'DISCONNECTING') {
        var lines = msg.result.sdp.split('\r\n');
        lines = self.sdpChangeBW(lines);

        var sdp = lines.join('\r\n');
        console.log("Mutated answer: " + sdp);

        self.pc.setRemoteDescription(new SessionDescription({ 'type' : 'answer', 'sdp' : sdp }),
                            function () { console.log("Remote description active"); },
                            function (err) { console.log("Remote description failed"); console.log(err); }
                           );
    }
};

PexRTCCall.prototype.remoteDisconnect = function(msg) {
    var self = this;

    if (self.state != 'DISCONNECTING') {
        self.state = 'DISCONNECTING';
        self.cleanup();

        var reason;
        if (self.call_type == 'presentation') {
            reason = self.parent.trans.ERROR_DISCONNECTED_PRESENTATION;
        } else if (self.call_type == 'screen') {
            reason = self.parent.trans.ERROR_DISCONNECTED_SCREENSHARE;
        } else {
            reason = self.parent.trans.ERROR_DISCONNECTED;
        }
        if ('reason' in msg) {
            reason += ": " + msg.reason;
        }

        self.onDisconnect(reason);
    }
};

PexRTCCall.prototype.processError = function(msg) {
    var self = this;

    var reason;
    if (self.call_type == 'presentation') {
        reason = self.parent.trans.ERROR_CONNECTING_PRESENTATION;
    } else if (self.call_type == 'screen') {
        reason = self.parent.trans.ERROR_CONNECTING_SCREENSHARE;
    } else {
        reason = self.parent.trans.ERROR_CONNECTING;
    }
    if ('reason' in msg) {
        reason += ": " + msg.reason;
    }

    self.handleError(reason);
};

PexRTCCall.prototype.muteAudio = function() {
    //mutedAudio is a toggle, opposite to enabled value, so toggle at end
    var self = this;
    var streams = self.pc.getLocalStreams();
    for (var i=0; i<streams.length; i++) {
        var tracks = streams[i].getAudioTracks();
        for (var j=0; j<tracks.length; j++) {
            tracks[j].enabled = self.mutedAudio;
        }
    }
    self.mutedAudio = !self.mutedAudio;
    return self.mutedAudio;
};

PexRTCCall.prototype.muteVideo = function() {
    var self = this;
    var streams = self.pc.getLocalStreams();
    for (var i=0; i<streams.length; i++) {
        var tracks = streams[i].getVideoTracks();
        for (var j=0; j<tracks.length; j++) {
            tracks[j].enabled = self.mutedVideo;
        }
    }
    self.mutedVideo = !self.mutedVideo;
    return self.mutedVideo;
};

PexRTCCall.prototype.holdresume = function(setting) {
    var self = this;

    self.onHold = setting;
    setting = !setting;
    var streams = self.pc.getLocalStreams().concat(self.pc.getRemoteStreams());
    for (var i=0; i<streams.length; i++) {
        var tracks = streams[i].getAudioTracks().concat(streams[i].getVideoTracks());
        for (var j=0; j<tracks.length; j++) {
            tracks[j].enabled = setting;
        }
    }

    if (self.mutedAudio) {
        self.mutedAudio = false;
        self.muteAudio();
    }
    if (self.mutedVideo) {
        self.mutedVideo = false;
        self.muteVideo();
    }
};

PexRTCCall.prototype.sendDTMF = function(digits) {
    var self = this;

    console.log("Sending DTMF tones: " + digits);
    self.sendRequest('calls/' + self.call_uuid + '/dtmf', { 'digits' : digits }, false)
};

PexRTCCall.prototype.disconnect = function() {
    var self = this;

    if (self.state != 'DISCONNECTING') {
        self.state = 'DISCONNECTING';
        console.log('Sending disconnect');
        if (self.parent.token) {
            self.sendRequest('calls/' + self.call_uuid + '/disconnect');
        }
    }
    self.cleanup();
};

PexRTCCall.prototype.cleanup = function() {
    var self = this;

    if (self.event_listener) {
        window.removeEventListener('message', self.event_listener);
        self.event_listener = null;
    }

    if (self.localStream) {
        console.log("Releasing user media");
        if (!self.localStream.ended) {
            self.localStream.stop();
        }
        self.localStream = null;
    }
};


function PexRTC() {
    var self = this;

    self.state = 'IDLE';
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
    self.default_stun = 'stun:stun.l.google.com:19302';
    self.pin = null;
    self.pin_status = 'none';
    self.call_type = '';
    self.audio_source = null;
    self.video_source = null;
    self.recv_audio = true;
    self.recv_video = true;
    self.event_listener = null;
    self.screenshare_api = 'pexGetScreen';
    self.token = null;
    self.token_refresh = null;
    self.event_source = null;
    self.rosterList = {};
    self.collapsedRoster = {};
    self.callMap = {};

    self.screenshare = null;
    self.presentation = null;
    self.call = null;

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
    self.onScreenshareMissing = null;
    self.onCallTransfer = null;
    self.onCallDisconnect = null;

    self.onParticipantCreate = null;
    self.onParticipantUpdate = null;
    self.onParticipantDelete = null;
    self.onStageUpdate = null;
    self.onMicActivity = null;
    self.stats = new PexRTCStatistics();


    self.trans = {
        ERROR_SCREENSHARE_CANCELLED: "Screenshare cancelled",
        ERROR_CALL_FAILED: "Call Failed: ",
        ERROR_WEBRTC_SUPPORT: "Error: WebRTC not supported by this browser",
        ERROR_SCREENSHARE_EXTENSION: "Error: Screenshare extension not found.\n\nHave you installed it from http://www.pexip.com/extension/?",
        ERROR_USER_MEDIA: "Error: Could not get access to camera/microphone.\n\nHave you allowed access? Has any other application locked the camera?",
        ERROR_PRESENTATION_ENDED: "Presentation ended",
        ERROR_DISCONNECTED_PRESENTATION: "Presentation stream remotely disconnected",
        ERROR_DISCONNECTED_SCREENSHARE: "Screenshare remotely disconnected",
        ERROR_DISCONNECTED: "You have been remotely disconnected from this conference",
        ERROR_CONNECTING_PRESENTATION: "Presentation stream unavailable",
        ERROR_CONNECTING_SCREENSHARE: "Screenshare error",
        ERROR_CONNECTING: "Error connecting to conference"
    };
}


PexRTC.prototype.makeCall = function (node, conf, name, bw, call_type) {
    var self = this;

    self.state = 'ACTIVE';
    self.node = node;
    self.conference = conf;
    self.display_name = name;
    self.call_type = call_type;
    if (bw) {
        self.bandwidth_in = parseInt(bw);
        self.bandwidth_out = self.bandwidth_in;
    }

    self.createParticipant();

    if (self.state != 'DISCONNECTING') {
        if (self.call_type != 'none') {
            self.addCall();
        } else {
            self.onSetup(null, self.pin_status);
        }
    }
};

PexRTC.prototype.sendRequest = function(request, params, cb, method) {
    var self = this;

    // Only do async if explicitly asked
    var async = cb === false ? false : true;
    method = method || "POST";
    var xhr = new XMLHttpRequest();
    var xhrUrl = "https://" + self.node + "/api/client/v2/conferences/" + self.conference + "/" + request;
    console.log("Requesting: " + xhrUrl);
    xhr.open(method, xhrUrl, async);
    if (cb) {
        xhr.onload = cb;
    }
    if (self.token) {
        xhr.setRequestHeader('token', self.token);
    } else if (self.pin !== null) {
        xhr.setRequestHeader('pin', self.pin);
    }
    if (params) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }
    if (cb === false) {
        console.log("Response: " + xhr.responseText);
        var msg = {};
        try {
            msg = JSON.parse(xhr.responseText);
        } catch (error) {
            msg.reason = xhr.status + " " + xhr.statusText;
        }
        msg.http_status = xhr.status;
        return msg;
    }
};

PexRTC.prototype.createParticipant = function() {
    var self = this;

    if (!self.token) {
        var msg = self.sendRequest("request_token", {'display_name': self.display_name}, false);
        if (msg.http_status == 200) {
            self.token = msg.result.token;
            self.uuid = msg.result.participant_uuid;

            self.pcConfig.iceServers = [];
            if (self.default_stun) {
                self.pcConfig.iceServers.push({ 'url' : self.default_stun });
            }
            if ('stun' in msg.result) {
                self.pcConfig.iceServers.push(msg.result.stun[0]);
            }
            console.log("ICE Servers:" + JSON.stringify(self.pcConfig));

            if ('bandwidth_in' in msg.result && msg.result.bandwidth_in - 64 < self.bandwidth_in) {
                self.bandwidth_in = msg.result.bandwidth_in - 64;
            }
            if ('bandwidth_out' in msg.result && msg.result.bandwidth_out - 64 < self.bandwidth_out) {
                self.bandwidth_out = msg.result.bandwidth_out - 64;
            }
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
                    console.log("Response: " + e.target.responseText);
                    var msg = JSON.parse(e.target.responseText);
                    msg.http_status = e.target.status;
                    if (msg.http_status == 200) {
                        self.token = msg.result.token;
                    } else {
                        return self.handleError(msg.result);
                    }
                });
            }, (expires * 1000) / 3);

            self.sendRequest("conference_status", null, function(e) {
                var msg = JSON.parse(e.target.responseText);
                console.log("conference_status");
                console.log(msg);
                if (e.target.status == 200 && self.onConferenceUpdate) {
                    self.onConferenceUpdate(msg.result);
                }
            }, "GET");
        }
    }

    if (!self.event_source && self.token) {
        self.event_source = new EventSource("https://" + self.node + "/api/client/v2/conferences/" + self.conference + "/events?token=" + self.token);
        self.event_source.addEventListener("presentation_start", function(e) {
            var msg = JSON.parse(e.data);
            msg.status = "start";
            self.processPresentation(msg);
        }, false);
        self.event_source.addEventListener("presentation_stop", function(e) {
            var msg = {'status': "stop"};
            self.processPresentation(msg);
        }, false);
        self.event_source.addEventListener("presentation_frame", function(e) {
            var url = "https://" + self.node + "/api/client/v2/conferences/" + self.conference + "/presentation.jpeg?id=" + e.lastEventId + "&token=" + self.token;
            if (self.onPresentationReload && !self.onHold) {
                self.onPresentationReload(url);
            }
        }, false);
        self.event_source.addEventListener("participant_create", function(e) {
            var msg = JSON.parse(e.data);
            console.log("participant_create");
            console.log(msg);
            self.rosterList[msg.uuid] = msg;
            if (msg.parent_call_id !== null) {
                if (self.callMap.hasOwnProperty(msg.parent_call_id)) {
                    self.callMap[msg.parent_call_id].push(msg.uuid);
                } else {
                    self.callMap[msg.parent_call_id] = [msg.uuid];
                }
            }
            if (!self.oldRosterList) {
                self.collapseRosterList();
                if (msg.parent_call_id !== null) {
                    if (self.onParticipantUpdate && self.collapsedRoster.hasOwnProperty(msg.parent_call_id)) {
                        self.onParticipantUpdate(self.collapsedRoster[msg.parent_call_id]);
                    }
                } else {
                    if (self.onParticipantCreate && self.collapsedRoster.hasOwnProperty(msg.uuid)) {
                        self.onParticipantCreate(self.collapsedRoster[msg.uuid]);
                    }
                }
                if (self.onRosterList) {
                    self.onRosterList(self.getRosterList());
                }
            }
        }, false);
        self.event_source.addEventListener("participant_update", function(e) {
            var msg = JSON.parse(e.data);
            console.log("participant_update");
            console.log(msg);
            self.rosterList[msg.uuid] = msg;
            if (!self.oldRosterList) {
                self.collapseRosterList();
                if (self.onParticipantUpdate) {
                    if (msg.parent_call_id !== null) {
                        if (self.collapsedRoster.hasOwnProperty(msg.parent_call_id)) {
                            self.onParticipantUpdate(self.collapsedRoster[msg.parent_call_id]);
                        }
                    } else {
                        if (self.collapsedRoster.hasOwnProperty(msg.uuid)) {
                            self.onParticipantUpdate(self.collapsedRoster[msg.uuid]);
                        }
                    }
                }
                if (self.onRosterList) {
                    self.onRosterList(self.getRosterList());
                }
            }
        }, false);
        self.event_source.addEventListener("participant_delete", function(e) {
            var msg = JSON.parse(e.data);
            console.log("participant_delete");
            console.log(msg);
            var parent_call_id = self.rosterList[msg.uuid].parent_call_id;
            if (self.callMap.hasOwnProperty(parent_call_id)) {
                var i = self.callMap[parent_call_id].indexOf(msg.uuid);
                if (i > -1) {
                    self.callMap[parent_call_id].splice(i, 1);
                }
            }
            delete self.rosterList[msg.uuid];
            if (!self.oldRosterList) {
                self.collapseRosterList();
                if (parent_call_id !== null) {
                    if (self.onParticipantUpdate && self.collapsedRoster.hasOwnProperty(parent_call_id)) {
                        self.onParticipantUpdate(self.collapsedRoster[parent_call_id]);
                    }
                } else {
                    if (self.onParticipantDelete) {
                        self.onParticipantDelete(msg);
                    }
                }
                if (self.onRosterList) {
                    self.onRosterList(self.getRosterList());
                }
            }
        }, false);
        self.event_source.addEventListener("participant_sync_begin", function(e) {
            console.log("participant_sync_begin");
            self.oldRosterList = self.collapsedRoster;
            self.rosterList = {};
            self.callMap = {};
        }, false);
        self.event_source.addEventListener("participant_sync_end", function(e) {
            console.log("participant_sync_end");
            self.collapseRosterList();
            for (uuid in self.collapsedRoster) {
                console.log("uuid: " + uuid);
                if (!(uuid in self.oldRosterList) && self.onParticipantCreate) {
                    self.onParticipantCreate(self.collapsedRoster[uuid]);
                } else {
                    if (self.onParticipantUpdate) {
                        self.onParticipantUpdate(self.collapsedRoster[uuid]);
                    }
                    delete self.oldRosterList[uuid];
                }
            }
            if (self.onParticipantDelete) {
                for (uuid in self.oldRosterList) {
                    var msg = {'uuid': uuid};
                    self.onParticipantDelete(msg);
                }
            }
            delete self.oldRosterList;
            if (self.onRosterList) {
                self.onRosterList(self.getRosterList());
            }
        }, false);
        self.event_source.addEventListener("call_disconnected", function(e) {
            var msg = JSON.parse(e.data);
            console.log("call_disconnected");
            console.log(msg);
            if (self.call && self.call.call_uuid == msg.call_uuid) {
                self.call.remoteDisconnect(msg);
            } else if (self.presentation && self.presentation.call_uuid == msg.call_uuid) {
                self.presentation.remoteDisconnect(msg);
            } else if (self.screenshare && self.screenshare.call_uuid == msg.call_uuid) {
                self.screenshare.remoteDisconnect(msg);
            }
        }, false);
        self.event_source.addEventListener("disconnect", function(e) {
            var msg = JSON.parse(e.data);
            console.log("disconnect");
            console.log(msg);
            var reason = self.trans.ERROR_DISCONNECTED;
            if ('reason' in msg) {
                reason += ": " + msg.reason;
            }
            self.disconnect();
            if (self.onDisconnect) {
                self.onDisconnect(reason);
            }
        }, false);
        self.event_source.addEventListener("conference_update", function(e) {
            var msg = JSON.parse(e.data);
            console.log("conference_update");
            console.log(msg);
            if (self.onConferenceUpdate) {
                self.onConferenceUpdate(msg);
            }
        }, false);
        self.event_source.addEventListener("refer", function(e) {
            var msg = JSON.parse(e.data);
            console.log("refer");
            console.log(msg);
            self.processRefer(msg);
        }, false);
        self.event_source.addEventListener("on_hold", function(e) {
            var msg = JSON.parse(e.data);
            console.log("call_hold");
            console.log(msg);
            self.holdresume(msg.setting);
        }, false);
        self.event_source.addEventListener("stage", function(e) {
            var msg = JSON.parse(e.data);
            console.log("stage ");
            console.log(msg);
            if (self.onStageUpdate) {
                for (var i=0; i<msg.length; i++) {
                    if (self.rosterList[msg[i].participant_uuid].parent_call_id !== null) {
                        msg[i].participant_uuid = self.rosterList[msg[i].participant_uuid].parent_call_id;
                    }
                }
                self.onStageUpdate(msg);
            }
        }, false);
        self.event_source.onerror = function(e) {
            console.log("event source error");
            console.log(e);
            if (self.state != 'DISCONNECTING') {
                console.log("reconnecting...");
                self.event_source.close();
                self.event_source = null;
                setTimeout(function() {
                    self.createParticipant();
                }, 10000);
            }
        };
    }
};

PexRTC.prototype.setConferenceLock = function(setting) {
    var self = this;

    var command = setting ? "lock" : "unlock";
    console.log("command: " + command);
    self.sendRequest(command);
};

PexRTC.prototype.dialOut = function(destination, protocol, role) {
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

PexRTC.prototype.setParticipantMute = function(uuid, setting) {
    var self = this;

    var calls = [uuid];
    if (self.callMap.hasOwnProperty(uuid)) {
        calls = calls.concat(self.callMap[uuid]);
    }

    for (var i=0;i < calls.length; i++) {
        var command = "participants/" + calls[i] + "/";
        command += setting ? "mute" : "unmute";
        console.log("command: " + command);
        self.sendRequest(command);
    }
};

PexRTC.prototype.setParticipantRxPresentation = function(uuid, setting) {
    var self = this;

    var calls = [uuid];
    if (self.callMap.hasOwnProperty(uuid)) {
        calls = calls.concat(self.callMap[uuid]);
    }

    for (var i=0;i < calls.length; i++) {
        var command = "participants/" + uuid + "/";
        command += setting ? "allowrxpresentation" : "denyrxpresentation";
        console.log("command: " + command);
        self.sendRequest(command);
    }
};

PexRTC.prototype.unlockParticipant = function(uuid) {
    var self = this;

    var command = "participants/" + uuid + "/unlock";
    console.log("command: " + command);
    self.sendRequest(command);
};

PexRTC.prototype.disconnectParticipant = function(uuid) {
    var self = this;

    var command = "participants/" + uuid + "/disconnect";
    console.log("command: " + command);
    self.sendRequest(command);
};

PexRTC.prototype.handleError = function (err) {
    var self = this;

    if (self.state != 'DISCONNECTING') {
        self.disconnect();
        if (self.onError) {
            if (self.call_type == 'presentation' || self.call_type == 'screen') {
                self.onError(err);
            } else {
                if (err.hasOwnProperty('message')) {
                    err = err.message;
                }
                self.onError(self.trans.ERROR_CALL_FAILED + err);
            }
        }
    }
};

PexRTC.prototype.connect = function(pin) {
    var self = this;

    if (self.pin_status != 'none') {
        self.pin_status = 'none';
        self.pin = pin;
        self.createParticipant();
    }

    if (self.call) {
        self.call.connect();
    }
};

PexRTC.prototype.addCall = function(call_type) {
    var self = this;

    if (!self.screenshare && call_type == 'screen') {
        self.screenshare = new PexRTCCall();
        self.screenshare.onSetup = function(stream) {
            self.screenshare.connect();
        };
        self.screenshare.onConnect = function(stream) {
            if (self.onScreenshareConnected) {
                self.onScreenshareConnected(stream);
            }
        };
        self.screenshare.onDisconnect = function(reason) {
            self.screenshare = null;
            if (self.onScreenshareStopped) {
                self.onScreenshareStopped(reason);
            }
        };
        self.screenshare.onError = function(reason) {
            self.screenshare = null;
            if (self.onScreenshareStopped) {
                self.onScreenshareStopped(reason);
            }
        };
        self.screenshare.onScreenshareMissing = function() {
            self.screenshare = null;
            if (self.onScreenshareMissing) {
                self.onScreenshareMissing();
            } else {
                self.onScreenshareStopped(self.trans.ERROR_SCREENSHARE_EXTENSION);
            }
        };
        self.screenshare.makeCall(self, call_type);
    } else if (!self.presentation && call_type == 'presentation') {
        self.presentation = new PexRTCCall();
        self.presentation.onSetup = function(stream) {
            self.presentation.connect();
        };
        self.presentation.onConnect = function(stream) {
            if (self.onPresentationConnected) {
                self.onPresentationConnected(stream);
            }
        };
        self.presentation.onDisconnect = function(reason) {
            self.presentation = null;
            if (self.onPresentationDisconnected) {
                self.onPresentationDisconnected(reason);
            }
        };
        self.presentation.onError = function(reason) {
            self.presentation = null;
            if (self.onPresentationDisconnected) {
                self.onPresentationDisconnected(reason);
            }
        };
        self.presentation.makeCall(self, call_type);
    } else if (!self.call) {
        self.call = new PexRTCCall();
        self.call.onSetup = function(stream) {
            self.onSetup(stream, self.pin_status);
        };
        self.call.onConnect = function(stream) {
            self.onConnect(stream);
        };
        self.call.onDisconnect = function(reason) {
            self.call = null;
            if (self.onCallDisconnect) {
                self.onCallDisconnect(reason);
            } else {
                self.disconnect();
                self.onDisconnect(reason);
            }
        };
        self.call.onError = function(reason) {
            self.call = null;
            self.onError(reason);
        };
        self.call.onMicActivity = self.onMicActivity;
        if (self.call_type == 'screen') {
            self.call.onScreenshareMissing = function() {
                self.call = null;
                if (self.onScreenshareMissing) {
                    self.onScreenshareMissing();
                } else {
                    self.onError(self.trans.ERROR_SCREENSHARE_EXTENSION);
                }
            };
        }
        self.call.makeCall(self, self.call_type);
    }
};

PexRTC.prototype.disconnectCall = function() {
    var self = this;

    if (self.call) {
        self.call.disconnect();
        self.call = null;
    }
};

PexRTC.prototype.present = function(call_type) {
    var self = this;

    if (!self.screenshare && call_type) {
        self.addCall(call_type);
    } else if (self.screenshare && !call_type) {
        self.screenshare.disconnect();
        self.screenshare = null;
    }
};

PexRTC.prototype.muteAudio = function() {
    var self = this;

    if (self.call) {
        return self.call.muteAudio();
    }
    return false;
};

PexRTC.prototype.muteVideo = function() {
    var self = this;

    if (self.call) {
        return self.call.muteVideo();
    }
    return false;
};

PexRTC.prototype.sendDTMF = function(digits) {
    var self = this;

    if (self.call) {
        return self.call.sendDTMF(digits);
    }
    return false;
};

PexRTC.prototype.holdresume = function(setting) {
    var self = this;

    if (self.call) {
        self.call.holdresume(setting);
    }
    if (self.presentation) {
        self.presentation.holdresume(setting);
    }
    if (self.screenshare) {
        self.screenshare.holdresume(setting);
    }

    if (self.onHoldResume) {
        self.onHoldResume(setting);
    }
};

PexRTC.prototype.collapseRosterList = function() {
    var self = this;

    self.collapsedRoster = {};
    for (var uuid in self.rosterList) {
        if (self.rosterList[uuid].parent_call_id === null) {
            var collapsed = {};
            for (var property in self.rosterList[uuid]) {
                collapsed[property] = self.rosterList[uuid][property];
            }
            if (self.callMap.hasOwnProperty(uuid)) {
                for (var i=0; i < self.callMap[uuid].length; i++) {
                    child = self.callMap[uuid][i];
                    collapsed.is_muted = b2t(t2b(collapsed.is_muted) | t2b(self.rosterList[child].is_muted));
                    collapsed.is_presenting = b2t(t2b(collapsed.is_presenting) | t2b(self.rosterList[child].is_presenting));
                    collapsed.presentation_supported = b2t(t2b(collapsed.presentation_supported) | t2b(self.rosterList[child].presentation_supported));
                    collapsed.rx_presentation_policy = b2p(t2b(collapsed.rx_presentation_policy) | t2b(self.rosterList[child].rx_presentation_policy));
                    collapsed.video_call = b2t(t2b(collapsed.video_call) | t2b(self.rosterList[child].video_call));
                }
            }
            self.collapsedRoster[uuid] = collapsed;
        }
    }
};

PexRTC.prototype.getRosterList = function() {
    var self = this;

    var roster = [];
    for (var uuid in self.collapsedRoster) {
        roster.push(self.collapsedRoster[uuid]);
    }
    return roster;
};

PexRTC.prototype.processRoster = function(msg) {
    var self = this;

    if (self.onRosterList) {
        self.onRosterList(msg.roster);
    }
};

PexRTC.prototype.getPresentationURL = function() {
    var self = this;

    return "https://" + self.node + "/api/client/v2/conferences/" + self.conference + "/presentation.jpeg?token=" + self.token;
};


PexRTC.prototype.getPresentation = function() {
    var self = this;

    if (!self.presentation) {
        self.addCall("presentation");
    } else if (self.onPresentationConnected) {
        self.onPresentationConnected(self.presentation.stream);
    }
};

PexRTC.prototype.stopPresentation = function() {
    var self = this;

    if (self.presentation) {
        self.presentation.disconnect();
        self.presentation = null;
    }
};


PexRTC.prototype.processPresentation = function(msg) {
    var self = this;

    if (msg.status == "newframe") {
        if (self.onPresentationReload && !self.onHold) {
            self.onPresentationReload(self.getPresentationURL());
        }
    } else {
        if (self.onPresentation) {
            if (msg.status == "start") {
                var presenter;
                if (msg.presenter_name !== "") {
                    presenter = msg.presenter_name + " <" + msg.presenter_uri + ">";
                } else {
                    presenter = msg.presenter_uri;
                }
                self.onPresentation(true, presenter);
            } else if (msg.status == "stop") {
                self.onPresentation(false, null);
            }
        }
    }
};

PexRTC.prototype.processRefer = function(msg) {
    var self = this;

    self.disconnectCall();
    self.present(null);
    self.stopPresentation();
    self.disconnect();

    if (self.onCallTransfer) {
        self.onCallTransfer(msg.alias);
    }
    setTimeout(function() {
      self.makeCall(self.node, msg.alias, self.display_name, self.bandwidth_in, self.call_type);
    }, 500);
};

PexRTC.prototype.disconnect = function() {
    var self = this;

    self.state = 'DISCONNECTING';
    console.log('Disconnecting...');
    if (self.event_source) {
        self.event_source.close();
        self.event_source = null;
    }
    if (self.token_refresh) {
        clearInterval(self.token_refresh);
        self.token_refresh = null;
    }
    if (self.token) {
        self.sendRequest("release_token", null, false);
        self.token = null;
    }
};

PexRTC.prototype.getMediaStatistics = function(newScope) {
    var self = this;

    if (self.call.pc && self.call.pc.getStats && !navigator.mozGetUserMedia) {
        self.call.pc.getStats(function (rawStats) {
            self.stats.updateStats(rawStats.result())
            if (newScope)
                newScope.$apply();
        });
    }

    return self.stats.getStats();
};

function PexRTCStreamStatistics() {
    var self = this;

    self.lastPackets = 0;
    self.lastLost = 0;
    self.lastBytes = 0;
    self.lastTimestamp = 0;
    self.pctLost = [];
    self.info = {};
}

PexRTCStreamStatistics.prototype.getStats = function() {
    var self = this;
    return self.info;
};

PexRTCStreamStatistics.prototype.updateBWEStats = function(result) {
    var self = this;
    self.info['configured-bitrate'] = (result.stat('googTargetEncBitrate') / 1000).toFixed(1) + 'kbps';
};

PexRTCStreamStatistics.prototype.updatePacketLossStats = function(currentTotal, currentLost) {
    var self = this;
    var lostNow = currentLost - self.lastLost;
    var packetsNow = currentTotal - self.lastPackets;
    self.pctLost.push((lostNow * 100) / packetsNow);
    if (self.pctLost.length > 24) self.pctLost.splice(0, 1);
    var pctAverage = self.pctLost.reduce(function(a, b) { return a + b; }, 0);
    self.info['percentage-lost'] = (pctAverage / self.pctLost.length).toFixed(1) + '%';
};

PexRTCStreamStatistics.prototype.updateRxStats = function(result) {
    var self = this;

    self.info['packets-received'] = result.stat('packetsReceived');
    self.info['packets-lost'] = result.stat('packetsLost');
    self.info['percentage-lost'] = 0;
    self.info['bitrate'] = "unavailable";

    if (self.lastTimestamp > 0) {
        self.updatePacketLossStats(self.info['packets-received'], self.info['packets-lost']);
        var kbps = Math.round((result.stat('bytesReceived') - self.lastBytes) * 8 / (result.timestamp - self.lastTimestamp));
        self.info['bitrate'] = kbps + 'kbps';
    }

    if (result.stat('googFrameHeightReceived'))
        self.info['resolution'] = result.stat('googFrameWidthReceived') + 'x' + result.stat('googFrameHeightReceived');

    if (result.stat('googDecodeMs'))
        self.info['decode-delay'] = result.stat('googDecodeMs') + 'ms';

    self.lastTimestamp = result.timestamp;
    self.lastBytes = result.stat('bytesReceived');
    self.lastPackets = self.info['packets-received'];
    self.lastLost = self.info['packets-lost'];
};

PexRTCStreamStatistics.prototype.updateTxStats = function(result) {
    var self = this;

    self.info['packets-sent'] = result.stat('packetsSent');
    self.info['packets-lost'] = result.stat('packetsLost');
    self.info['percentage-lost'] = 0;
    self.info['bitrate'] = "unavailable";

    if (self.lastTimestamp > 0) {
        self.updatePacketLossStats(self.info['packets-sent'], self.info['packets-lost']);
        var kbps = Math.round((result.stat('bytesSent') - self.lastBytes) * 8 / (result.timestamp - self.lastTimestamp));
        self.info['bitrate'] = kbps + 'kbps';
    }

    if (result.stat('googFrameHeightSent'))
        self.info['resolution'] = result.stat('googFrameWidthSent') + 'x' + result.stat('googFrameHeightSent');

    self.lastTimestamp = result.timestamp;
    self.lastBytes = result.stat('bytesSent');
    self.lastPackets = self.info['packets-sent'];
    self.lastLost = self.info['packets-lost'];
};

function PexRTCStatistics() {
    var self = this;

    self.audio_out = new PexRTCStreamStatistics();
    self.audio_in = new PexRTCStreamStatistics();
    self.video_out = new PexRTCStreamStatistics();
    self.video_in = new PexRTCStreamStatistics();
}

PexRTCStatistics.prototype.updateStats = function(results) {
    var self = this;

    for (var i = 0; i < results.length; ++i) {
        if (self.statIsOfType(results[i], 'audio', 'send')) self.audio_out.updateTxStats(results[i]);
        else if (self.statIsOfType(results[i], 'audio', 'recv')) self.audio_in.updateRxStats(results[i]);
        else if (self.statIsOfType(results[i], 'video', 'send')) self.video_out.updateTxStats(results[i]);
        else if (self.statIsOfType(results[i], 'video', 'recv')) self.video_in.updateRxStats(results[i]);
        else if (self.statIsBandwidthEstimation(results[i])) self.video_out.updateBWEStats(results[i]);
    }
};

PexRTCStatistics.prototype.statIsBandwidthEstimation = function(result) {
    return result.type == 'VideoBwe';
};

PexRTCStatistics.prototype.statIsOfType = function(result, type, direction) {
    var self = this;
    tId = result.stat('transportId');
    return result.type == 'ssrc' && tId && tId.search(type) != -1 && result.id.search(direction) != -1;
};

PexRTCStatistics.prototype.getStats = function() {
    var self = this;

    return {'outgoing': {'audio': self.audio_out.getStats(),
                         'video': self.video_out.getStats()},
            'incoming': {'audio': self.audio_in.getStats(),
                         'video': self.video_in.getStats()}};
};
