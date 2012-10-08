/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
angular.module('unibot', ['ui']).
controller('MainCtrl', ['$scope', '$http', function($scope, $http){
  $http.get('/commands').success(function(response, code){
    $scope.commands = response;
  });
  $scope.editing = false;
  $scope.save = function(data) {
    $http.post('/commands', data, function(){
      $scope.commands[data.key] = data.value;
    });
  };
  $scope.delete = function(key) {
    $http.delete('/commands/'+key).success(function(){
      delete $scope.commands[key];
    });
  };
}]);