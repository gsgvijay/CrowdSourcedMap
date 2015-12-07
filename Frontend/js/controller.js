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


myAppControllers.controller('viewCtrl', function($scope, $rootScope, $http, $location, NgMap) {
    if($rootScope.user == null) {
        $rootScope.user = 'vijay';
    }
    var user = $rootScope.user;
    var ne_lat, ne_lng, sw_lat, sw_lng;

    $scope.clicked = function() {
        $location.path('/showEvent');
    }
    
    /*$scope.$on('mapInitialized', function(evt, map) {
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
        
    });*/
    $scope.zoomEvent = function() {
        NgMap.getMap().then(function(map) {
            var ne = map.getBounds().getNorthEast();
            var sw = map.getBounds().getSouthWest();
            ne_lat = ne['lat']();
            ne_lng = ne['lng']();
            sw_lat = sw['lat']();
            sw_lng = sw['lng']();
            var getEvents_Url = $rootScope.getEvents + user + "/" + ne_lat + "/" + ne_lng + "/" + sw_lat + "/" + sw_lng;
            $http({
                method: 'GET',
                url: getEvents_Url
            }).then(function(data) {
                var markers = data.data;
                var lat = markers.latitude;
                var lng = markers.longitude;
                var latlng = new google.maps.LatLng(lat, lng);
                console.log(latlng);
                console.log(markers);
                var type = markers.type;
                var icon_loc = 'resources/images/';
                if(type === "positive") {
                    icon_loc = icon_loc + 'positive.png';
                }
                else if(type === 'neutral') {
                    icon_loc = icon_loc + 'neutral.png';
                }
                else {
                    icon_loc = icon_loc + 'negative.png';
                }
                
                $scope.event_name = markers.name;
                $scope.event_user = markers.user;
                
                $scope.postRating = function() {
                    $scope.marker_clicked = false;
                }
                
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    icon: icon_loc,
                    title: markers.name
                });
                
                marker.addListener('click', function() {
                    $rootScope.event_name = markers.name;
                    $rootScope.event_user = markers.user;
                    $scope.clicked();
                });
            });
        });
    }
});


myAppControllers.controller('initializeCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    // Check if the user exists
    if($rootScope.user == null) {
        $rootScope.user = 'vijay';
    }
    var user = $rootScope.user;
    var login_address = $rootScope.login + user;
    $http({
        method: 'GET',
        url: login_address
    }).then(function(data) {
        console.log('Login Success');
    });
}]);


myAppControllers.controller('profileCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    if($rootScope.user == null) {
        $rootScope.user = 'vijay';
    }
    $scope.ratings = false;
    $scope.circles = false;
    $scope.getRating = function() {
        $scope.ratings = true;
        $scope.circles = false;
        var user = $rootScope.user;
        var url = $rootScope.getRatings + user;
        $http({
            method: 'GET',
            url: url
        }).then(function(data) {
            ratings = data.data;
            $scope.Message = 'Total Ratings: ' + ratings;
        });
    };
    
    $scope.getCircles = function() {
        $scope.ratings = false;
        $scope.circles = true;
    }
    
    $scope.addToCircles = function() {
        if($scope.other_user == null || $scope.relationship == null) {
            $scope.CircleMessage = 'Invalid Entries';
        }
        else {
            var user = $rootScope.user;
            var other = $scope.other_user;
            var rel = $scope.relationship;
            var url = $rootScope.addCircle + user +"/" + other + "/" + rel;
            $http({
                method: 'GET',
                url: url
            }).then(function(data) {
                var val = data.data;
                if(val == "1") {
                    alert('Done');
                    $location.path('/myProfile');
                }
                else {
                    $scope.CircleMessage = 'User does not exist';
                }
            });
        }
    }
}]);


myAppControllers.controller('showEventCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    $scope.event_name = $rootScope.event_name;
    $scope.event_user = $rootScope.event_user;
    $scope.postRating = function() {
        var url = $rootScope.postRatings + $scope.event_user + "/";
        if($scope.event_rating == "postive") {
            url = url + "1";
        }
        else {
            url = url + "-1";
        }
        $http({
            method: 'GET',
            url: url
        }).then(function(data) {
            
        });
        $location.path('/view');
    };
}]);
