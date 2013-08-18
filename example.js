Simple.defineClass("App.Car", null, {
	mixins: [ "events" ],
	constructor: function(name) {
        this.name = name;
	},
	getDescription: function() {
		return "Hi, I am car and my name is " + this.name + ". ";
	},
    run: function() {
        return this.trigger('run', this.getDescription());
    }
});

Simple.defineClass("App.Sport.SportCar", App.Car, {
	constructor: function(name, league) {
        this.baseconstructor.apply(this, arguments);
		this.league = league;
	},
    getDescription: function() {
        return App.Car.prototype.getDescription.apply(this) +  "Also I like racing, such as " + this.league + ".";
	}
});

Simple.defineClass("App.Sport.Nissan", App.Sport.SportCar, {
    conditioner: "Mild Flow",
	constructor: function(name, league, model) {
        this.baseconstructor.apply(this, arguments);
		this.model = model;
        this.name = name + " (" + this.model + ")";
	},
    getDescription: function() {
        return App.Sport.SportCar.prototype.getDescription.apply(this) + " I have " + this.conditioner + " system.";
	}
});

var car = new App.Car("Ford");
console.log(car.getDescription());
//Hi, I am car and my name is Ford.

var sportcar = new App.Sport.SportCar("Porsche", "Tour de france");
console.log(sportcar.getDescription());
//Hi, I am car and my name is Porsche. Also I like racing, such as Tour de france

var nissan = new App.Sport.Nissan('Nissan black', 'F1', 'Qashqai XE');
nissan.on('run', function(target, description) {
    console.log(description);
    //Hi, I am car and my name is Nissan black (Qashqai XE). Also I like racing, such as F1 I have Mild Flow system.
}).run().off('run');

//-----------------------------------------------------------------------------
Simple.defineMixin("myExtension", {
    extraMethod: function() {
        console.log('extra method');
    }
});
Simple.defineClass("App.SomeClass", null, {
    mixins: [ "myExtension" ]
});

var some = new App.SomeClass();
some.extraMethod(); //'extra method'

//-----------------------------------------------------------------------------
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













/*
toyota.on('click.plugin.myplugins', function(target, one) {
console.log('trigger   click.plugin.myplugins');
});
toyota.on('click.myplugins', function(target, two) {
console.log('trigger   click.myplugins');
});

toyota.trigger('click.myplugins', 1, 2, 3);
console.log(toyota.__events);
debugger;
toyota.off('click');
toyota.trigger('click.myplugins', 1, 2, 3);      */



