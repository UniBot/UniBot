/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
app = angular.module('unibot', ['ngSanitize', 'ui.router']);
app.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('channels', {
    url: '/',
    templateUrl: 'list.html',
    controller: 'Channels',
    resolve: {
      channels: function($http){
        return $http.get('/channels').then(function(response){
          return response.data;
        });
      }
    }
  });
  $stateProvider.state('channel', {
    url: '/channel/:channel',
    templateUrl: 'view.html',
    controller: 'Channel',
    resolve: {
      channel: function($http, $stateParams){
        return $http.get('/channels/' +$stateParams.channel).then(function(response){
          return response.data;
        }, function(err){
          $state.go('channels');
        });
      }
    }
  });
  $stateProvider.state('channel.plugin', {
    url: '/:plugin',
    templateUrl: function($stateParams) {
      return '/'+$stateParams.plugin;
    },
    resolve: {
      plugin: function($http, $stateParams, $state){
        return $http.get('/'+$stateParams.plugin + '/' + $stateParams.channel).then(function(response){
          return response.data;
        }, function(err){
          $state.go('channel');
        });
      }
    },
    controller: 'Plugin'
  });
});

app.run(function($rootScope, $http){
  $http.get('/version').then(function(res){
    $rootScope.version = res.data;
  });
});

app.controller('Channels', function($scope, channels){
  $scope.filter = '';
  $scope.channels = channels;
  _.map(channels, function(channel){
    channel.commandCount = _.keys(channel.commands).length;
  })
});

app.controller('Channel', function($scope, channel){
  $scope.channel = channel;
});

app.controller('Plugin', function($scope, channel, plugin){
  $scope.channel = channel;
  $scope.plugin = plugin;
  $scope._ = _;
  $scope.toArray = function(collection) {
    var response = [];
    for (var key in collection)
      response.push({ key: key, value: collection[key] });
    return response;
  };
});

app.controller('CommandsCtrl', function($scope, $http){
  $http.get('/plugins/commands/'+$scope.channel._id).then(function(res){
    $scope.commands = [];
    angular.forEach(res.data.commands, function(value, key){
      $scope.commands.push({key:key,value:value});
    });
  });
});

app.controller('KarmaCtrl', function($scope, $http){
  $http.get('/plugins/karma/'+$scope.channel._id).then(function(res){
    $scope.karmas = [];
    angular.forEach(res.data.karma, function(value, key){
      $scope.karmas.push({key:key,value:value});
    });
  });
});

app.controller('LogsCtrl', function($scope, $http){
  $http.get('/plugins/logs/'+$scope.channel._id).then(function(res){
    $scope.logs = res.data && res.data.logs;
  });
  $scope.currentPage = 1;
  $scope.$watch('filter', function(newVal, oldVal){
    $scope.currentPage = 1;
  });
});