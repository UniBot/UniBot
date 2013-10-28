/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
app = angular.module('unibot', ['ngSanitize']);
app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'list.html',
    controller: 'ListCtrl',
    resolve: {
      channels: function($http){
        return $http.get('/channels').then(function(res){
          return res.data;
        });
      }
    }
  });
  $routeProvider.when('/channel/:id', {
    templateUrl: 'view.html',
    controller: 'ViewCtrl',
    resolve: {
      channel: function($http, $route){
        return $http.get('/channels/' +$route.current.params.id).then(function(res){
          return res.data;
        });
      }
    }
  });
});
app.controller('ListCtrl', function($scope, channels){
  $scope.channels = channels;
  _.map(channels, function(channel){
    channel.commandCount = _.keys(channel.commands).length;
  })
});
app.controller('ViewCtrl', function($scope, channel){
  $scope.channel = channel;
});
app.controller('CommandsCtrl', function($scope, $http){
  $http.get('/commands/'+$scope.channel._id).then(function(res){
    $scope.commands = [];
    angular.forEach(res.data.commands, function(value, key){
      $scope.commands.push({key:key,value:value});
    });
  });
});
app.controller('KarmaCtrl', function($scope, $http){
  $http.get('/karma/'+$scope.channel._id).then(function(res){
    $scope.karmas = [];
    angular.forEach(res.data.karma, function(value, key){
      $scope.karmas.push({key:key,value:value});
    });
  });
});
app.controller('LogsCtrl', function($scope, $http){
  $http.get('/logs/'+$scope.channel._id).then(function(res){
    $scope.logs = res.data && res.data.logs;
  });
});