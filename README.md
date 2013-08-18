SimpleJs
========

[SimpleJs](https://github.com/iarovyi/SimpleJs/blob/master/simple.js) is small (hundred code lines or less than 2kb size) and simple class-event system.
 With SimpleJs we can build complex and clear javascript logic that hard to implement without classic inheritance.
 
 So SimpleJs creates:
 * Inheritance system with `classes` and `mixins`
 * `Event system` with jquery-like namespaces structure

Where to use SimpleJs?
-------------------------
Mostly web sites doesn't need classes because it relatively simple but sometimes inheritance can make code simplier and cleaner.
SimpleJs is a good choice in this case because its tiny and brings us all the power of events and inheritance.

 
Inheritance
================================
 We can difine class like:

```
Simple.defineClass("App.Car", null, {
	constructor: function(name) {
      this.name = name;
	},
	getDescription: function() {
      //...
	}
});

Simple.defineClass("App.Sport.SportCar", App.Car, {
  //...
});
```

 We can call base class methods:
```
 Simple.defineClass("App.Sport.SportCar", App.Car, {
	constructor: function(name, league) {
        this.baseconstructor.apply(this, arguments);
        this.league = league;
	},
    getDescription: function() {
        return App.Car.prototype.getDescription.apply(this) +  "Also I like racing, such as " + this.league + ".";
	}
});
```

Mixins
================================
 Sometimes we want add some logic to many classes that doesn't have common base class. In this case we can define
 mixin - set of methods and properties that will be added to any classes we want.
 We can define mixin as: 
```
 Simple.defineMixin("myExtension", {
    extraMethod: function() {
        //...
    }
});
```
And then mixin can be added to any class:
```
 Simple.defineClass("App.SomeClass", null, {
    mixins: [ "myExtension" ],
    //...
});
```
SimpleJs has one predifined mixin "events" that adds ability to trigger events.

Events
================================
Instances can raise events in case if class derived "Simple.Observable" or class or one of its parent classes 
has mixin "events"
```
Simple.defineClass("App.SomeClass", "Simple.Observable", {
	//...
});
```
or 
```
Simple.defineClass("App.SomeClass", null, {
    mixins: [ "events" ],
    //...
});
```
We can subscribe, trigger and dispose events the same way as most of all developers got used to with popular jQuery library.
```
var nissan = new App.Sport.Nissan('Nissan black', 'F1', 'Qashqai XE');
nissan.on('run', function(target) { //... });
nissan.off('run');
```

Event namespaces
-------------------------
Javascript benefit from usage of anonymous functions and mostly it's not convinient to keep rererence to subscrbed method
that why jQuery has such a feature as event namespace. With SimpleJs can trigger or remove handlers not only for some event but also we
can do it to some subset of handlers of some event. Namespases can be many-level nested.

```
nissan.on("run", function() { console.log("handler #1"); }, this)
      .on("run.plugins", function() { console.log("handler #2"); }, this)
      .on("run.watchPlugin.plugins", function() { console.log("handler #3"); }, this);

nissan.trigger('run'); //handler #1  handler #2  handler #3

//remove "run" event handlers for "watchPlugin.plugins" namespace
nissan.off("run.watchPlugin.plugins")
      .trigger('run'); //handler #1  handler #2

//remove "run" event handlers for "plugins" namespace
nissan.off("run.plugins")
      .trigger('run'); //handler #1

//remove "run" event handlers
nissan.off("run")
      .trigger('run'); //

//remove all events handlers
nissan.off()
      .trigger('run')  //
```





























 
