var myAppControllers = angular.module('myAppController', []);

myAppControllers.controller('createCtrl', ['$scope', function($scope) {
    $scope.createNewEvent = function() {
        console.log('Created');
    };
}]);