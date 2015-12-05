var myAppControllers = angular.module('myAppController', []);

myAppControllers.controller('createCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.user = $rootScope.user;
    $scope.createNewEvent = function() {
        console.log('Created');
    };
}]);

myAppControllers.controller('initializeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    // Check if the user exists
}]);

myAppControllers.controller('ratingsCtrl', ['$scope', function($scope) {
    $scope.text = 'These are my ratings';
}]);

myAppControllers.controller('myEventsCtrl', ['$scope', function($scope) {
    $scope.text = 'These are my events';
}]);

myAppControllers.controller('myCirclesCtrl', ['$scope', function($scope) {
    $scope.text = 'These are my circles';
}]);