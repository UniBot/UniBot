/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
app = angular.module('unibot', ['ngSanitize', 'ui.router', 'ui.bootstrap.pagination', 'template/pagination/pagination.html']);
app.config(function($stateProvider){
  $stateProvider.state('channels', {
    url: '/',
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
  $stateProvider.state('channel', {
    url: '/channel/:channelId',
    templateUrl: 'view.html',
    controller: 'ViewCtrl',
    resolve: {
      channel: function($http, $stateParams){
        return $http.get('/channels/' +$stateParams.channelId);
      }
    }
  });
  $stateProvider.state('channel.plugin', {
    url: '/:plugin',
    templateUrl: function($stateParams) {
      return 'plugins/'+$stateParams.plugin+'.html';
    },
    resolve: {
      plugin: function($http, $stateParams){
        return $http.get('/channels/'+$stateParams.channelId + '/' +$stateParams.plugin);
      }
    },
    controller: 'PluginCtrl'
  });
});

app.run(function($rootScope, $http){
  $http.get('/version').then(function(res){
    $rootScope.version = res.data;
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

app.controller('PluginCtrl', function($scope){
  
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