define(function () {

	var DIRRECTION_ALL = 'all';
	var DIRRECTION_PARENT = 'parent';
	var DIRRECTION_CHILDREN = 'children';
	var DIRRECTION_GLOBAL = 'global';

	return {

		/**
		 * emit (name[,data [,dirrection] [,callback]])
		 * @param {String} name
		 * @param {Object} [data]
		 * @param {String} [dirrection='all']
		 * @param {Function} [callback]
		 */
		emit: function (name, data, dirrection, callback) {

			//swap arguments
			if (dirrection && $.isFunction(dirrection)) callback = dirrection;
			dirrection = dirrection || 'all';

			var e = {name: name, data: data, sender: this, direction: null, way: 'children', isGlobal: false}

			if ((dirrection == DIRRECTION_ALL || dirrection == DIRRECTION_CHILDREN) && this.children) {
				for (var itemName in this.children) {
					var item = this.children[itemName];
					item._on(e);
				}
			}

			if ((dirrection == DIRRECTION_ALL || dirrection == DIRRECTION_PARENT) && this.parent) {
				e = $.extend({}, e, {way: 'parent'});
				this.parent._on(e);
			}

			if (dirrection == DIRRECTION_GLOBAL) {
				var topParent = this;
				while (topParent.parent) topParent = topParent.parent;

				e = $.extend({}, e, {way: 'children', isGlobal: true});

				var fnSendEvent = function (node) {
					node._on(e);
					for (var nodeName in node.children) {
						fnSendEvent(node.children[nodeName]);
					}
				}

				fnSendEvent(topParent);
				callback && setTimeout(callback);
			}
		},

		_on: function (e) {

		}

	}


});