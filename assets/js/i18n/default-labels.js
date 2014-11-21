'use strict';

/**
 * Default labels
 *
 */
var constantModule = angular.module('pexapp.translations.constants', []);

constantModule.constant('defaultTranslationValues', {
	TITLE: 'Pexip Infinity Connect',

	CONFERENCE_MENU: 'menu',
	CONFERENCE_DISCONNECT: 'disconnect',
	CONFERENCE_VIDEO: 'Video',

	CONFERENCE_ROSTER: 'Toggle roster',
	CONFERENCE_SEARCH_PARTICIPANTS: 'Search participants…',
	CONFERENCE_ADD_A_NEW_PARTICIPANT: 'Add a new participant',
	CONFERENCE_ABOUT_THIS_APP: 'About this app',

	CONFERENCE_MUTE_PARTICIPANT: 'Mute participant',
	CONFERENCE_UNMUTE_PARTICIPANT: 'Unmute participant',
	CONFERENCE_DISCONNECT_PARTICIPANT: 'Disconnect participant',
	CONFERENCE_DISCONNECT_PARTICIPANT_DIALOG: 'Do you want to disconnect {display_name}?',
	CONFERENCE_DISCONNECTED: 'You have been disconnected',
	CONFERENCE_IS_HOST: 'Host',

	CONFERENCE_OPTIONS: 'options',
	CONFERENCE_DIRECT_CALL_UNAVAILABLE_ROSTER_LIST: 'The roster list is not available for calls made directly to another person.',

	CONFERENCE_MUTED: ' / muted',
	CONFERENCE_PRESENTING: ' / presenting',
	CONFERENCE_PRESENTING_TOOLTIP: 'Presenting',

	CONFERENCE_HIDE_SELFVIEW: 'Hide selfview',
	CONFERENCE_SHOW_SELFVIEW: 'Show selfview',

	CONFERENCE_MUTE_MY_AUDIO: 'Disable my microphone',
	CONFERENCE_ENABLE_MY_AUDIO: 'Enable my microphone',

	CONFERENCE_HIDE_MY_VIDEO: 'Disable my camera',
	CONFERENCE_ENABLE_MY_VIDEO: 'Enable my camera',

	CONFERENCE_DISABLE_FULLSCREEN: 'Disable fullscreen',
	CONFERENCE_ENABLE_FULLSCREEN: 'Enable fullscreen',
	CONFERENCE_FULLSCREEN_FAILED: 'Your browser won\'t enter full screen mode for some unexpected reason.',

	CONFERENCE_STOP_SCREEN_SHARING: 'Stop screen sharing',
	CONFERENCE_PRESENT_SCREEN: 'Present screen',

	CONFERENCE_VIEW_PRESENTATION: 'View presentation',
	CONFERENCE_HIDE_PRESENTATION: 'Hide presentation',

	CONFERENCE_MESSAGE_LEAVE: 'Do you really want to leave the conference?',
	CONFERENCE_SHARING_CONTENT_AVAILABLE: 'A participant started sharing content. Would you like to view their presentation?',
	CONFERENCE_SHARING_CONTENT_NOW: 'A participant started sharing content. You are currently viewing their presentation',
	CONFERENCE_NO_PRESENTATION_AVAILABLE: 'No active presentation available',
	CONFERENCE_ADD_PARTICIPANT_DIALOG: 'Please enter the address to dial in the format name@domain.',
	CONFERENCE_SCREENSHARING_ONLY_AVAILABLE_GOOGLE_CHROME: 'Screensharing is only available in Google Chrome',
	CONFERENCE_SCREENSHARING_CURRENTLY_DISABLED: 'Screensharing is currently disabled',
	CONFERENCE_LOCKED: 'Conference locked',
	CONFERENCE_UNLOCKED: 'Conference unlocked',
	CONFERENCE_PARTICIPANT_BUZZ: 'Buzz',
	CONFERENCE_KEYPAD: 'Keypad',
	CONFERENCE_SCREENSHARE_MISSING: 'To share your screen, you must first install the Pexip Screensharing Extension. Would you like to do this now?',
	SCREENSHARE_EXTENSION_URL: 'https://chrome.google.com/webstore/detail/pexip-screensharing-exten/jmfbfggikgbdccejjilikgnfdjnpmlfe',

	KEYPAD_CLOSE: 'Close keypad',

	VIEW_HD_PRESENTATION: 'Do you want to start viewing HD presentation?',
	ALREADY_VIEWING_HD_PRESENTATION: 'You are currently viewing HD presentation',


	LOGIN_HEADING: 'Infinity Connect',
	LOGIN_HEADING_SELECT_ROLE: 'Select Role',
	LOGIN_LOGIN: 'Login',
	LOGIN_LABEL_PERSON_OR_CONFERENCE: 'Person or conference to dial',
	LOGIN_YOUR_NAME: 'Your name',
	LOGIN_PRESENTATION_TYPE: 'Call type',
	LOGIN_BANDWIDTH: 'Bandwidth',
	LOGIN_PRESENT_SCREEN_ONLY: 'Present screen only',
	LOGIN_PRESENT_AUDIO_ONLY: 'Audio only',
	LOGIN_ROSTER_ONLY: 'Roster only',
	LOGIN_JOIN: 'Join',
	LOGIN_ABOUT: 'About this app',
	LOGIN_ADVANCED: 'Advanced',
	LOGIN_ADVANCED_SHOW: '+ Advanced',
	LOGIN_ADVANCED_HIDE: '- Advanced',
	LOGIN_MICROPHONE: 'Microphone',
	LOGIN_CAMERA: 'Camera',
	LOGIN_MEDIA_DEFAULT: 'Default',
	LOGIN_MEDIA_NONE: 'None',

	LOGO: 'Pexip',

	LOBBY_JOIN_AS_GUEST: 'Join as Guest',
	LOBBY_JOIN_AS_HOST: 'Join as Host',
	LOBBY_ENTER_CONFERENCE_PIN: 'Enter the conference PIN',

	FIELD_REQUIRED: 'Required',

	DONT_ASK_AGAIN: 'Don\'t ask again.',

	NEXT: 'Next',
	JOIN: 'Join'
});
