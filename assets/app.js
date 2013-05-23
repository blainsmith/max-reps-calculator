function AppViewModel(){
  var self = this;

  self.coeffs = [1, .95, .93, .90, .87, .85, .83, .80, .77, .75];
  self.defaultWeight = 200;
  self.defaultReps = 3;

  self.weight = ko.observable(self.defaultWeight);
  self.reps = ko.observable(self.defaultReps);
  self.maxes = ko.observableArray();
  self.computeMaxes = ko.computed(function(){
    if(isNaN(self.weight()) || self.weight() == '') { self.weight(self.defaultWeight); }
    if(isNaN(self.reps()) || self.reps() == '') { self.reps(self.defaultReps); }
    if(self.reps() > 10) { self.reps(10); }

    self.weight(Math.abs(self.weight()));
    self.reps(Math.round(Math.abs(self.reps())));

    var single = Math.round(self.weight() / self.coeffs[self.reps() - 1]);

    self.maxes.removeAll();

    ko.utils.arrayForEach(self.coeffs, function(coeff){
      self.maxes.push(Math.round(single * coeff));
    });
  });
}

ko.applyBindings(new AppViewModel());