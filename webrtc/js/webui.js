// **** WEBUI **** //

var video;
var presentation = null;
var flash_button = null;
var bandwidth;
var conf_uri;
var conference;
var videoURL;
var presWidth = 1280;
var presHeight = 720;
var presenter;
var pin;
var source = null;
var presenting = false;
var startTime = null;

var rtc = null;

// Allow standalone use
if (!trans) {
    trans = Array();
    trans['IID_BUTTON_MUTEAUDIO'] = "Mute Audio";
    trans['IID_BUTTON_UNMUTEAUDIO'] = "Unmute Audio";
    trans['IID_BUTTON_MUTEVIDEO'] = "Mute Video";
    trans['IID_BUTTON_UNMUTEVIDEO'] = "Unmute Video";
    trans['IID_BUTTON_FULLSCREEN'] = "Fullscreen";
    trans['IID_BUTTON_NOPRES'] = "No Presentation Active";
    trans['IID_BUTTON_SHOWPRES'] = "View Presentation";
    trans['IID_BUTTON_HIDEPRES'] = "Hide Presentation";
    trans['IID_BUTTON_SHOWSELF'] = "Show Selfview";
    trans['IID_BUTTON_HIDESELF'] = "Hide Selfview";
    trans['IID_BUTTON_SCREENSHARE'] = "Share Screen";
    trans['IID_BUTTON_STOPSHARE'] = "Stop Sharing";
    trans['IID_TITLE_HOSTS'] = "Hosts";
    trans['IID_TITLE_GUESTS'] = "Guests";
}

/* ~~~ PRESENTATION STUFF ~~~ */

function presentationClosed() {
    id_presentation.textContent = trans['IID_BUTTON_SHOWPRES'];
    rtc.stopPresentation();
    presentation = null;
}

function remotePresentationClosed(reason) {
    if (presentation) {
        if (reason) {
            alert(reason);
        }
        presentation.close()
    }
}

function checkForBlockedPopup() {
    id_presentation.classList.remove("inactive");
    if (!presentation || typeof presentation.innerHeight === "undefined" || (presentation.innerHeight === 0 && presentation.innerWidth === 0)) {
        // Popups blocked
        presentationClosed();
        flash_button = setInterval(function(){id_presentation.classList.toggle('active');}, 1000);
    } else {
        id_presentation.textContent = trans['IID_BUTTON_HIDEPRES'];
        presentation.document.title = decodeURIComponent(conference) + " presentation from " + presenter;
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
            id_presentation.classList.remove('active');
        }
        rtc.getPresentation();
    }
}

function loadPresentationStream(videoURL) {
    if (presentation) {
        presentation.presvideo.poster = "";
        presentation.presvideo.src = videoURL;
    }
}

function createPresentationWindow() {
    if (presentation == null) {
        presentation = window.open(document.location, 'presentation', 'height=' + presHeight + ',width=' + presWidth + ',location=no,menubar=no,toolbar=no,status=no');
        setTimeout(checkForBlockedPopup, 1000);

        if (presentation != null) {
            presentation.document.write("<html><body bgcolor='#333333'>");
            presentation.document.write("<div width='100%' height='100%' style='overflow:auto;position:absolute;left:0;right:0;top:0;bottom:0'>");
            presentation.document.write("<video id='presvideo' width='100%' autoplay='autoplay' poster='/static/webrtc/img/spinner.gif'/>");
            presentation.document.write("</div>");
            presentation.document.write("</body></html>");
            presentation.addEventListener('beforeunload', presentationClosed);
        }
    }
}

function presentationStartStop(setting, pres) {
    if (setting == true) {
        presenter = pres;
        if (presenting && id_presentation.classList.contains("inactive")) {
            id_presentation.textContent = trans['IID_BUTTON_SHOWPRES'];
            id_presentation.classList.remove("inactive");
        } else if (source == 'screen') {
            rtc.disconnect();
        } else {
            createPresentationWindow();
        }
    } else {
        if (presentation != null) {
            presentation.close();
        }
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
            id_presentation.classList.remove('active');
        }
        id_presentation.textContent = trans['IID_BUTTON_NOPRES'];
        id_presentation.classList.add("inactive");
    }
}

function togglePresentation() {
    if (presentation) {
        presentation.close();
    } else if (!id_presentation.classList.contains("inactive")) {
        createPresentationWindow();
    }
}

function goFullscreen() {
    if (!id_fullscreen.classList.contains("inactive")) {
        video.goFullscreen = ( video.webkitRequestFullscreen || video.mozRequestFullScreen );
        video.goFullscreen();
    }
}

function presentScreen() {
    if (!id_screenshare.classList.contains("inactive")) {
        if (!presenting) {
            id_screenshare.textContent = trans['IID_BUTTON_STOPSHARE'];
            rtc.present('screen');
            presenting = true;
        } else {
            rtc.present(null);
        }
    }
}

function unpresentScreen(reason) {
    if (reason) {
        alert(reason);
    }
    id_screenshare.textContent = trans['IID_BUTTON_SCREENSHARE'];
    presenting = false;
}

/* ~~~ MUTE AND HOLD/RESUME ~~~ */

function muteAudioStreams() {
    if (!id_muteaudio.classList.contains("inactive")) {
        muteAudio = rtc.muteAudio();
        id_muteaudio.classList.toggle('selected');
        if (muteAudio) {
            id_muteaudio.textContent = trans['IID_BUTTON_UNMUTEAUDIO'];
        } else {
            id_muteaudio.textContent = trans['IID_BUTTON_MUTEAUDIO'];
        }
    }
}

