/**
 * unibot Module
 *
 * UniBot AngularJS Site
 */
angular.module('unibot', ['ui']).
controller('MainCtrl', ['$scope', '$resource', function($scope, $resource){
  $scope.Command = $resource();
}]);