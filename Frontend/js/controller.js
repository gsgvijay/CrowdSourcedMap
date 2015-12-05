var myAppControllers = angular.module('myAppController', []);

myAppControllers.controller('createCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    $scope.createNewEvent = function() {
        var user = $rootScope.user;
        var geocoder = new google.maps.Geocoder();
        var address = $scope.address;
        var lat = 0;
        var lng = 0;
        var name = $scope.nameOfEvent;
        var visibility = $scope.visibility;
        var etype = $scope.etype;
        var duration = parseInt($scope.duration) * 3600;
        geocoder.geocode({'address': address}, function(results, status) {
            if(status === google.maps.GeocoderStatus.OK) {
                var newLocation = results[0].geometry.location;
                lat = newLocation['lat']();
                lng = newLocation['lng']();
                var post_address = $rootScope.postEvent + user + "/" + name + "/" + visibility + "/" + etype + "/" + lat + "/" + lng + "/" + duration;
                $http({
                    method: 'GET',
                    url: post_address
                }).then(function(data) {
                    console.log('Event Created');
                    console.log(data['data']);
                });
            }
        });
    };
}]);


myAppControllers.controller('viewCtrl', function($scope, $rootScope, $http, NgMap) {
    var user = $rootScope.user;
    var ne_lat, ne_lng, sw_lat, sw_lng;
    $scope.$on('mapInitialized', function(evt, map) {
        var ne = map.getBounds().getNorthEast();
        var sw = map.getBounds().getSouthWest();
        ne_lat = ne['lat']();
        ne_lng = ne['lng']();
        sw_lat = sw['lat']();
        sw_lng = sw['lng']();
        console.log("Bounds:",ne_lat, ne_lng, sw_lat, sw_lng);   
    });
    $scope.zoomEvent = function() {
        NgMap.getMap().then(function(map) {
            var ne = map.getBounds().getNorthEast();
            var sw = map.getBounds().getSouthWest();
            ne_lat = ne['lat']();
            ne_lng = ne['lng']();
            sw_lat = sw['lat']();
            sw_lng = sw['lng']();
            console.log("Bounds:",ne_lat, ne_lng, sw_lat, sw_lng);    
        });
    }
    //var map = new google.maps.Map(document.getElementById("gmap"));
});


myAppControllers.controller('initializeCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    // Check if the user exists
    var user = $rootScope.user;
    var login_address = $rootScope.login + user;
    $http({
        method: 'GET',
        url: login_address
    }).then(function(data) {
        console.log('Login Success');
    });
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