function muteVideoStreams() {
    if (!id_mutevideo.classList.contains("inactive")) {
        muteVideo = rtc.muteVideo();
        id_mutevideo.classList.toggle('selected');
        if (muteVideo) {
            id_mutevideo.textContent = trans['IID_BUTTON_UNMUTEVIDEO'];
        } else {
            id_mutevideo.textContent = trans['IID_BUTTON_MUTEVIDEO'];
        }
    }
}

function toggleSelfview() {
    if (!id_selfview.classList.contains("inactive")) {
        selfview.hidden = !selfview.hidden;
        if (selfview.hidden) {
            id_selfview.textContent = trans['IID_BUTTON_SHOWSELF'];
            id_selfview.classList.remove('selected');
            rosterlist.classList.remove('shorter');
        } else {
            id_selfview.textContent = trans['IID_BUTTON_HIDESELF'];
            id_selfview.classList.add('selected');
            rosterlist.classList.add('shorter');
        }
    }
}

function holdresume(setting) {
    if (setting === true) {
        video.src = "";
        video.poster = "/static/webrtc/img/OnHold.jpg";
        id_muteaudio.classList.add("inactive");
        id_mutevideo.classList.add("inactive");
    } else {
        video.poster = "";
        video.src = videoURL;
        if (presentation != null) {
            loadPresentation();
        }
        id_muteaudio.classList.remove("inactive");
        id_mutevideo.classList.remove("inactive");
    }
}

/* ~~~ ROSTER LIST ~~~ */

function updateRosterList(roster) {
    rosterlist.removeChild(rosterul);
    rosterul = document.createElement("ul");
    rosterlist.appendChild(rosterul);

    var state = "";
    if ('role' in roster[0]) {
        var h2 = document.createElement("h2");
        h2.innerHTML = trans['IID_TITLE_HOSTS'];
        rosterul.appendChild(h2);
        state = "HOSTS";
    }

    rosterheading.textContent = trans['IID_HEADING_ROSTER_LIST'] + " (" + roster.length + ")";

    for (var i = 0; i < roster.length; i++) {
        if (roster[i]['role'] == "unknown") {
            continue;
        } else if (roster[i]['role'] == "guest" && state == "HOSTS") {
            var h2 = document.createElement("h2");
            h2.innerHTML = trans['IID_TITLE_GUESTS'];
            rosterul.appendChild(h2);
            state = "GUESTS";
        }

        var li = document.createElement("li");
        if (roster[i]['display_name'] != "" && roster[i]['display_name'] != roster[i]['uri']) {
            var subtitle = document.createElement("p");
            subtitle.innerHTML = roster[i]['uri'];
            var surtitle = document.createElement("h3");
            surtitle.innerHTML = roster[i]['display_name'];
            if (roster[i]['is_presenting'] == "YES") {
                surtitle.classList.add("presenting");
            }
            li.appendChild(surtitle);
            li.appendChild(subtitle);
        } else {
            var surtitle = document.createElement("h3");
            surtitle.innerHTML = roster[i]['uri'];
            li.appendChild(surtitle);
            if (roster[i]['is_presenting'] == "YES") {
                surtitle.classList.add("presenting");
            }
        }

        rosterul.appendChild(li);
    }

    if (navigator.userAgent.indexOf("Chrome") != -1 && navigator.userAgent.indexOf("Mobile") == -1 && !source) {
        id_screenshare.classList.remove("inactive");
    }
}

/* ~~~ SETUP AND TEARDOWN ~~~ */

function cleanup(event) {
    video.src = "";
    if (presentation) {
        presentation.close();
    }
}

function finalise(event) {
    rtc.disconnect();
    cleanup();
}

function remoteDisconnect(reason) {
    cleanup();
    alert(reason);
    window.removeEventListener('beforeunload', finalise);
    window.location = "/webrtc/";
}

function handleError(reason) {
    if (!selfvideo.src && new Date() - startTime > 30000) {
        reason = "WebSocket connection error.";
    }
    remoteDisconnect(reason);
}

function doneSetup(url, pin_status) {
    if (url) {
        selfvideo.src = url;
    }
    console.log("PIN status: " + pin_status);
    rtc.connect(pin);
}

function connected(url) {
    if (source == 'screen') {
        video.poster = "/static/webrtc/img/screenshare.png";
    } else {
        video.poster = "";
        videoURL = url;
        video.src = videoURL;
        id_fullscreen.classList.remove("inactive");
    }
}

function callTransferred(alias) {
    console.log("Transferring to " + alias);
    video.src = "";
    video.poster = "/static/webrtc/img/spinner.gif";
}

function initialise(remoteServiceUri, userbw, name, userpin, req_source) {
    video = document.getElementById("video");
    console.log("Video: " + video);
    console.log("Bandwidth: " + userbw);

    pin = userpin;
    bandwidth = parseInt(userbw);
    source = req_source;

    rtc = new PexRTC();

    window.addEventListener('beforeunload', finalise);

    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = handleError;
    rtc.onDisconnect = remoteDisconnect;
    rtc.onHoldResume = holdresume;
    rtc.onRosterList = updateRosterList;
    rtc.onPresentation = presentationStartStop;
    //rtc.onPresentationReload = loadPresentation;
    rtc.onScreenshareStopped = unpresentScreen;
    rtc.onPresentationConnected = loadPresentationStream;
    rtc.onPresentationDisconnected = remotePresentationClosed;
    rtc.onCallTransfer = callTransferred;

    conf_uri = remoteServiceUri.substr(remoteServiceUri.lastIndexOf("/") + 1);
    querystr = conf_uri.indexOf("?");
    conference = conf_uri;
    if (querystr > 0) {
        conference = conference.substr(0, querystr);
    }
    console.log("Conference: " + conference);

    startTime = new Date();
    setTimeout(function() {
        rtc.makeCall(document.domain, conf_uri, name, bandwidth, source);
    }, 1000);
}
