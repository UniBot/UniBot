/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
angular.module('unibot', ['ngSanitize']).
controller('MainCtrl', ['$scope', '$http', function($scope, $http){
  $http.get('/commands').success(function(response, code){
    $scope.commands = [];
    angular.forEach(response, function(value, key){
      $scope.commands.push({key:key,value:value});
    });
  });
  $scope.editing = false;
  $scope.save = function(data) {
    $http.post('/commands', data, function(){
      $scope.commands[data.key] = data.value;
    });
  };
  $scope['delete'] = function(key) {
    $http['delete']('/commands/'+key).success(function(){
      delete $scope.commands[key];
    });
  };
}]);