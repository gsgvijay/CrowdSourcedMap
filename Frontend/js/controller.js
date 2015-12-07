var myAppControllers = angular.module('myAppController', []);


myAppControllers.controller('loginCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    $scope.login = function() {
        var password = $scope.password;
        var username = $scope.user;
        if(username == "" || password == "") {
            $scope.Message = "Invalid Credentials. Please try again!";
            return;
        }
        $http({
            method: 'GET',
            url: $rootScope.login + username
        }).then(function(data) {
            var actualPass = data.data;
            if(actualPass == "0" || password != actualPass) {
                $scope.Message = "Invalid Credentials. Please try again!";
            }
            else {
                $scope.Message = "Login successful.";
                $rootScope.user = username;
                $location.path('/mainView');
            }
        });
    };
    
    $scope.register = function() {
        $location.path('/register');
    };
}]);


myAppControllers.controller('registerCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    $scope.register = function() {
        var user = $scope.user;
        var pass1 = $scope.password1;
        var pass2 = $scope.password2;
        if(user=='' || user==null || pass1=='' || pass1==null || pass2=='' || pass2==null) {
            alert('Invalid entries. Try again!');
            return;
        }
        else if(pass1 != pass2) {
            alert('Passwords don\'t match');
            return;
        }
        $http({
            method: 'GET',
            url: $rootScope.register + user + "/" + pass1
        }).then(function(data) {
            if(data == "0") {
                alert("Username exists");
                return;
            }
            else {
                $location.path('/login');
            }
        });
    };
}]);


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
    $scope.markers = [];
    $scope.showName = function(name) {
        alert(name);
    }
    $scope.$on('mapInitialized', function(evt, map) {
        var ne = map.getBounds().getNorthEast();
        var sw = map.getBounds().getSouthWest();
        ne_lat = ne['lat']();
        ne_lng = ne['lng']();
        sw_lat = sw['lat']();
        sw_lng = sw['lng']();
        console.log("Bounds:",ne_lat, ne_lng, sw_lat, sw_lng);
        var getEvents_Url = $rootScope.getEvents + user + "/" + ne_lat + "/" + ne_lng + "/" + sw_lat + "/" + sw_lng;
        $http({
            method: 'GET',
            url: getEvents_Url
        }).then(function(data) {
            $scope.markers = data.data;
            console.log($scope.markers);
        });
        
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
            var getEvents_Url = $rootScope.getEvents + user + "/" + ne_lat + "/" + ne_lng + "/" + sw_lat + "/" + sw_lng;
            $http({
                method: 'GET',
                url: getEvents_Url
            }).then(function(data) {
                $scope.markers = data.data;
                console.log($scope.markers);
            });
        });
    }
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