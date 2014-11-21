/**
 * Network setting overrides
 */
window.NETWORK_SETTINGS = {
	/**
	 * @description  Conference node to point at. Defaults to current domain
	 *
	 * @const
	 *
	 * @type {String}
	 */
	RTC_NODE: '5.158.193.163',

	/**
	 * @description  bandwidth value in kbps to enable escalating image presentation to video
	 *
	 * @const
	 *
	 * @type {Int}
	 */
	ENABLE_VIDEO_PRESENTATION_AT_BANDWIDTH: 100,

	/**
	 * @description Use the new REST API instead of manual HTTP Requests
	 *
	 * @const
	 *
	 * @type {Boolean}
	 */
	USE_REST_API: true
};
