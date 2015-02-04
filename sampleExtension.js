angular.module('pexapp.popup')
	.factory('externalPhonebook', function(){
		return {
			init: function(htmlElement, options, cb) {
				htmlElement.innerHTML = '<p>Hello from extension</p>';
				//setTimeout(cb.bind(null, '', {}),2000);
			}
		}
		
	});