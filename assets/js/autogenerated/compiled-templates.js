angular.module('pexapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('assets/templates/conference-flash-flex.html',
    "<div class=\"flex__container\">\n" +
    "\n" +
    "  <div class=\"controls__independant controls__toggle\">\n" +
    "    <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"controls__item icon\"\n" +
    "      ng-click=\"controls.showSideBarClick();\"\n" +
    "      ng-class=\"{\n" +
    "        'icon__roster-hide': selfview.collapse,\n" +
    "        'icon__roster-show': !selfview.collapse,\n" +
    "        'expand': !selfview.collapse,\n" +
    "        'collapse': selfview.collapse }\">\n" +
    "      <span class=\"icon__label\">{{ 'CONFERENCE_ROSTER' | translate }}</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"flex__sidebar\"\n" +
    "    ng-class=\"{\n" +
    "      'has-selfview': selfview.active,\n" +
    "      'expand': !selfview.collapse,\n" +
    "      'collapse': selfview.collapse }\">\n" +
    "\n" +
    "    <div class=\"conference__details sidebar__item\">\n" +
    "\n" +
    "      <span ng-show=\"conference.locked\" class=\"conference__locked\" ng-click=\"controls.unlockConference();\">\n" +
    "        <i class=\"icon icon__locked\" title=\"{{ 'CONFERENCE_LOCKED' | translate }}\"></i>\n" +
    "        <span class=\"icon__label\">{{ 'CONFERENCE_LOCKED' | translate }}</span>\n" +
    "      </span>\n" +
    "\n" +
    "      <span ng-show=\"!conference.locked\" class=\"conference__unlocked\" ng-click=\"controls.lockConference();\">\n" +
    "        <i class=\"icon icon__unlocked\" title=\"{{ 'CONFERENCE_UNLOCKED' | translate }}\"></i>\n" +
    "        <span class=\"icon__label\">{{ 'CONFERENCE_UNLOCKED' | translate }}</span>\n" +
    "      </span>\n" +
    "\n" +
    "      <h1 class=\"conference__heading\" ng-click=\"menu.open('settings', $event)\">\n" +
    "        {{conference.id}}\n" +
    "      </h1>\n" +
    "\n" +
    "      <a title=\"{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}\" class=\"participant__add\" href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\">\n" +
    "        <i class=\"icon icon__participant-add\"></i>\n" +
    "        <span class=\"icon__label\">{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}</span>\n" +
    "      </a>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"roster\">\n" +
    "\n" +
    "      <div class=\"search__participants\">\n" +
    "        <input class=\"sidebar__item\" type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "        <i class=\"icon icon__search\"></i>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"filter\">\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"roster__wrapper\">\n" +
    "        <ul class=\"roster__list\">\n" +
    "          <li class=\"roster__item participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "            <div class=\"participant__name sidebar__item\">\n" +
    "              <i class=\"icon icon__buzz\" title=\"{{ 'CONFERENCE_PARTICIPANT_BUZZ' | translate }}\"></i>\n" +
    "\n" +
    "              <div class=\"participant__label\">{{ p.name }}</div>\n" +
    "\n" +
    "              <div class=\"participant__controls\">\n" +
    "\n" +
    "                <span class=\"participant__control participant__presenting participant__information\" ng-click=\"controls.presentationEscalate();\"  ng-show=\"p.is_presenting\">\n" +
    "                  <i class=\"icon icon__presenting\" title=\"{{ 'CONFERENCE_PRESENTING_TOOLTIP' | translate }}\"></i>\n" +
    "                  <span class=\"icon__label\">{{ 'CONFERENCE_PRESENTING_TOOLTIP' | translate }}</span>\n" +
    "                </span>\n" +
    "\n" +
    "                <a class=\"participant__control participant__mute participant__action\" href=\"\" ng-click=\"participant.mute(p)\" ng-show=\"user.isHost()\">\n" +
    "                  <span ng-show=\"!p.is_muted\">\n" +
    "                    <i class=\"icon icon__participant-mute\" title=\"{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}\"></i>\n" +
    "                    <span class=\"icon__label\">{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}</span>\n" +
    "                  </span>\n" +
    "                  <span ng-show=\"p.is_muted\">\n" +
    "                    <i class=\"icon icon__participant-enable\" title=\"{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}\"></i>\n" +
    "                    <span class=\"icon__label\">{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}</span>\n" +
    "                  </span>\n" +
    "                </a>\n" +
    "\n" +
    "                <a class=\"participant__control participant__disconnect participant__action\" href=\"\" ng-click=\"participant.disconnect(p)\" ng-show=\"user.isHost()\">\n" +
    "                  <i class=\"icon icon__participant-disconnect\" title=\"{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}\"></i>\n" +
    "                  <span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}</span>\n" +
    "                </a>\n" +
    "\n" +
    "              </div>\n" +
    "\n" +
    "            </div>\n" +
    "          </li>\n" +
    "\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"flex__main\">\n" +
    "    <div class=\"screen\" toggle-hover=\"hover\" toggle-overlaid=\"overlaid\" wait=\"5000\">\n" +
    "\n" +
    "      <div class=\"controls\">\n" +
    "\n" +
    "        <nav ng-hide=\"user.screenValue()\" class=\"screenbar\" role=\"navigation\"\n" +
    "          ng-class=\"{\n" +
    "            'presentation__screenbar': presentation.active}\">\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"selfview.toggle()\" ng-class=\"{ 'inactive': selfview.active == false }\">\n" +
    "            <span ng-show=\"selfview.active\">\n" +
    "              <i class=\"icon icon__selfview-hide\" title=\"{{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!selfview.active\">\n" +
    "              <i class=\"icon icon__selfview-show\" title=\"{{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"audio.toggle()\" ng-class=\"{ 'inactive': audio.active == false }\">\n" +
    "            <span ng-show=\"audio.active\">\n" +
    "              <i class=\"icon icon__mic-mute\" title=\"{{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!audio.active\">\n" +
    "              <i class=\"icon icon__mic-enable\" title=\"{{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"video.toggle()\" ng-class=\"{ 'inactive': video.active == false }\">\n" +
    "            <span ng-show=\"video.active\">\n" +
    "              <i class=\"icon icon__video-hide\" title=\"{{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!video.active\">\n" +
    "              <i class=\"icon icon__video-enable\" title=\"{{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"controls.versionOverlay()\">\n" +
    "            <i class=\"icon icon__about\" title=\"{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}\"></i>\n" +
    "            <span class=\"icon__label\">{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}</span>\n" +
    "          </a>\n" +
    "\n" +
    "          <div class=\"controls__item controls__disconnect\">\n" +
    "            <button title=\"Disconnect\" class=\"controls__item icon icon__disconnect\" ng-click=\"controls.disconnect('../')\">\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT' | translate }}</span>\n" +
    "            </button>\n" +
    "          </div>\n" +
    "\n" +
    "        </nav>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <figure\n" +
    "        class=\"stage stage__main video\"\n" +
    "        ng-class=\"{\n" +
    "          'stage--max': !presentation.maximised,\n" +
    "          'stage--min': presentation.maximised,\n" +
    "          'presentation--active': presentation.active,\n" +
    "          'presentation--inactive': !presentation.active }\">\n" +
    "\n" +
    "          <div swf-object replace-id=\"flashContent\" src=\"assets/flash/PexVideo.swf\" width=\"100%\" height=\"100%\"></div>\n" +
    "          <div id=\"flashContent\">\n" +
    "            <p>\n" +
    "              To view this page ensure that Adobe Flash Player version 11.1.0 or greater is installed.\n" +
    "            </p>\n" +
    "            <!--\n" +
    "              var pageHost = ((document.location.protocol == \"https:\") ? \"https://\" : \"http://\");\n" +
    "              document.write(\"<a href='http://www.adobe.com/go/getflashplayer'><img src='\"\n" +
    "              + pageHost + \"www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>\" );\n" +
    "            -->\n" +
    "          </div>\n" +
    "      </figure>\n" +
    "\n" +
    "      <figure\n" +
    "        class=\"presentation video\"\n" +
    "        ng-show=\"presentation.active\"\n" +
    "        ng-class=\"{\n" +
    "          'presentation--max': presentation.maximised,\n" +
    "          'presentation--min': !presentation.maximised,\n" +
    "          'centered': presentation.maximised }\">\n" +
    "\n" +
    "        <img\n" +
    "          class=\"presentation__image presentation__child centered\"\n" +
    "          ng-click=\"presentation.toggleView('presentation');\"\n" +
    "          ng-show=\"presentation.showImage\"\n" +
    "          ng-src=\"{{ presentation.imageSrc }}\"\n" +
    "          ng-class=\"{\n" +
    "            'active': !presentation.maximised,\n" +
    "            'inactive': presentation.maximised }\"\n" +
    "          poster=\"assets/images/spinner.gif\" />\n" +
    "        <video\n" +
    "          class=\"presentation__video presentation__child centered\"\n" +
    "          width=\"100%\"\n" +
    "          ng-show=\"!presentation.showImage\"\n" +
    "          ng-click=\"presentation.toggleView('presentation');\"\n" +
    "          id=\"presentation\"\n" +
    "          autoplay=\"autoplay\"\n" +
    "          poster=\"assets/images/spinner.gif\"\n" +
    "          ng-class=\"{\n" +
    "            'active': !presentation.maximised,\n" +
    "            'inactive': presentation.maximised }\" />\n" +
    "      </figure>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div popup-container items=\"popupList\"></div>\n" +
    "  <div popup-container items=\"dialogList\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"disconnect\"></div>\n"
  );


  $templateCache.put('assets/templates/conference-flash-merge.html',
    "<div ng-click=\"menu.close()\" resizable>\n" +
    "<div class=\"screen-controls\">\n" +
    "  <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"videoToggle icon icon__show-roster\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\">{{ 'CONFERENCE_ROSTER' | translate }}</span></button>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<aside class=\"sidebar\" ng-class=\"{'has-selfview': use_native_selfview && selfview.active, collapse: use_native_selfview && selfview.collapse }\">\n" +
    "  <div class=\"topbar\">\n" +
    "    <h1 class=\"conference\" ng-click=\"menu.toggle('settings', $event)\">{{conference.id}}</h1>\n" +
    "    <div class=\"settings\">\n" +
    "\n" +
    "      <button title=\"Menu\" class=\"icon icon__menu\" ng-click=\"menu.toggle('settings', $event)\"><span class=\"icon__label\">{{ 'CONFERENCE_MENU' | translate }}</span></button>\n" +
    "\n" +
    "      <ul ng-show=\"menu.isOpen('settings')\" class=\"settings__menu\" id=\"settings\">\n" +
    "        <li ng-show=\"presentation.active && presentation.enableVideoPresentation && presentation.showImage\"><a href=\"\" ng-click=\"presentation.elevateToVideo();\">View HD presentation</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.en()\">English mode</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.debug()\">Debug mode</a></li>\n" +
    "\n" +
    "        <li><a href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\">{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}</a></li>\n" +
    "        <li><a href=\"\" ng-click=\"controls.versionOverlay()\">{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}</a></li>\n" +
    "\n" +
    "        <li><a href=\"\" ng-click=\"controls.dtmfVisible = !!!controls.dtmfVisible\">Show/hide keypad</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <button title=\"View Video\" class=\"videoToggle icon icon__show-video\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\">{{ 'CONFERENCE_VIDEO' | translate }}</span></button>\n" +
    "\n" +
    "      <button title=\"Disconnect\" class=\"icon icon__disconnect\" ng-click=\"controls.disconnect('./')\"><span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT' | translate }}</span></button>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div ng-hide=\"conference.isGateway\">\n" +
    "    <div class=\"participantsbar\">\n" +
    "      <input type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "      <i class=\"icon icon__search\"></i>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"participants\">\n" +
    "      <ul>\n" +
    "        <li class=\"participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "          <div class=\"participant__name\">{{p.name}}</a>\n" +
    "            <div class=\"participant__role\">\n" +
    "              {{p.role}}\n" +
    "              <span ng-show=\"p.is_muted\">{{ 'CONFERENCE_MUTED' | translate }}</span>\n" +
    "              <span ng-show=\"p.is_presenting\">{{ 'CONFERENCE_PRESENTING' | translate }}</span>\n" +
    "            </div>\n" +
    "            <a ng-show=\"user.isHost()\" class=\"participant__menuToggle icon icon__menu-toggle\" href=\"\" ng-click=\"menu.open('participant__' + p.uuid, $event)\"><span class=\"icon__label\">{{ 'CONFERENCE_OPTIONS' | translate }}</span></a>\n" +
    "            <ul ng-show=\"menu.isOpen('participant__' + p.uuid)\" class=\"settings__menu participant__menu\">\n" +
    "              <li>\n" +
    "                <a href=\"\" ng-click=\"participant.mute(p)\">\n" +
    "                  <span ng-show=\"!p.is_muted\">{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}</span>\n" +
    "                  <span ng-show=\"p.is_muted\">{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}</span>\n" +
    "                </a>\n" +
    "              </li>\n" +
    "              <li><a href=\"\" ng-click=\"participant.disconnect(p)\">{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}</a></li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"sidebar__message\" ng-show=\"conference.isGateway\">\n" +
    "      <p>{{ 'CONFERENCE_DIRECT_CALL_UNAVAILABLE_ROSTER_LIST' | translate }}</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"selfview\" ng-class=\"{visible: use_native_selfview && selfview.active}\" ng-click=\"selfview.hide()\">\n" +
    "      <figure>\n" +
    "        <video width=\"100%\" id=\"selfview\" muted=\"true\" autoplay=\"autoplay\" poster=\"assets/images/spinner.gif\" />\n" +
    "      </figure>\n" +
    "    </div>\n" +
    "</aside>\n" +
    "\n" +
    "<div class=\"screen\" toggle-hover=\"hover\" toggle-overlaid=\"overlaid\" wait=\"5000\">\n" +
    "\n" +
    "\n" +
    "  <figure class=\"video\" ng-show=\"!presentation.active\">\n" +
    "     <!--  <video class=\"centered\" width=\"100%\" id=\"video\" autoplay=\"autoplay\" poster=\"assets/images/spinner.gif\"/> -->\n" +
    "      <div swf-object replace-id=\"flashContent\" src=\"assets/flash/PexVideo.swf\" width=\"100%\" height=\"100%\" />\n" +
    "      <div id=\"flashContent\">\n" +
    "              <p>\n" +
    "                      To view this page ensure that Adobe Flash Player version\n" +
    "                      11.1.0 or greater is installed.\n" +
    "              </p>\n" +
    "              <!--\n" +
    "                      var pageHost = ((document.location.protocol == \"https:\") ? \"https://\" : \"http://\");\n" +
    "                      document.write(\"<a href='http://www.adobe.com/go/getflashplayer'><img src='\"\n" +
    "                                                      + pageHost + \"www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>\" );\n" +
    "            -->\n" +
    "      </div>\n" +
    "\n" +
    "  </figure>\n" +
    "\n" +
    "  <figure class=\"video centered\" ng-show=\"presentation.active\">\n" +
    "      <video class=\"centered\" width=\"100%\" id=\"presentation\" autoplay=\"autoplay\" poster=\"../assets/images/spinner.gif\"/>\n" +
    "  </figure>\n" +
    "\n" +
    "<!--\n" +
    "  <figure\n" +
    "    class=\"stage stage__main video\"\n" +
    "    ng-class=\"{\n" +
    "      'stage--max': !presentation.maximised,\n" +
    "      'stage--min': presentation.maximised,\n" +
    "      'presentation--active': presentation.active,\n" +
    "      'presentation--inactive': !presentation.active }\">\n" +
    "    <video\n" +
    "      class=\"video centered stage__child\"\n" +
    "      width=\"100%\"\n" +
    "      id=\"video\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-click=\"presentation.toggleView('video');\"\n" +
    "      ng-class=\"{ 'active': presentation.maximised, 'inactive': !presentation.maximised }\" />\n" +
    "  </figure>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <figure\n" +
    "    class=\"presentation video\"\n" +
    "    ng-show=\"presentation.active\"\n" +
    "    ng-class=\"{ 'presentation--max': presentation.maximised, 'presentation--min': !presentation.maximised, 'centered': presentation.maximised }\">\n" +
    "\n" +
    "    <img\n" +
    "      class=\"presentation__image presentation__child centered\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      ng-show=\"presentation.showImage\"\n" +
    "      ng-src=\"{{ presentation.imageSrc }}\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\"\n" +
    "      poster=\"assets/images/spinner.gif\" />\n" +
    "    <video\n" +
    "      class=\"presentation__video presentation__child centered\"\n" +
    "      width=\"100%\"\n" +
    "      ng-show=\"!presentation.showImage\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      id=\"presentation\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\" />\n" +
    "  </figure> -->\n" +
    "\n" +
    "\n" +
    "  <nav ng-hide=\"user.screenValue()\" class=\"screenbar\" ng-class=\"{'presentation__screenbar': presentation.active}\" role=\"navigation\">\n" +
    "    <ul class=\"grid--full\">\n" +
    "      <li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"selfview-icon\" ng-class=\"{inactive: selfview.active == false}\" href=\"\" ng-click=\"selfview.toggle()\">\n" +
    "          <span ng-show=\"selfview.active\"><i class=\"icon icon__hide-selfview\"></i> {{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}</span>\n" +
    "          <span ng-show=\"!selfview.active\"><i class=\"icon icon__show-selfview\"></i> {{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "   --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"audio-icon\" ng-class=\"{inactive: audio.active == false}\" href=\"\" ng-click=\"audio.toggle()\">\n" +
    "          <span ng-show=\"audio.active\"><i class=\"icon icon__mute-my-audio\"></i> {{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}</span>\n" +
    "          <span ng-show=\"!audio.active\"><i class=\"icon icon__enable-my-audio\"></i> {{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "      --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"video-icon\" ng-class=\"{inactive: video.active == false}\" href=\"\" ng-click=\"video.toggle()\">\n" +
    "          <span ng-show=\"video.active\"><i class=\"icon icon__hide-my-video\"></i> {{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}</span>\n" +
    "          <span ng-show=\"!video.active\"><i class=\"icon icon__enable-my-video\"></i> {{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"fullscreen-icon\" ng-class=\"{inactive: fullscreen.active == false}\" href=\"\" ng-click=\"fullscreen.toggle()\">\n" +
    "          <span ng-show=\"fullscreen.active\"><i class=\"icon icon__disable-fullscreen\"></i> {{ 'CONFERENCE_DISABLE_FULLSCREEN' | translate }}</span>\n" +
    "          <span ng-show=\"!fullscreen.active\"><i class=\"icon icon__enable-fullscreen\"></i> {{ 'CONFERENCE_ENABLE_FULLSCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "    --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-class=\"screenshare.className()\" class=\"screen-icon\" href=\"\" ng-click=\"screenshare.toggle()\">\n" +
    "           <span ng-show=\"screenshare.active\"><i class=\"icon icon__stop-screen-sharing\"></i> {{ 'CONFERENCE_STOP_SCREEN_SHARING' | translate }}</span>\n" +
    "          <span ng-show=\"!screenshare.active\"><i class=\"icon icon__present-screen\"></i> {{ 'CONFERENCE_PRESENT_SCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-show=\"!presentation.active\" class=\"presentation-icon\" ng-class=\"{disabled: presentation.available == false}\" href=\"\" ng-click=\"presentation.open()\">\n" +
    "          <span><i class=\"icon icon__view-presentation\"></i> {{ 'CONFERENCE_VIEW_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "        <a ng-show=\"presentation.active\" class=\"presentation-icon\" href=\"\" ng-click=\"presentation.close()\">\n" +
    "          <span><i class=\"icon icon__hide-presentation\"></i> {{ 'CONFERENCE_HIDE_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <!--\n" +
    "     -->\n" +
    "    </ul>\n" +
    "  </nav>\n" +
    "</div>\n" +
    "\n" +
    "<!-- container to inject popups into the DOM -->\n" +
    "<div popup-container items=\"popupList\"></div>\n" +
    "\n" +
    "<!-- DTMF keypad -->\n" +
    "<div dtmf class=\"key-pad-container\" ng-show=\"controls.dtmfVisible\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/conference-flash.html',
    "<div ng-click=\"menu.close()\" resizable>\n" +
    "\n" +
    "    <div class=\"screen-controls\">\n" +
    "        <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"videoToggle icon icon__show-roster\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\">{{ 'CONFERENCE_ROSTER' | translate }}</span></button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <aside class=\"sidebar\">\n" +
    "        <div class=\"topbar\">\n" +
    "            <h1 class=\"conference\" ng-click=\"menu.open('settings', $event)\">{{conference.id}}</h1>\n" +
    "            <div class=\"settings\">\n" +
    "\n" +
    "                <button class=\"button menu__button\" href=\"\" ng-click=\"menu.open('settings', $event)\">menu</button>\n" +
    "\n" +
    "                <ul ng-show=\"menu.isOpen('settings')\" class=\"settings__menu\" id=\"settings\">\n" +
    "                    <li><a href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\">Add a new participant</a></li>\n" +
    "                    <li><a href=\"\" ng-click=\"versionOverlay()\">About this app</a></li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <button title=\"Disconnect\" class=\"button disconnect__button\" ng-click=\"user.disconnect('../')\">disconnect</button>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-hide=\"conference.isGateway\">\n" +
    "            <div class=\"participantsbar\">\n" +
    "                <input type=\"search\" ng-model=\"search\" placeholder=\"Search participants…\" />\n" +
    "            </div>\n" +
    "            <div class=\"participants\">\n" +
    "                <ul>\n" +
    "                    <li class=\"participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "                        <div class=\"participant__name\">{{p.name}}</a>\n" +
    "                        <div class=\"participant__role\">\n" +
    "                            {{p.role}}\n" +
    "                            <span ng-show=\"p.is_muted\"> / muted</span>\n" +
    "                            <span ng-show=\"p.is_presenting\"> / presenting</span>\n" +
    "                        </div>\n" +
    "                        <a ng-show=\"user.isHost()\" class=\"particicpant__menuToggle\" href=\"\" ng-click=\"menu.open('participant__' + p.uuid, $event)\">options</a>\n" +
    "                        <ul ng-show=\"menu.isOpen('participant__' + p.uuid)\" class=\"settings__menu participant__menu\">\n" +
    "                            <li>\n" +
    "                                <a href=\"\" ng-click=\"participant.mute(p)\">\n" +
    "                                    <span ng-show=\"!p.is_muted\">Mute participant</span>\n" +
    "                                    <span ng-show=\"p.is_muted\">Unmute participant</span>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li><a href=\"\" ng-click=\"participant.disconnect(p)\">Disconnect participant</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"sidebar__message\" ng-show=\"conference.isGateway\">\n" +
    "            <p>The roster list is not available for calls made directly to another person.</p>\n" +
    "        </div>\n" +
    "    </aside>\n" +
    "\n" +
    "        <div class=\"screen\">\n" +
    "\n" +
    "            <figure class=\"video\" ng-show=\"!presentation.active\">\n" +
    "                <div swf-object replace-id=\"flashContent\" src=\"assets/flash/PexVideo.swf\" width=\"100%\" height=\"100%\" />\n" +
    "                <div id=\"flashContent\">\n" +
    "                        <p>\n" +
    "                                To view this page ensure that Adobe Flash Player version\n" +
    "                                11.1.0 or greater is installed.\n" +
    "                        </p>\n" +
    "                        <!--\n" +
    "                                var pageHost = ((document.location.protocol == \"https:\") ? \"https://\" : \"http://\");\n" +
    "                                document.write(\"<a href='http://www.adobe.com/go/getflashplayer'><img src='\"\n" +
    "                                                                + pageHost + \"www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>\" );\n" +
    "                      -->\n" +
    "                </div>\n" +
    "\n" +
    "            </figure>\n" +
    "\n" +
    "            <figure class=\"video centered\" ng-show=\"presentation.active\">\n" +
    "                <video class=\"centered\" width=\"100%\" id=\"presentation\" autoplay=\"autoplay\" poster=\"../assets/images/spinner.gif\"/>\n" +
    "            </figure>\n" +
    "\n" +
    "            <nav ng-hide=\"user.screen()\" class=\"screenbar\" role=\"navigation\">\n" +
    "                <ul class=\"grid--full\">\n" +
    "                    <li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a class=\"selfview-icon\" ng-class=\"{inactive: selfview.active == false}\" href=\"\" ng-click=\"selfview.toggle()\">\n" +
    "                            <span ng-show=\"selfview.active\">Hide selfview</span>\n" +
    "                            <span ng-show=\"!selfview.active\">Show selfview</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "             --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a class=\"audio-icon\" ng-class=\"{inactive: audio.active == false}\" href=\"\" ng-click=\"audio.toggle()\">\n" +
    "                            <span ng-show=\"audio.active\">Mute my audio</span>\n" +
    "                            <span ng-show=\"!audio.active\">Enable my audio</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "             --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a class=\"video-icon\" ng-class=\"{inactive: video.active == false}\" href=\"\" ng-click=\"video.toggle()\">\n" +
    "                            <span ng-show=\"video.active\">Hide my video</span>\n" +
    "                            <span ng-show=\"!video.active\">Enable my video</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "             --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a class=\"fullscreen-icon\" ng-class=\"{inactive: fullscreen.active == false}\" href=\"\" ng-click=\"fullscreen.toggle()\">\n" +
    "                            <span ng-show=\"fullscreen.active\">Disable fullscreen</span>\n" +
    "                            <span ng-show=\"!fullscreen.active\">Enable fullscreen</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "             --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a ng-class=\"screenshare.className()\" class=\"screen-icon\" href=\"\" ng-click=\"screenshare.toggle()\">\n" +
    "                            <span ng-show=\"screenshare.active\">Stop screen sharing</span>\n" +
    "                            <span ng-show=\"!screenshare.active\">Present screen</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "             --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "                        <a ng-show=\"!presentation.active\" class=\"presentation-icon\" ng-class=\"{disabled: presentation.available == false}\" href=\"\" ng-click=\"presentation.open()\">\n" +
    "                            <span>View presentation</span>\n" +
    "                        </a>\n" +
    "                        <a ng-show=\"presentation.active\" class=\"presentation-icon\" href=\"\" ng-click=\"presentation.close()\">\n" +
    "                            <span>Hide presentation</span>\n" +
    "                        </a>\n" +
    "                    </li><!--\n" +
    "         --></ul>\n" +
    "            </nav>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/conference-flex.html',
    "<div class=\"flex__container\">\n" +
    "\n" +
    "  <div class=\"controls__independant controls__toggle\">\n" +
    "    <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"controls__item icon\"\n" +
    "      ng-click=\"controls.showSideBarClick();\"\n" +
    "      ng-class=\"{\n" +
    "        'icon__roster-hide': selfview.collapse,\n" +
    "        'icon__roster-show': !selfview.collapse,\n" +
    "        'expand': !selfview.collapse,\n" +
    "        'collapse': selfview.collapse }\">\n" +
    "      <span class=\"icon__label\">{{ 'CONFERENCE_ROSTER' | translate }}</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"flex__sidebar\"\n" +
    "    ng-class=\"{\n" +
    "      'has-selfview': selfview.active,\n" +
    "      'expand': !selfview.collapse,\n" +
    "      'collapse': selfview.collapse }\">\n" +
    "\n" +
    "    <div class=\"conference__details sidebar__item\">\n" +
    "\n" +
    "      <div ng-hide=\"conference.isGateway\">\n" +
    "        <span ng-show=\"conference.locked\" class=\"conference__locked\" ng-click=\"controls.unlockConference();\">\n" +
    "          <i class=\"icon icon__locked\" title=\"{{ 'CONFERENCE_LOCKED' | translate }}\"></i>\n" +
    "          <span class=\"icon__label\">{{ 'CONFERENCE_LOCKED' | translate }}</span>\n" +
    "        </span>\n" +
    "\n" +
    "        <span ng-show=\"!conference.locked\" class=\"conference__unlocked\" ng-click=\"controls.lockConference();\">\n" +
    "          <i class=\"icon icon__unlocked\" title=\"{{ 'CONFERENCE_UNLOCKED' | translate }}\"></i>\n" +
    "          <span class=\"icon__label\">{{ 'CONFERENCE_UNLOCKED' | translate }}</span>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <h1 class=\"conference__heading\" ng-click=\"menu.open('settings', $event)\">\n" +
    "        {{conference.id}}\n" +
    "      </h1>\n" +
    "\n" +
    "      <a title=\"{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}\" class=\"participant__add\" href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\">\n" +
    "        <i class=\"icon icon__participant-add\"></i>\n" +
    "        <span class=\"icon__label\">{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}</span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"roster\">\n" +
    "\n" +
    "      <div class=\"search__participants\">\n" +
    "        <input class=\"sidebar__item\" type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "        <i class=\"icon icon__search\"></i>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"filter\">\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"roster__wrapper\">\n" +
    "        <div class=\"box\">\n" +
    "          <ul class=\"roster__list\" roster-height ng-style=\"{ height: rosterHeight }\">\n" +
    "\n" +
    "            <li class=\"roster__item participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "              <div class=\"participant__name sidebar__item\">\n" +
    "                <!-- <i class=\"icon icon__buzz\" title=\"{{ 'CONFERENCE_PARTICIPANT_BUZZ' | translate }}\"></i> -->\n" +
    "\n" +
    "                <span class=\"participant__label\">{{ p.name }}</span>\n" +
    "\n" +
    "                <div class=\"participant__controls\">\n" +
    "\n" +
    "                  <span class=\"participant__control participant__presenting participant__information\" ng-click=\"controls.presentationEscalate();\" ng-show=\"p.is_presenting\">\n" +
    "                    <i class=\"participant__icon icon icon__presenting\" title=\"{{ 'CONFERENCE_PRESENTING_TOOLTIP' | translate }}\"></i>\n" +
    "                    <span class=\"icon__label\">{{ 'CONFERENCE_PRESENTING_TOOLTIP' | translate }}</span>\n" +
    "                  </span>\n" +
    "\n" +
    "                  <a class=\"participant__control participant__mute participant__action\" href=\"\" ng-click=\"participant.mute(p)\" ng-show=\"user.isHost()\">\n" +
    "                    <span ng-show=\"!p.is_muted\">\n" +
    "                      <i class=\"participant__icon icon icon__participant-mute\" title=\"{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}\"></i>\n" +
    "                      <span class=\"icon__label\">{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}</span>\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"p.is_muted\">\n" +
    "                      <i class=\"participant__icon icon icon__participant-enable\" title=\"{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}\"></i>\n" +
    "                      <span class=\"icon__label\">{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}</span>\n" +
    "                    </span>\n" +
    "                  </a>\n" +
    "\n" +
    "                  <a class=\"participant__control participant__disconnect participant__action\" href=\"\" ng-click=\"participant.disconnect(p)\" ng-show=\"user.isHost()\">\n" +
    "                    <i class=\"participant__icon icon icon__participant-disconnect\" title=\"{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}\"></i>\n" +
    "                    <span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}</span>\n" +
    "                  </a>\n" +
    "\n" +
    "                  <!-- <span class=\"participant__control participant__host participant__information\" ng-show=\"user.isHost()\">\n" +
    "                    <i class=\"participant__icon icon icon__host\" title=\"{{ 'CONFERENCE_IS_HOST' | translate }}\"></i>\n" +
    "                    <span class=\"icon__label\">{{ 'CONFERENCE_IS_HOST' | translate }}</span>\n" +
    "                  </span> -->\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "              </div>\n" +
    "            </li>\n" +
    "\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"flex__main\">\n" +
    "    <div class=\"selfview\"\n" +
    "      ng-class=\"{\n" +
    "        'visible': selfview.active}\"\n" +
    "        ng-click=\"selfview.hide()\">\n" +
    "      <figure>\n" +
    "        <video width=\"100%\" id=\"selfview\" muted=\"true\" autoplay=\"autoplay\" poster=\"assets/images/spinner.gif\" />\n" +
    "      </figure>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"screen\" toggle-hover=\"hover\" toggle-overlaid=\"overlaid\" wait=\"5000\">\n" +
    "      <div class=\"controls\">\n" +
    "\n" +
    "        <nav class=\"screenbar\" role=\"navigation\"\n" +
    "          ng-class=\"{\n" +
    "            'presentation__screenbar': presentation.active}\">\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"selfview.toggle()\" ng-class=\"{ 'inactive': selfview.active == false }\">\n" +
    "            <span ng-show=\"selfview.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__selfview-hide\" title=\"{{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!selfview.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__selfview-show\" title=\"{{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-hide=\"user.screenValue()\" ng-click=\"audio.toggle()\" ng-class=\"{ 'inactive': audio.active == false }\">\n" +
    "            <span ng-show=\"audio.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__mic-mute\" title=\"{{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!audio.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__mic-enable\" title=\"{{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-hide=\"user.screenValue()\" ng-click=\"video.toggle()\" ng-class=\"{ 'inactive': video.active == false }\">\n" +
    "            <span ng-show=\"video.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__video-hide\" title=\"{{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!video.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__video-enable\" title=\"{{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-hide=\"user.screenValue()\" ng-click=\"fullscreen.toggle()\" ng-class=\"{ 'inactive': fullscreen.active == false }\">\n" +
    "            <span ng-show=\"fullscreen.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__fullscreen-disable\" title=\"{{ 'CONFERENCE_DISABLE_FULLSCREEN' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_DISABLE_FULLSCREEN' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!fullscreen.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__fullscreen-enable\" title=\"{{ 'CONFERENCE_ENABLE_FULLSCREEN' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_ENABLE_FULLSCREEN' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" ng-hide=\"!hasChromeWebstore || user.screenValue()\" ng-class=\"screenshare.className()\" href=\"\" ng-click=\"screenshare.toggle()\">\n" +
    "             <span ng-show=\"screenshare.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__screen-stop-sharing\" title=\"{{ 'CONFERENCE_STOP_SCREEN_SHARING' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_STOP_SCREEN_SHARING' | translate }}</span>\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"!screenshare.active\">\n" +
    "              <i class=\"icon screenbar-icon icon__screen-present\" title=\"{{ 'CONFERENCE_PRESENT_SCREEN' | translate }}\"></i>\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_PRESENT_SCREEN' | translate }}</span>\n" +
    "            </span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-click=\"controls.dtmfVisible = !!!controls.dtmfVisible\">\n" +
    "            <i class=\"icon screenbar-icon icon__keypad\" title=\"{{ 'CONFERENCE_KEYPAD' | translate }}\"></i>\n" +
    "            <span class=\"icon__label\">{{ 'CONFERENCE_KEYPAD' | translate }}</span>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"controls__item\" href=\"\" ng-hide=\"isDesktopClient\" ng-click=\"controls.versionOverlay()\">\n" +
    "            <i class=\"icon screenbar-icon icon__about\" title=\"{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}\"></i>\n" +
    "            <span class=\"icon__label\">{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}</span>\n" +
    "          </a>\n" +
    "\n" +
    "          <div class=\"controls__item controls__disconnect\">\n" +
    "            <button title=\"Disconnect\" class=\"controls__item icon icon__disconnect\" ng-click=\"controls.disconnect('./')\">\n" +
    "              <span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT' | translate }}</span>\n" +
    "            </button>\n" +
    "          </div>\n" +
    "\n" +
    "        </nav>\n" +
    "\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <figure\n" +
    "        class=\"stage stage__main video\"\n" +
    "        ng-class=\"{\n" +
    "          'stage--max': !presentation.maximised,\n" +
    "          'stage--min': presentation.maximised,\n" +
    "          'presentation--active': presentation.active,\n" +
    "          'presentation--inactive': !presentation.active,\n" +
    "          'stage-audio-only': audioOnlyResolved && callConnected }\">\n" +
    "        <video\n" +
    "          class=\"video centered stage__child\"\n" +
    "          width=\"100%\"\n" +
    "          id=\"video\"\n" +
    "          autoplay=\"autoplay\"\n" +
    "          poster=\"assets/images/spinner.gif\"\n" +
    "          ng-click=\"presentation.toggleView('video');\"\n" +
    "          ng-class=\"{\n" +
    "            'active': presentation.maximised,\n" +
    "            'inactive': !presentation.maximised }\" />\n" +
    "      </figure>\n" +
    "\n" +
    "      <figure\n" +
    "        class=\"presentation video\"\n" +
    "        ng-show=\"presentation.active\"\n" +
    "        ng-class=\"{\n" +
    "          'presentation--max': presentation.maximised,\n" +
    "          'presentation--min': !presentation.maximised,\n" +
    "          'centered': presentation.maximised }\">\n" +
    "\n" +
    "        <img\n" +
    "          class=\"presentation__image presentation__child centered\"\n" +
    "          ng-click=\"presentation.toggleView('presentation');\"\n" +
    "\n" +
    "          ng-src=\"{{ presentation.imageSrc }}\"\n" +
    "          ng-class=\"{\n" +
    "            'active': !presentation.maximised,\n" +
    "            'inactive': presentation.maximised }\"\n" +
    "          poster=\"assets/images/spinner.gif\" />\n" +
    "        <video\n" +
    "          class=\"presentation__video presentation__child centered\"\n" +
    "          width=\"100%\"\n" +
    "          ng-show=\"!presentation.showImage\"\n" +
    "          ng-click=\"presentation.toggleView('presentation');\"\n" +
    "          id=\"presentation\"\n" +
    "          autoplay=\"autoplay\"\n" +
    "          poster=\"assets/images/spinner.gif\"\n" +
    "          ng-class=\"{\n" +
    "            'active': !presentation.maximised,\n" +
    "            'inactive': presentation.maximised }\" />\n" +
    "      </figure>\n" +
    "    </div>\n" +
    "\n" +
    "    <div popup-container items=\"popupList\"></div>\n" +
    "    <div popup-container items=\"dialogList\"></div>\n" +
    "\n" +
    "    <!-- DTMF keypad -->\n" +
    "    <div dtmf class=\"key-pad-container\" ng-show=\"controls.dtmfVisible\"></div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"disconnect\"></div>\n"
  );


  $templateCache.put('assets/templates/conference-roster.html',
    "<div ng-click=\"menu.close()\" >\n" +
    "  <aside class=\"sidebar\" style=\"width: 100%; box-shadow: rgba(0,0,0,0.1) 0 2px 2px;\" ng-class=\"{'has-selfview': selfview.active, collapse: selfview.collapse }\">\n" +
    "    <div class=\"topbar\">\n" +
    "      <h1 class=\"conference\" ng-click=\"menu.toggle('settings', $event)\">{{conference.id}}</h1>\n" +
    "      <div class=\"settings\">\n" +
    "\n" +
    "        <button title=\"Menu\" class=\"icon icon__menu\" ng-click=\"menu.toggle('settings', $event)\"><span class=\"icon__label\" translate>CONFERENCE_MENU</span></button>\n" +
    "\n" +
    "        <ul ng-show=\"menu.isOpen('settings')\" class=\"settings__menu\" id=\"settings\">\n" +
    "          <li ng-show=\"presentation.active && presentation.enableVideoPresentation && presentation.showImage\"><a href=\"\" ng-click=\"presentation.elevateToVideo();\">View HD presentation</a></li>\n" +
    "          <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.en()\">English mode</a></li>\n" +
    "          <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.debug()\">Debug mode</a></li>\n" +
    "\n" +
    "          <li><a href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\" translate>CONFERENCE_ADD_A_NEW_PARTICIPANT</a></li>\n" +
    "          <li><a href=\"\" ng-click=\"controls.versionOverlay()\" translate>CONFERENCE_ABOUT_THIS_APP</a></li>\n" +
    "\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <button title=\"Disconnect\" class=\"icon icon__disconnect\" ng-click=\"controls.disconnect('./')\"><span class=\"icon__label\" translate>CONFERENCE_DISCONNECT</span></button>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-hide=\"conference.isGateway\">\n" +
    "      <div class=\"participantsbar\">\n" +
    "        <input type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "        <i class=\"icon icon__search\"></i>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"participants\">\n" +
    "        <ul>\n" +
    "          <li class=\"participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "            <div class=\"participant__name\">{{p.name}}</a>\n" +
    "              <div class=\"participant__role\">\n" +
    "                {{p.role}}\n" +
    "                <span ng-show=\"p.is_muted\" translate>CONFERENCE_MUTED</span>\n" +
    "                <span ng-show=\"p.is_presenting\" translate>CONFERENCE_PRESENTING</span>\n" +
    "              </div>\n" +
    "              <a ng-show=\"user.isHost()\" class=\"participant__menuToggle icon icon__menu-toggle\" href=\"\" ng-click=\"menu.open('participant__' + p.uuid, $event)\"><span class=\"icon__label\" translate>CONFERENCE_OPTIONS</span></a>\n" +
    "              <ul ng-show=\"menu.isOpen('participant__' + p.uuid)\" class=\"settings__menu participant__menu\">\n" +
    "                <li>\n" +
    "                  <a href=\"\" ng-click=\"participant.mute(p)\">\n" +
    "                    <span ng-show=\"!p.is_muted\" translate>CONFERENCE_MUTE_PARTICIPANT</span>\n" +
    "                    <span ng-show=\"p.is_muted\" translate>CONFERENCE_UNMUTE_PARTICIPANT</span>\n" +
    "                  </a>\n" +
    "                </li>\n" +
    "                <li><a href=\"\" ng-click=\"participant.disconnect(p)\" translate>CONFERENCE_DISCONNECT_PARTICIPANT</a></li>\n" +
    "              </ul>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"sidebar__message\" ng-show=\"conference.isGateway\">\n" +
    "        <p translate>CONFERENCE_DIRECT_CALL_UNAVAILABLE_ROSTER_LIST</p>\n" +
    "      </div>\n" +
    "\n" +
    "  </aside>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <!-- container to inject popups into the DOM -->\n" +
    "\n" +
    "  <div popup-container items=\"popupList\"></div>\n" +
    "  <div popup-container items=\"dialogList\"></div>\n" +
    "\n" +
    "  <!-- DTMF keypad -->\n" +
    "  <div dtmf class=\"key-pad-container\" ng-show=\"controls.dtmfVisible\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/conference.html',
    "<div ng-click=\"menu.close()\" resizable>\n" +
    "<div class=\"screen-controls\">\n" +
    "  <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"videoToggle icon icon__show-roster\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\" translate>CONFERENCE_ROSTER</span></button>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<aside class=\"sidebar\" ng-class=\"{'has-selfview': selfview.active, collapse: selfview.collapse }\">\n" +
    "  <div class=\"topbar\">\n" +
    "    <h1 class=\"conference\" ng-click=\"menu.toggle('settings', $event)\">{{conference.id}}</h1>\n" +
    "    <div class=\"settings\">\n" +
    "\n" +
    "      <button title=\"Menu\" class=\"icon icon__menu\" ng-click=\"menu.toggle('settings', $event)\"><span class=\"icon__label\" translate>CONFERENCE_MENU</span></button>\n" +
    "\n" +
    "      <ul ng-show=\"menu.isOpen('settings')\" class=\"settings__menu\" id=\"settings\">\n" +
    "        <li ng-show=\"presentation.active && presentation.enableVideoPresentation && presentation.showImage\"><a href=\"\" ng-click=\"presentation.elevateToVideo();\">View HD presentation</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.en()\">English mode</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.debug()\">Debug mode</a></li>\n" +
    "\n" +
    "        <li><a href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\" translate>CONFERENCE_ADD_A_NEW_PARTICIPANT</a></li>\n" +
    "        <li><a href=\"\" ng-click=\"controls.versionOverlay()\" translate>CONFERENCE_ABOUT_THIS_APP</a></li>\n" +
    "\n" +
    "        <li><a href=\"\" ng-click=\"controls.dtmfVisible = !!!controls.dtmfVisible\">Show/hide keypad</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <button title=\"View Video\" class=\"videoToggle icon icon__show-video\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\" translate>CONFERENCE_VIDEO</span></button>\n" +
    "\n" +
    "      <button title=\"Disconnect\" class=\"icon icon__disconnect\" ng-click=\"controls.disconnect('./')\"><span class=\"icon__label\" translate>CONFERENCE_DISCONNECT</span></button>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div ng-hide=\"conference.isGateway\">\n" +
    "    <div class=\"participantsbar\">\n" +
    "      <input type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "      <i class=\"icon icon__search\"></i>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"participants\">\n" +
    "      <ul>\n" +
    "        <li class=\"participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "          <div class=\"participant__name\">{{p.name}}</a>\n" +
    "            <div class=\"participant__role\">\n" +
    "              {{p.role}}\n" +
    "              <span ng-show=\"p.is_muted\" translate>CONFERENCE_MUTED</span>\n" +
    "              <span ng-show=\"p.is_presenting\" translate>CONFERENCE_PRESENTING</span>\n" +
    "            </div>\n" +
    "            <a ng-show=\"user.isHost()\" class=\"participant__menuToggle icon icon__menu-toggle\" href=\"\" ng-click=\"menu.open('participant__' + p.uuid, $event)\"><span class=\"icon__label\" translate>CONFERENCE_OPTIONS</span></a>\n" +
    "            <ul ng-show=\"menu.isOpen('participant__' + p.uuid)\" class=\"settings__menu participant__menu\">\n" +
    "              <li>\n" +
    "                <a href=\"\" ng-click=\"participant.mute(p)\">\n" +
    "                  <span ng-show=\"!p.is_muted\" translate>CONFERENCE_MUTE_PARTICIPANT</span>\n" +
    "                  <span ng-show=\"p.is_muted\" translate>CONFERENCE_UNMUTE_PARTICIPANT</span>\n" +
    "                </a>\n" +
    "              </li>\n" +
    "              <li><a href=\"\" ng-click=\"participant.disconnect(p)\" translate>CONFERENCE_DISCONNECT_PARTICIPANT</a></li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"sidebar__message\" ng-show=\"conference.isGateway\">\n" +
    "      <p translate>CONFERENCE_DIRECT_CALL_UNAVAILABLE_ROSTER_LIST</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"selfview\" ng-class=\"{visible: selfview.active}\" ng-click=\"selfview.hide()\">\n" +
    "      <figure>\n" +
    "        <video width=\"100%\" id=\"selfview\" muted=\"true\" autoplay=\"autoplay\" poster=\"assets/images/spinner.gif\" />\n" +
    "      </figure>\n" +
    "    </div>\n" +
    "</aside>\n" +
    "\n" +
    "<div class=\"screen\" toggle-hover=\"hover\" toggle-overlaid=\"overlaid\" wait=\"5000\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <figure\n" +
    "    class=\"stage stage__main video\"\n" +
    "    ng-class=\"{\n" +
    "      'stage--max': !presentation.maximised,\n" +
    "      'stage--min': presentation.maximised,\n" +
    "      'presentation--active': presentation.active,\n" +
    "      'presentation--inactive': !presentation.active }\">\n" +
    "    <video\n" +
    "      class=\"video centered stage__child\"\n" +
    "      width=\"100%\"\n" +
    "      id=\"video\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-click=\"presentation.toggleView('video');\"\n" +
    "      ng-class=\"{ 'active': presentation.maximised, 'inactive': !presentation.maximised }\" />\n" +
    "  </figure>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <figure\n" +
    "    class=\"presentation video\"\n" +
    "    ng-show=\"presentation.active\"\n" +
    "    ng-class=\"{ 'presentation--max': presentation.maximised, 'presentation--min': !presentation.maximised, 'centered': presentation.maximised }\">\n" +
    "\n" +
    "    <img\n" +
    "      class=\"presentation__image presentation__child centered\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      ng-show=\"presentation.showImage\"\n" +
    "      ng-src=\"{{ presentation.imageSrc }}\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\"\n" +
    "      poster=\"assets/images/spinner.gif\" />\n" +
    "    <video\n" +
    "      class=\"presentation__video presentation__child centered\"\n" +
    "      width=\"100%\"\n" +
    "      ng-show=\"!presentation.showImage\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      id=\"presentation\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\" />\n" +
    "  </figure>\n" +
    "\n" +
    "\n" +
    "  <nav ng-hide=\"user.screenValue()\" class=\"screenbar\" ng-class=\"{'presentation__screenbar': presentation.active}\" role=\"navigation\">\n" +
    "    <ul class=\"grid--full\">\n" +
    "      <li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"selfview-icon\" ng-class=\"{inactive: selfview.active == false}\" href=\"\" ng-click=\"selfview.toggle()\">\n" +
    "          <span ng-show=\"selfview.active\"><i class=\"icon icon__hide-selfview\"></i> {{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}</span>\n" +
    "          <span ng-show=\"!selfview.active\"><i class=\"icon icon__show-selfview\"></i> {{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "   --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"audio-icon\" ng-class=\"{inactive: audio.active == false}\" href=\"\" ng-click=\"audio.toggle()\">\n" +
    "          <span ng-show=\"audio.active\"><i class=\"icon icon__mute-my-audio\"></i> {{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}</span>\n" +
    "          <span ng-show=\"!audio.active\"><i class=\"icon icon__enable-my-audio\"></i> {{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "      --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"video-icon\" ng-class=\"{inactive: video.active == false}\" href=\"\" ng-click=\"video.toggle()\">\n" +
    "          <span ng-show=\"video.active\"><i class=\"icon icon__hide-my-video\"></i> {{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}</span>\n" +
    "          <span ng-show=\"!video.active\"><i class=\"icon icon__enable-my-video\"></i> {{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"fullscreen-icon\" ng-class=\"{inactive: fullscreen.active == false}\" href=\"\" ng-click=\"fullscreen.toggle()\">\n" +
    "          <span ng-show=\"fullscreen.active\"><i class=\"icon icon__disable-fullscreen\"></i> {{ 'CONFERENCE_DISABLE_FULLSCREEN' | translate }}</span>\n" +
    "          <span ng-show=\"!fullscreen.active\"><i class=\"icon icon__enable-fullscreen\"></i> {{ 'CONFERENCE_ENABLE_FULLSCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "    --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-class=\"screenshare.className()\" class=\"screen-icon\" href=\"\" ng-click=\"screenshare.toggle()\">\n" +
    "           <span ng-show=\"screenshare.active\"><i class=\"icon icon__stop-screen-sharing\"></i> {{ 'CONFERENCE_STOP_SCREEN_SHARING' | translate }}</span>\n" +
    "          <span ng-show=\"!screenshare.active\"><i class=\"icon icon__present-screen\"></i> {{ 'CONFERENCE_PRESENT_SCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-show=\"!presentation.active\" class=\"presentation-icon\" ng-class=\"{disabled: presentation.available == false}\" href=\"\" ng-click=\"presentation.open()\">\n" +
    "          <span><i class=\"icon icon__view-presentation\"></i> {{ 'CONFERENCE_VIEW_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "        <a ng-show=\"presentation.active\" class=\"presentation-icon\" href=\"\" ng-click=\"presentation.close()\">\n" +
    "          <span><i class=\"icon icon__hide-presentation\"></i> {{ 'CONFERENCE_HIDE_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <!--\n" +
    "     -->\n" +
    "    </ul>\n" +
    "  </nav>\n" +
    "</div>\n" +
    "\n" +
    "<!-- container to inject popups into the DOM -->\n" +
    "<div popup-container items=\"popupList\"></div>\n" +
    "<div popup-container items=\"dialogList\"></div>\n" +
    "\n" +
    "<!-- DTMF keypad -->\n" +
    "<div dtmf class=\"key-pad-container\" ng-show=\"controls.dtmfVisible\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/conference2.html',
    "<div ng-click=\"menu.close()\" resizable>\n" +
    "<div class=\"screen-controls\">\n" +
    "  <button title=\"{{ 'CONFERENCE_ROSTER' | translate }}\" class=\"videoToggle icon icon__show-roster\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\">{{ 'CONFERENCE_ROSTER' | translate }}</span></button>\n" +
    "</div>\n" +
    "\n" +
    "<aside class=\"sidebar\" ng-class=\"{'has-selfview': selfview.active, collapse: selfview.collapse }\">\n" +
    "  <div class=\"topbar\">\n" +
    "    <h1 class=\"conference\" ng-click=\"menu.open('settings', $event)\">{{conference.id}}</h1>\n" +
    "    <div class=\"settings\">\n" +
    "\n" +
    "      <button title=\"Menu\" class=\"icon icon__menu\" ng-click=\"menu.open('settings', $event)\"><span class=\"icon__label\">{{ 'CONFERENCE_MENU' | translate }}</span></button>\n" +
    "\n" +
    "      <ul ng-show=\"menu.isOpen('settings')\" class=\"settings__menu\" id=\"settings\">\n" +
    "        <li ng-show=\"presentation.active && presentation.enableVideoPresentation && presentation.showImage\"><a href=\"\" ng-click=\"presentation.elevateToVideo();\">View HD presentation</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.en()\">English mode</a></li>\n" +
    "        <li ng-show=\"menu.showLanguage\"><a href=\"\" ng-click=\"controls.language.debug()\">Debug mode</a></li>\n" +
    "\n" +
    "        <li><a href=\"\" ng-show=\"user.isHost()\" ng-click=\"participant.add()\">{{ 'CONFERENCE_ADD_A_NEW_PARTICIPANT' | translate }}</a></li>\n" +
    "        <li><a href=\"\" ng-click=\"controls.versionOverlay()\">{{ 'CONFERENCE_ABOUT_THIS_APP' | translate }}</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <button title=\"View Video\" class=\"videoToggle icon icon__show-video\" ng-show=\"windowWidth <= 800\" ng-click=\"controls.showSideBarClick();\"><span class=\"icon__label\">{{ 'CONFERENCE_VIDEO' | translate }}</span></button>\n" +
    "\n" +
    "      <button title=\"Disconnect\" class=\"icon icon__disconnect\" ng-click=\"controls.disconnect('./')\"><span class=\"icon__label\">{{ 'CONFERENCE_DISCONNECT' | translate }}</span></button>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div ng-hide=\"conference.isGateway\">\n" +
    "    <div class=\"participantsbar\">\n" +
    "      <input type=\"search\" ng-model=\"search\" placeholder=\"{{ 'CONFERENCE_SEARCH_PARTICIPANTS' | translate }}\" />\n" +
    "      <i class=\"icon icon__search\"></i>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"participants\">\n" +
    "      <ul>\n" +
    "        <li class=\"participant\" ng-repeat=\"p in participants | filter: {name: search} | orderBy:'connection_duration':false\">\n" +
    "          <div class=\"participant__name\">{{p.name}}</a>\n" +
    "            <div class=\"participant__role\">\n" +
    "              {{p.role}}\n" +
    "              <span ng-show=\"p.is_muted\">{{ 'CONFERENCE_MUTED' | translate }}</span>\n" +
    "              <span ng-show=\"p.is_presenting\">{{ 'CONFERENCE_PRESENTING' | translate }}</span>\n" +
    "            </div>\n" +
    "            <a ng-show=\"user.isHost()\" class=\"participant__menuToggle icon icon__menu-toggle\" href=\"\" ng-click=\"menu.open('participant__' + p.uuid, $event)\"><span class=\"icon__label\">{{ 'CONFERENCE_OPTIONS' | translate }}</span></a>\n" +
    "            <ul ng-show=\"menu.isOpen('participant__' + p.uuid)\" class=\"settings__menu participant__menu\">\n" +
    "              <li>\n" +
    "                <a href=\"\" ng-click=\"participant.mute(p)\">\n" +
    "                  <span ng-show=\"!p.is_muted\">{{ 'CONFERENCE_MUTE_PARTICIPANT' | translate }}</span>\n" +
    "                  <span ng-show=\"p.is_muted\">{{ 'CONFERENCE_UNMUTE_PARTICIPANT' | translate }}</span>\n" +
    "                </a>\n" +
    "              </li>\n" +
    "              <li><a href=\"\" ng-click=\"participant.disconnect(p)\">{{ 'CONFERENCE_DISCONNECT_PARTICIPANT' | translate }}</a></li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"sidebar__message\" ng-show=\"conference.isGateway\">\n" +
    "      <p>{{ 'CONFERENCE_DIRECT_CALL_UNAVAILABLE_ROSTER_LIST' | translate }}</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"selfview\" ng-class=\"{visible: selfview.active}\" ng-click=\"selfview.hide()\">\n" +
    "      <figure>\n" +
    "        <video width=\"100%\" id=\"selfview\" muted=\"true\" autoplay=\"autoplay\" poster=\"assets/images/spinner.gif\" />\n" +
    "      </figure>\n" +
    "    </div>\n" +
    "</aside>\n" +
    "\n" +
    "<div class=\"screen\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <figure\n" +
    "    class=\"stage stage__main video\"\n" +
    "    ng-class=\"{\n" +
    "      'stage--max': !presentation.maximised,\n" +
    "      'stage--min': presentation.maximised,\n" +
    "      'presentation--active': presentation.active,\n" +
    "      'presentation--inactive': !presentation.active }\">\n" +
    "    <video\n" +
    "      class=\"video centered stage__child\"\n" +
    "      width=\"100%\"\n" +
    "      id=\"video\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-click=\"presentation.toggleView('video');\"\n" +
    "      ng-class=\"{ 'active': presentation.maximised, 'inactive': !presentation.maximised }\" />\n" +
    "  </figure>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <figure\n" +
    "    class=\"presentation video\"\n" +
    "    ng-show=\"presentation.active\"\n" +
    "    ng-class=\"{ 'presentation--max': presentation.maximised, 'presentation--min': !presentation.maximised, 'centered': presentation.maximised }\">\n" +
    "\n" +
    "    <img\n" +
    "      class=\"presentation__image presentation__child centered\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      ng-show=\"presentation.showImage\"\n" +
    "      ng-src=\"{{ presentation.imageSrc }}\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\"\n" +
    "      poster=\"assets/images/spinner.gif\" />\n" +
    "    <video\n" +
    "      class=\"presentation__video presentation__child centered\"\n" +
    "      width=\"100%\"\n" +
    "      ng-show=\"!presentation.showImage\"\n" +
    "      ng-click=\"presentation.toggleView('presentation');\"\n" +
    "      id=\"presentation\"\n" +
    "      autoplay=\"autoplay\"\n" +
    "      poster=\"assets/images/spinner.gif\"\n" +
    "      ng-class=\"{ 'active': !presentation.maximised, 'inactive': presentation.maximised }\" />\n" +
    "  </figure>\n" +
    "\n" +
    "\n" +
    "  <nav ng-hide=\"user.screenValue()\" class=\"screenbar\" ng-class=\"{'presentation__screenbar': presentation.active}\" role=\"navigation\">\n" +
    "    <ul class=\"grid--full\">\n" +
    "      <li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"selfview-icon\" ng-class=\"{inactive: selfview.active == false}\" href=\"\" ng-click=\"selfview.toggle()\">\n" +
    "          <span ng-show=\"selfview.active\"><i class=\"icon icon__hide-selfview\"></i> {{ 'CONFERENCE_HIDE_SELFVIEW' | translate }}</span>\n" +
    "          <span ng-show=\"!selfview.active\"><i class=\"icon icon__show-selfview\"></i> {{ 'CONFERENCE_SHOW_SELFVIEW' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "   --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"audio-icon\" ng-class=\"{inactive: audio.active == false}\" href=\"\" ng-click=\"audio.toggle()\">\n" +
    "          <span ng-show=\"audio.active\"><i class=\"icon icon__mute-my-audio\"></i> {{ 'CONFERENCE_MUTE_MY_AUDIO' | translate }}</span>\n" +
    "          <span ng-show=\"!audio.active\"><i class=\"icon icon__enable-my-audio\"></i> {{ 'CONFERENCE_ENABLE_MY_AUDIO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "      --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"video-icon\" ng-class=\"{inactive: video.active == false}\" href=\"\" ng-click=\"video.toggle()\">\n" +
    "          <span ng-show=\"video.active\"><i class=\"icon icon__hide-my-video\"></i> {{ 'CONFERENCE_HIDE_MY_VIDEO' | translate }}</span>\n" +
    "          <span ng-show=\"!video.active\"><i class=\"icon icon__enable-my-video\"></i> {{ 'CONFERENCE_ENABLE_MY_VIDEO' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a class=\"fullscreen-icon\" ng-class=\"{inactive: fullscreen.active == false}\" href=\"\" ng-click=\"fullscreen.toggle()\">\n" +
    "          <span ng-show=\"fullscreen.active\"><i class=\"icon icon__disable-fullscreen\"></i> {{ 'CONFERENCE_DISABLE_FULLSCREEN' | translate }}</span>\n" +
    "          <span ng-show=\"!fullscreen.active\"><i class=\"icon icon__enable-fullscreen\"></i> {{ 'CONFERENCE_ENABLE_FULLSCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "    --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-class=\"screenshare.className()\" class=\"screen-icon\" href=\"\" ng-click=\"screenshare.toggle()\">\n" +
    "           <span ng-show=\"screenshare.active\"><i class=\"icon icon__stop-screen-sharing\"></i> {{ 'CONFERENCE_STOP_SCREEN_SHARING' | translate }}</span>\n" +
    "          <span ng-show=\"!screenshare.active\"><i class=\"icon icon__present-screen\"></i> {{ 'CONFERENCE_PRESENT_SCREEN' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li><!--\n" +
    "       --><li class=\"grid__item one-third lap-one-half palm-one-whole\">\n" +
    "        <a ng-show=\"!presentation.active\" class=\"presentation-icon\" ng-class=\"{disabled: presentation.available == false}\" href=\"\" ng-click=\"presentation.open()\">\n" +
    "          <span><i class=\"icon icon__view-presentation\"></i> {{ 'CONFERENCE_VIEW_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "        <a ng-show=\"presentation.active\" class=\"presentation-icon\" href=\"\" ng-click=\"presentation.close()\">\n" +
    "          <span><i class=\"icon icon__hide-presentation\"></i> {{ 'CONFERENCE_HIDE_PRESENTATION' | translate }}</span>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <!--\n" +
    "     -->\n" +
    "    </ul>\n" +
    "  </nav>\n" +
    "</div>\n" +
    "\n" +
    "<!-- container to inject popups into the DOM -->\n" +
    "<div popup-container items=\"popupList\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/directives/inputDropdown.html',
    "<div ng-show=\"visible\" tabindex=\"-1\">\n" +
    "\t<div class=\"autocomplete__container\" tabindex=\"-1\">\n" +
    "\t\t<div class=\"autocomplete__item\" ng-click=\"clickItem(item);\" ng-repeat=\"item in filteredData\" ng-class=\"{ 'selected': item===selectedItem }\" tabindex=\"-1\">{{ item }}</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/dtmf/pinpad.html',
    "<div class=\"popup__wrapper\">\n" +
    "  <div class=\"popup__dialog popup__keypad\">\n" +
    "    <div class=\"popup__message keypad\">\n" +
    "\n" +
    "      <div class=\"keypad__wrapper\">\n" +
    "        <div class=\"keypad__row\">\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('1');\">\n" +
    "            <strong class=\"keypad__key\">1</strong>\n" +
    "            <span class=\"keypad__letters\"></span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('2');\">\n" +
    "            <strong class=\"keypad__key\">2</strong>\n" +
    "            <span class=\"keypad__letters\">abc</span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('3');\">\n" +
    "            <strong class=\"keypad__key\">3</strong>\n" +
    "            <span class=\"keypad__letters\">def</span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"keypad__row\">\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('4');\">\n" +
    "            <strong class=\"keypad__key\">4</strong>\n" +
    "            <span class=\"keypad__letters\">ghi</span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('5');\">\n" +
    "            <strong class=\"keypad__key\">5</strong>\n" +
    "            <span class=\"keypad__letters\">jkl</span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('6');\">\n" +
    "            <strong class=\"keypad__key\">6</strong>\n" +
    "            <span class=\"keypad__letters\">mno</span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"keypad__row\">\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('7');\">\n" +
    "            <strong class=\"keypad__key\">7</strong>\n" +
    "            <span class=\"keypad__letters\">pqrs</span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('8');\">\n" +
    "            <strong class=\"keypad__key\">8</strong>\n" +
    "            <span class=\"keypad__letters\">tuv</span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('9');\">\n" +
    "            <strong class=\"keypad__key\">9</strong>\n" +
    "            <span class=\"keypad__letters\">wxyz</span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"keypad__row\">\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('*');\">\n" +
    "            <strong class=\"keypad__key\">*</strong>\n" +
    "            <span class=\"keypad__letters\"></span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('0');\">\n" +
    "            <strong class=\"keypad__key\">0</strong>\n" +
    "            <span class=\"keypad__letters\"></span>\n" +
    "          </span>\n" +
    "          <span class=\"keypad__item\" ng-click=\"buttonClick('#');\">\n" +
    "            <strong class=\"keypad__key\">#</strong>\n" +
    "            <span class=\"keypad__letters\"></span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <span class=\"popup__close\" ng-click=\"closeClick();\">\n" +
    "        <i class=\"icon icon__close\" title=\"{{ 'KEYPAD_CLOSE' | translate }}\"></i>\n" +
    "        <span class=\"icon__label\">{{ 'KEYPAD_CLOSE' | translate }}</span>\n" +
    "      </span>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/login-flex.html',
    "<div class=\"form__container\">\n" +
    "  <h1 class=\"brand__logo\"><a href=\"../\" tabindex=\"0\"><span class=\"brand__logo__label\" translate>LOGO</span></a></h1>\n" +
    "  <ui-view></ui-view>\n" +
    "</div>\n" +
    "\n" +
    "<footer class=\"page-footer\" ng-hide=\"isDesktopClient\">\n" +
    "  <a href=\"http://pexip.com/\" tabindex=\"0\">&copy; 2014 Pexip&reg; AS</a>\n" +
    "  <a ng-click=\"versionOverlay()\" href=\"\" tabindex=\"0\"><span translate>LOGIN_ABOUT</span></a>\n" +
    "</footer>\n"
  );


  $templateCache.put('assets/templates/login.browser.html',
    "<header class=\"form__header\">\n" +
    "    <h2 class=\"form__heading\" translate>Wait! You can't go here just yet.</h2>\n" +
    "</header>\n" +
    "\n" +
    "<p>This Pexip Infinity client is supported in Google Chrome (Desktop or Android) 27 or higher, and Firefox 20 and higher. Unfortunately your browser doesn't yet have what it takes to support Pexip Infinity. However, the clever engineers at Pexip are working\n" +
    "    hard on a solution that will allow you to use other browsers such as Explorer and Safari - coming soon to a computer near you!</p>\n" +
    "<p>For now, download a supported browser from here:\n" +
    "    <ul>\n" +
    "        <li><a href=\"http://google.com/chrome\">Chrome (latest)</a>\n" +
    "        </li>\n" +
    "        <li><a href=\"http://mozilla.org/firefox\">Firefox (latest)</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</p>\n" +
    "<p>Or download the Infinity Connect desktop client from <a href=\"http://www.pexip.com/download-infinity-connect\">pexip.com</a>\n" +
    "<!-- <p>Or download the Infinity Connect desktop client:\n" +
    "    <ul>\n" +
    "        <li><a href=\"./#/download\">Downloads</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</p> -->\n"
  );


  $templateCache.put('assets/templates/login.download.html',
    "<header class=\"form__header\">\n" +
    "    <h2 class=\"form__heading\" translate>Download</h2>\n" +
    "</header>\n" +
    "\n" +
    "<p>Download the Pexip Infinity Connect desktop client for your platform:</p>\n" +
    "<ul>\n" +
    "    <li><a href=\"#\">Windows</a>\n" +
    "    </li>\n" +
    "    <li><a href=\"#\">Mac OS X</a>\n" +
    "    </li>\n" +
    "    <li><a href=\"#\">Linux</a>\n" +
    "    </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('assets/templates/login.html',
    "<div class=\"form__container\">\n" +
    "  <h1 class=\"brand__logo\"><a href=\"./\" tabindex=\"0\"><span class=\"brand__logo__label\" translate>LOGO</span></a></h1>\n" +
    "  <ui-view></ui-view>\n" +
    "</div>\n" +
    "\n" +
    "<footer class=\"footer\" ng-hide=\"window.top.isDesktopClient\">\n" +
    "  <a href=\"http://pexip.com/\">&copy; 2014 Pexip&reg; AS</a><a ng-click=\"versionOverlay()\" href=\"\"><span translate>LOGIN_ABOUT</span></a>\n" +
    "</footer>\n"
  );


  $templateCache.put('assets/templates/login.pin.html',
    "<form class=\"form\" ng-submit=\"login()\" autocomplete=\"off\">\n" +
    "\n" +
    "  <header class=\"form__header\">\n" +
    "    <h2 class=\"form__heading\" translate>LOGIN_LOGIN</h2>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"message\" ng-click=\"message = ''\" class=\"form__alert\">{{ message }}</div>\n" +
    "\n" +
    "  <div class=\"form__field\">\n" +
    "    <label class=\"form__label\" for=\"user-pin-field\" translate>LOBBY_ENTER_CONFERENCE_PIN</label>\n" +
    "    <input class=\"form__input\" id=\"user-pin-field\" type=\"password\" autofocus ng-model=\"user.pin\" maxlength=\"10\">\n" +
    "  </div>\n" +
    "  <div class=\"form__buttons\">\n" +
    "    <button class=\"form__submit\" id=\"join-button\" translate>JOIN</button>\n" +
    "  </div>\n" +
    "\n" +
    "</form>\n"
  );


  $templateCache.put('assets/templates/login.role.html',
    "<form class=\"form\" ng-submit=\"selectRole()\">\n" +
    "\n" +
    "  <header class=\"form__header\">\n" +
    "    <h2 class=\"form__heading\" translate>LOGIN_HEADING_SELECT_ROLE</h2>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"message\" ng-click=\"message = ''\" class=\"form__alert\">{{ message }}</div>\n" +
    "\n" +
    "  <div class=\"form__field\">\n" +
    "    <label class=\"form__inline__label\" for=\"user-role-guest-field\">\n" +
    "      <input id=\"user-role-guest-field\" type=\"radio\" ng-checked=\"true\" autofocus ng-model=\"user.role\" value=\"GUEST\"><span translate>LOBBY_JOIN_AS_GUEST</span>\n" +
    "    </label>\n" +
    "    <label class=\"form__inline__label\" for=\"user-role-host-field\">\n" +
    "      <input id=\"user-role-host-field\" type=\"radio\" ng-model=\"user.role\" value=\"HOST\"><span translate>LOBBY_JOIN_AS_HOST</span>\n" +
    "    </label>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form__buttons\">\n" +
    "    <button class=\"form__submit\" translate>NEXT</button>\n" +
    "  </div>\n" +
    "\n" +
    "</form>\n"
  );


  $templateCache.put('assets/templates/login.settings.html',
    "\n" +
    "<form class=\"form\" ng-submit=\"login()\" role=\"application\">\n" +
    "\n" +
    "  <header class=\"form__header\">\n" +
    "    <h2 class=\"form__heading\" translate>LOGIN_HEADING</h2>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"message\" ng-click=\"message = ''\" class=\"form__alert\">{{ message }}</div>\n" +
    "\n" +
    "  <div ng-hide=\"isDesktopClient\">\n" +
    "\n" +
    "  <div class=\"form__field\">\n" +
    "    <label class=\"form__label\" for=\"conference-id-field\">\n" +
    "      <span translate>LOGIN_LABEL_PERSON_OR_CONFERENCE</span>\n" +
    "    </label>\n" +
    "\n" +
    "    <input class=\"form__input\" id=\"conference-id-field\" autocomplete=\"off\" type=\"text\" autofocus ng-model=\"conference.id\" maxlength=\"250\" input-dropdown data=\"conferenceHistory\" tabindex=\"1\"\n" +
    "    aria-labelledby=\"conference-id-field\" />\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form__field\">\n" +
    "    <label class=\"form__label\" for=\"user-username-field\"><span translate>LOGIN_YOUR_NAME</span>\n" +
    "    </label>\n" +
    "    <input class=\"form__input\" id=\"user-username-field\" type=\"text\" ng-model=\"user.username\" maxlength=\"250\" tabindex=\"1\" />\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <a href=\"\" id=\"advanced-controls-show\" class=\"form__toggle\" ng-hide=\"advancedControls\" ng-click=\"advancedControls = !advancedControls;forceRepaint();\" tabindex=\"1\"><span translate>LOGIN_ADVANCED_SHOW</span>\n" +
    "    </a>\n" +
    "\n" +
    "    <a href=\"\" id=\"advanced-controls-hide\" class=\"form__toggle\" ng-show=\"advancedControls\" ng-click=\"advancedControls = !advancedControls;forceRepaint();\"><span translate>LOGIN_ADVANCED_HIDE</span>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"advancedControls\">\n" +
    "    <div class=\"form__field\">\n" +
    "      <label class=\"form__label\" for=\"user-bandwidth-field\"><span translate>LOGIN_BANDWIDTH</span>\n" +
    "      </label>\n" +
    "      <select class=\"form__select\" id=\"user-bandwidth-field\" ng-model=\"user.bandwidth\" ng-options=\"b.value as b.name for b in bandwidths\" tabindex=\"1\">\n" +
    "      </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form__field form__checkbox\" aria-labelledby=\"user-screen-field\">\n" +
    "      <p class=\"form__field__heading\" id=\"user-screen-field\"><span translate>LOGIN_PRESENTATION_TYPE</span>\n" +
    "      </p>\n" +
    "      <label class=\"form__inline__label\" ng-show=\"hasChromeWebstore\">\n" +
    "        <input type=\"checkbox\" id=\"user-screen-field1\" ng-model=\"user.screen\" value=\"screen\"\n" +
    "          role=\"checkbox\"\n" +
    "          tabindex=\"1\"\n" +
    "          aria-checked=\"false\"\n" +
    "          aria-labelledby=\"user-screen-field1\" />\n" +
    "        <span translate>LOGIN_PRESENT_SCREEN_ONLY</span>\n" +
    "      </label>\n" +
    "      <label class=\"form__inline__label\">\n" +
    "        <input type=\"checkbox\" id=\"user-screen-field2\" ng-model=\"user.audio\" value=\"audio\"\n" +
    "          role=\"checkbox\"\n" +
    "          tabindex=\"1\"\n" +
    "          aria-checked=\"false\"\n" +
    "          aria-labelledby=\"user-screen-field2\" />\n" +
    "        <span translate>LOGIN_PRESENT_AUDIO_ONLY</span>\n" +
    "      </label>\n" +
    "\n" +
    "      <!-- <label class=\"form__inline__label\">\n" +
    "        <input type=\"checkbox\" id=\"user-screen-field3\" ng-model=\"user.roster\" value=\"audio\"\n" +
    "          role=\"checkbox\"\n" +
    "          tabindex=\"1\"\n" +
    "          aria-checked=\"false\"\n" +
    "          aria-labelledby=\"user-screen-field3\" />\n" +
    "        <span translate>LOGIN_ROSTER_ONLY</span>\n" +
    "      </label> -->\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form__field\" ng-show=\"hasChromeWebstore\">\n" +
    "      <label class=\"form__label\" for=\"audio-source\"><span translate>LOGIN_MICROPHONE</span>\n" +
    "      </label>\n" +
    "      <select class=\"form__select\" id=\"audo-source\" ng-model=\"settings.audioSourceObject\" ng-options=\"source.label for source in audioMediaSources\" tabindex=\"1\">\n" +
    "      </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form__field\" ng-show=\"hasChromeWebstore\">\n" +
    "      <label class=\"form__label\" for=\"video-source\"><span translate>LOGIN_CAMERA</span>\n" +
    "      </label>\n" +
    "      <select class=\"form__select\" id=\"video-source\" ng-model=\"settings.videoSourceObject\" ng-options=\"source.label for source in videoMediaSources\" tabindex=\"1\">\n" +
    "      </select>\n" +
    "      <img href=\"assets/images/spinner.gif\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form__buttons\">\n" +
    "    <button class=\"form__submit\" tabindex=\"1\" id=\"join-button\"><span translate>LOGIN_JOIN</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "<span ng-hide=\"true\">Page loaded in {{ pageLoadTime }} ms </span>\n" +
    "<div ng-if=\"load_flash\" style=\"left: -9999px; position: absolute;\">\n" +
    "  <div swf-object replace-id=\"flashContent\" src=\"assets/flash/PexVideo.swf\" width=\"100%\" height=\"100%\" />\n" +
    "      <div id=\"flashContent\">\n" +
    "              <p>\n" +
    "                      To view this page ensure that Adobe Flash Player version\n" +
    "                      11.1.0 or greater is installed.\n" +
    "              </p>\n" +
    "              <!--\n" +
    "                      var pageHost = ((document.location.protocol == \"https:\") ? \"https://\" : \"http://\");\n" +
    "                      document.write(\"<a href='http://www.adobe.com/go/getflashplayer'><img src='\"\n" +
    "                                                      + pageHost + \"www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>\" );\n" +
    "            -->\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<!--<span ng-hide=\"overrideBandwidth\">Bandwidth estimated: {{ bandwidthEstimated }} kbps</span>-->\n"
  );


  $templateCache.put('assets/templates/popup/alert.html',
    "<div class=\"popup__wrapper\" ng-class=\"{ popup__toast__wrapper: popupType==='toast', overlay: popupType==='confirm' }\">\n" +
    "\n" +
    "    <div ng-if=\"popupType==='toast'\"\n" +
    "    class=\"popup\"\n" +
    "    ng-class=\"{\n" +
    "    popup__alert: popupType==='alert',\n" +
    "    popup__alert: popupType==='mediaStatistics',\n" +
    "    popup__toast: popupType==='toast',\n" +
    "    popup__confirm: popupType==='confirm',\n" +
    "    popup__prompt: popupType==='prompt' }\"\n" +
    "    ng-mouseover=\"mouseOver();\"\n" +
    "    ng-mouseleave=\"mouseLeave();\"\n" +
    "    ng-style=\"{ top: toastTop + 'em', 'z-index': 10 }\">\n" +
    "\n" +
    "        <div class=\"popup__message\">\n" +
    "            <span ng-bind=\"message\"></span>\n" +
    "\n" +
    "            <div ng-show=\"required\" class=\"form__alert\">{{ 'FIELD_REQUIRED' | translate }}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"popupType!=='toast'&&popupType!=='mediaStatistics'\"\n" +
    "    class=\"popup\"\n" +
    "    ng-class=\"{\n" +
    "    popup__alert: popupType==='alert',\n" +
    "    popup__toast: popupType==='toast',\n" +
    "    popup__confirm: popupType==='confirm',\n" +
    "    popup__prompt: popupType==='prompt' }\"\n" +
    "    ng-mouseover=\"mouseOver();\"\n" +
    "    ng-mouseleave=\"mouseLeave();\"   >\n" +
    "        <div class=\"popup__message\">\n" +
    "            <span ng-bind=\"message\"></span>\n" +
    "\n" +
    "            <div class=\"popup__checkbox\" ng-show=\"options.rememberSetting\">\n" +
    "                <label class=\"form__inline__label\">\n" +
    "                    <input type=\"checkbox\" id=\"user-screen-field1\" ng-model=\"dataCheckbox\" ng-true-value=\"save\" value=\"save\" role=\"checkbox\" tabindex=\"1\" aria-checked=\"{{ dataCheckbox === 'save' }}\" aria-labelledby=\"user-screen-field1\" class=\"ng-pristine ng-valid\">\n" +
    "                    <span translate=\"\" class=\"ng-scope\">{{ 'DONT_ASK_AGAIN' | translate }}</span>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"required\" class=\"form__alert\">{{ 'FIELD_REQUIRED' | translate }}</div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"presentHD popup__checkbox\" ng-show=\"options.hd\">\n" +
    "            <label class=\"form__inline__label\">\n" +
    "                <input type=\"checkbox\" id=\"user-screen-field1\" ng-model=\"dataCheckbox\" ng-true-value=\"mssip\" value=\"screen\" role=\"checkbox\" tabindex=\"1\" aria-checked=\"false\" aria-labelledby=\"user-screen-field1\" class=\"ng-pristine ng-valid\">\n" +
    "                <span translate=\"\" class=\"ng-scope\">View HD presentation</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- put an input if it's a prompt -->\n" +
    "        <input type=\"input\" class=\"popup__input\" ng-model=\"data\" ng-keyup=\"keyUp($event, data, dataCheckbox);\" ng-show=\"popupType==='prompt'\" />\n" +
    "\n" +
    "        <div class=\"popup__radio\" ng-show=\"options.protocol\">\n" +
    "            <label class=\"form__inline__label\">\n" +
    "                <input type=\"radio\" id=\"user-screen-field1\" ng-model=\"dataCheckbox\" value=\"sip\" role=\"radio\" tabindex=\"1\" aria-checked=\"{{ dataCheckbox === 'sip' }}\" aria-labelledby=\"user-screen-field1\" class=\"ng-pristine ng-valid\" name=\"protocol\" checked>\n" +
    "                <span translate=\"\" class=\"ng-scope\">SIP</span>\n" +
    "            </label>\n" +
    "\n" +
    "            <label class=\"form__inline__label\">\n" +
    "                <input type=\"radio\" id=\"user-screen-field2\" ng-model=\"dataCheckbox\" value=\"h323\" role=\"radio\" tabindex=\"1\" aria-checked=\"{{ dataCheckbox === 'h323' }}\" aria-labelledby=\"user-screen-field2\" class=\"ng-pristine ng-valid\" name=\"protocol\">\n" +
    "                <span translate=\"\" class=\"ng-scope\">H.323</span>\n" +
    "            </label>\n" +
    "\n" +
    "            <label class=\"form__inline__label\">\n" +
    "                <input type=\"radio\" id=\"user-screen-field3\" ng-model=\"dataCheckbox\" value=\"lync\" role=\"radio\" tabindex=\"1\" aria-checked=\"{{ dataCheckbox === 'lync' }}\" aria-labelledby=\"user-screen-field3\" class=\"ng-pristine ng-valid\" name=\"protocol\">\n" +
    "                <span translate=\"\" class=\"ng-scope\">Lync</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"popup__controls\">\n" +
    "            <span ng-repeat=\"button in buttons\">\n" +
    "                <button class=\"button \" ng-click=\"clickButton(button, data, dataCheckbox);\" ng-class=\"{ button__ok: button.class==='ok', button__cancel: button.class==='cancel' }\"><span ng-bind=\"button.label\"></span></button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"popupType==='mediaStatistics'\"\n" +
    "    class=\"popup popup__alert\"\n" +
    "    ng-mouseover=\"mouseOver();\"\n" +
    "    ng-mouseleave=\"mouseLeave();\">\n" +
    "        <div class=\"popup__message\">\n" +
    "            <span>\n" +
    "            <table width='640px'>\n" +
    "                <tr>\n" +
    "                  <td ng-repeat=\"(direction, mediatype_data) in message\"\n" +
    "                      style='text-align: center; padding-right: 10px;'>\n" +
    "                    <h2>{{direction}}</h2>\n" +
    "                  <td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                  <td ng-repeat=\"(direction, mediatype_data) in message\"\n" +
    "                      valign=\"top\"\n" +
    "                      style='text-align: center; padding-right: 10px;'>\n" +
    "                    <div ng-repeat=\"(mediatype, stats) in mediatype_data\">\n" +
    "                        <h3>{{mediatype}}</h3>\n" +
    "                        <table width='90%'>\n" +
    "                            <tr ng-repeat=\"(key, value) in stats\">\n" +
    "                                <td style='text-align:left;'>{{key|keyHumanReadable}}</td>\n" +
    "                                <td style='text-align:right;'>{{value}}</td>\n" +
    "                            </tr>\n" +
    "                        </table>\n" +
    "                    <div>\n" +
    "                  </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </span>\n" +
    "        </div>\n" +
    "        <!-- put an input if it's a prompt -->\n" +
    "        <input type=\"input\" class=\"popup__input\" ng-model=\"data\" ng-keyup=\"keyUp($event);\" ng-show=\"popupType==='prompt'\" />\n" +
    "\n" +
    "        <div class=\"popup__controls\">\n" +
    "            <span ng-repeat=\"button in buttons\">\n" +
    "                <button class=\"button \" ng-click=\"clickButton(button, data);\" ng-class=\"{ button__ok: button.class==='ok', button__cancel: button.class==='cancel' }\"><span ng-bind=\"button.label\"></span></button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('assets/templates/popup/container.html',
    "<div>\n" +
    "\t<div ng-repeat=\"popupItem in items\" class=\"repeat-item\" ng-class=\"{ popup__toast__repeat: popupItem.popupType==='toast' }\">\n" +
    "\t\t<!-- create a popup-alert for this item -->\n" +
    "\t\t<div popup-alert message=\"popupItem.message\" popup-type=\"popupItem.popupType\" buttons=\"popupItem.buttons\" updater=\"popupItem.updater\" data=\"popupItem.data\" index=\"{{popupItem.index}}\" timestamp=\"{{ popupItem.timestamp }}\" options=\"popupItem.options\"></div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );

}]);
