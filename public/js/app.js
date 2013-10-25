/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
angular.module('unibot', ['ngSanitize']).
config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'list.html',
    controller: 'ListCtrl',
    resolve: {
      channels: function($http){
        return $http.get('/channels').then(function(res){
          return res.data
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
          return res.data
        });
      }
    }
  });
}).
controller('ListCtrl', function($scope, channels){
  $scope.channels = channels;
  _.map(channels, function(channel){
    channel.commandCount = _.keys(channel.commands).length;
  })
}).
controller('ViewCtrl', function($scope, channel){
  $scope.channel = channel;
  $scope.commands = [];
  angular.forEach(channel.commands, function(value, key){
    $scope.commands.push({key:key,value:value});
  });
});