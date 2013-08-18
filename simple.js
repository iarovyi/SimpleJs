(function(global) {
	//'use strict';
	var Simple = {},
		mixins = {};

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]'
	}

	function namespace(name, root) {
		var origin = root || global,
			segments = isArray(name) ? name : name.split('.');

		for (var i = 0, len = segments.length; i < len; i += 1) {
			if (typeof origin[segments[i]] === "undefined") {
				origin[segments[i]] = {};
			}
			origin = origin[segments[i]];
		}
		return origin;
	}

	function extend(target, source, except) {
		for(var name in source){
			if (source.hasOwnProperty(name) && (!except || except.indexOf(name) === -1))
				target[name] = source[name];
		}
		return target;
	}

	function createMixin(fullName, methods) {
		var segments = fullName.split('.'),
			mixinName = segments.pop(),
			root = namespace(segments, mixins);

		root[mixinName] = extend({}, methods);
	}

	function createClass(classFullName, baseClass, props) {
		var segments = classFullName.split('.'),
			className = segments.pop(),
			root = namespace(segments),
			initiator = function() {
				if (cls.constr && !cls.__initializing) {
					this.constructor = cls;
					this.baseconstructor = this.constructor.prototype.constructor;
					cls.constr.apply(this, arguments);
				}
			},
			cls = new Function("func", "return function " + className + "(){ func.apply(this, arguments); }")(initiator);

		root[className] = cls;
		if(baseClass) {
			baseClass.__initializing = true;
			cls.prototype = new baseClass;
			delete baseClass.__initializing;
			cls.prototype.constructor = baseClass;
			cls.constr = baseClass;
		} else {
			cls.prototype = {};
		}
		if(props) {
			extend(cls.prototype, props, ["constructor"]);
			if (isArray(props.mixins)) {
				for (var i = 0, len = props.mixins.length; i < len; i += 1) {
					extend(cls.prototype, mixins[props.mixins[i]], ["constructor"]);
				}
			}
			cls.constr =  props.constructor || cls.constr;
		}
		return cls;
	};

	var eventBase = {
		__getEvent: function (eventString) {
			this.hasOwnProperty('__events') || (this.__events = {});
			var path = eventString.split('.').reverse(),
				eventName = path.pop(),
				event = this.__events[eventName] || (this.__events[eventName] = {}),
				root = namespace(path, event);

			root.__handlers || (root.__handlers = []);
			return root;
		},
		__getHandlers: function(event) {
			var handlers = event.__handlers.slice();
			for(var k in event) {
				if (event.hasOwnProperty(k) && k !== "__handlers") {
					Array.prototype.push.apply(handlers, this.__getHandlers(event[k]));
				}
			}
			return handlers;
		},
		on: function (eventString, callback, scope) {
			this.__getEvent(eventString).__handlers.push({ handler: callback, scope: scope });
			return this;
		},
		off: function (eventString) {
			var event = typeof eventString === "undefined" ? this.__events : this.__getEvent(eventString);
			for(var k in event) {
				if (k === "__handlers") {
					event.__handlers = [];
				} else {
					delete event[k];
				}
			}
			return this;
		},
		trigger: function (eventString) {
			var args = Array.prototype.slice.call(arguments),
				subscriptions = this.__getHandlers(this.__getEvent(eventString));
			args[0] = this;
			for (var i = 0, l = subscriptions.length; i < l; i++) {
				subscriptions[i].handler.apply(subscriptions[i].scope || this, args);
			}
			return this;
		}
	}

	createClass("Simple.Observable", null, eventBase);
	createMixin("events", eventBase);

	global.Simple = extend(Simple, {
		/**
		 * Define new class
		 * @param  {String}   fullName   comma-delimited full class namespace with name
		 * @param  {Function} baseClass  base class constructor or null if new class has no base class
		 * @param  {Object}   props      plain old object(POJO) with class methods and properties. It can contain
		 *                               mixins array as props.mixins = ["events", "someOtherMixin", ...]
		 * @return {Function}            class constructor
		 */
		defineClass: createClass,
		/**
		 * Define new mixin
		 * @param  {String}   mixin      comma-delimited full mixin namespace with name
		 * @param  {Object}   methods    plain old object with mixin methods and properties
		 */
		defineMixin: createMixin,
		/**
		 * Create namespace
		 * @param  {String}   name       comma-delimited namespace string
		 * @param  {Object}   root       root object of namespace, if not passed window will be used
		 */
		namespace: namespace
	})
})(window);