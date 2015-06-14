var app = angular.module('myApp', []);
app.controller('MonteController', ['$http', '$log', '$scope', function($http, $log, $scope) {
	$scope.log=$log;
	$log.log('kenny is evil');
	$scope.InitFund = 1;
	$scope.Times = 1;
	$scope.Years = 1;
	$scope.Mean = 0.2;
	$scope.Stdv = 0.2;
	
	$scope.FinalResult = 0;
	$scope.myData = {};
	$scope.myData.doClick = function(item, event){
		//destroy the chart first
		destroyChart();
		
		$log.log("Mean is " + $scope.Mean);
		$log.log("Years is " + $scope.Years);
		$log.log("Times is " + $scope.Times);
		$log.log("Stdv is " + $scope.Stdv);
		
		var object = {
			Times : parseInt($scope.Times),
			Years : parseInt($scope.Years),
			Mean  : parseFloat($scope.Mean)/100,
			Stdv  : parseFloat($scope.Stdv)/100,
			
		}

		$log.log("InitFund is " + $scope.InitFund);
		var responsePromise = $http.post('/test/', object);
		responsePromise.success(function(data, status, headers, config) {
            $scope.FinalResult = redraw(data, status, headers, config, $scope.InitFund);
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("POST failed!");
        });
	};
	$scope.redraw = {};
	$scope.redraw.doClick = function(){
		var ctx = document.getElementById("canvas").getContext("2d");
		console.log("inside redraw onclick");
		window.myLine = new Chart(ctx).Line(lineChartData, options);
	}
}]);

app.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }
	  
      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});