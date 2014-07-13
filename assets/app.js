$(function() {
  $('nav a').click(function() {
    var $el = $(this);

    if(!$el.hasClass('active')) {
      var view = $el.attr('data-view');
      
      $('.maxes').hide();
      $('.' + view).show();
      
      $('nav a').removeClass('active');
      $el.addClass('active');
    }
  });
});

function AppViewModel(){
  var self = this;

  // Initialize with some defaults
  self.defaultWeight = 200;
  self.defaultReps = 3;

  // Set the observable inputs
  self.weight = ko.observable(self.defaultWeight);
  self.reps = ko.observable(self.defaultReps);
  
  // Set the max arrays
  self.maxes = {
    lombardi: ko.observableArray(),
    bryzcki: ko.observableArray(),
    epley: ko.observableArray(),
    average: ko.observableArray()
  };
  
  // Compute all the things
  self.computeMaxes = ko.computed(function(){

    // Error checking
    if(isNaN(self.weight()) || self.weight() == '') { self.weight(self.defaultWeight); }
    if(isNaN(self.reps()) || self.reps() == '') { self.reps(self.defaultReps); }
    if(self.reps() > 10) { self.reps(10); }

    // Positive whole numbers only
    self.weight(Math.abs(self.weight()));
    self.reps(Math.round(Math.abs(self.reps())));

    // Ensure the arrays are clear
    self.maxes.lombardi.removeAll();
    self.maxes.bryzcki.removeAll();
    self.maxes.epley.removeAll();
    self.maxes.average.removeAll();

    // Compute the 1RM of each formula
    self.maxes.lombardi.push(Math.floor(self.weight() * Math.pow(self.reps(), .10)));
    self.maxes.bryzcki.push(Math.floor(self.weight() * (36 / (37 - self.reps()))));
    self.maxes.epley.push(Math.floor(self.weight() * (1 + (self.reps() / 30))));
    
    // Compute the average 1RM
    self.maxes.average.push(Math.floor(
      (self.maxes.lombardi()[0] +
      self.maxes.bryzcki()[0] +
      self.maxes.epley()[0]) / 3
    ));

    for(reps = 2; reps <= 10; reps++) {
      // Compute the 2-10RM of each formula
      self.maxes.lombardi.push(Math.floor(self.maxes.lombardi()[0] / Math.pow(reps, .10)));
      self.maxes.bryzcki.push(Math.floor(self.maxes.bryzcki()[0] * (37 - reps) / 36));
      self.maxes.epley.push(Math.floor(self.maxes.epley()[0] / ((1 + (reps / 30)))));

      // Compute the average 2-10RM
      self.maxes.average.push(Math.floor(
        (self.maxes.lombardi()[reps - 1] +
        self.maxes.bryzcki()[reps - 1] +
        self.maxes.epley()[reps - 1]) / 3
      ));
    }
  });
}

ko.applyBindings(new AppViewModel());