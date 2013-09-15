define(['./mixins/events'], function (eventMixin) {

	var Router = Class.extend([eventMixin], {

		init: function (defaultPage) {
			this.defaultPage = defaultPage;
			this.hash = window.location.hash;
			$(window).hashChange();
			$(window).on('hashchange', $.proxy(this.route, this));
		},

		/**
		 * getPage([deep])
		 * @param {Number} [deep]
		 * @return {String|Boolean} page
		 */

		getPage: function (deep) {
			var level = deep || 1;
			var hash = window.location.hash.split('!')[1];
			var page = null;
			if (hash) {
				page = hash.split('/')[level - 1];
			} else if (deep > 1) {
				page = false;
			} else {
				page = this.defaultPage;
			}
			return page;
		},

		route: function (page) {

			var oldHash = this.hash;
			this.hash = window.location.hash;

			if (page && typeof(page) == 'string') {
				this.emit('route', page);
				return;
			}


			var changeDeep = Router.getChangeDeep(this.hash, oldHash);
			page = this.getPage(changeDeep);
			var eventData = {page: page, changeDeep: changeDeep, router: this, old: oldHash};
			this.emit('route', eventData, 'global');
		},

		getDeep: function () {
			if (!this.hash.split('!')[1]) return 0;
			return this.hash.split('/').length;
		}

	}, {
		getChangeDeep: function (hash1, hash2) {
			if (!hash1 || !hash2) return 1;
			hash1 = hash1.split('!')[1];
			hash2 = hash2.split('!')[1];
			if (!hash1 || !hash2) return 1;
			hash1 = hash1.split('/');
			hash2 = hash2.split('/');
			var maxDeep = Math.max(hash1.length, hash2.length);
			for (var i = 0; i < maxDeep; i++) {
				if (hash1[i] != hash2[i]) return i + 1;
			}
			return 1;
		}
	});

	return Router;
});

/*!
 * Hashable jQuery plugin
 * http://www.thepiepers.net/
 *
 * This jQuery plugin enables a website owner to easily bind to the hash value changes.
 * If the Modernizr v2.0+ library is present and the browser supports the hashchange event,
 * it will fire based on change, rather than timer.
 *
 * Usage:
 * <script type="text/javascript">
 *  // the callback will receive the new and old hash values as arguments
 *  $(window).hashChange(callbackFunction);
 *
 *  // or you can bind to the "hashChange" event
 *  $(window).bind("hashChange", function(e, newHash, oldHash) {
 *      console.log("new: " +  newHash);
 *      console.log("old: " + oldHash);
 *  });
 * </script>
 *
 * Copyright (c) 2011, Bryan Pieper
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

	$.fn.hashChange = function(func, options) {

		var settings = {
			initialHash: "",
			delay: 100
		};

		var timer = null;
		var lastHashValue = "";
		var $this = $(this);

		if (typeof options !== "undefined") {
			$.extend(settings, options);
		}

		function parseHash(val) {
			if (!val) {
				val = "";
			} else {
				if (val.substring(0, 1) == "#") {
					val = val.substring(1);
				}
			}
			return val;
		}

		function getCurrentHashValue() {
			return parseHash(window.location.hash);
		}

		function checkHash() {
			// check current hash state
			var currentHash = getCurrentHashValue();
			if (currentHash != lastHashValue) {
				var lastHashValue2 = lastHashValue;

				// reset known hash
				lastHashValue = currentHash;

				// fire hashChange event
				$this.trigger("hashChange", [currentHash, lastHashValue2]);

				if (typeof func !== "undefined") {
					// hashchange callback: new, old
					func(currentHash, lastHashValue2)
				}
			}
		}

		// override initial hash
		lastHashValue = parseHash(settings.initialHash);

		// Modernizr check
		if (typeof Modernizr !== "undefined" && Modernizr.hashchange) {
			// bind to window event change
			$this.bind("hashchange", checkHash);

			// call initial hashChange for page load
			checkHash();
		} else {
			timer = setInterval(checkHash, settings.delay);
		}

	};

})(jQuery);