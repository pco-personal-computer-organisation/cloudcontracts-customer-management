import * as angular from 'angular';

// import template from './main.template.html';

/* eslint-disable no-param-reassign */

class MainCtrl {
  constructor($scope, $location, $uibModal, User) {
    $scope.$location = $location;
    $scope.user = User.getCurrent();

    $scope.isActive = viewLocation => viewLocation === $location.path();
  }
}

angular.module('main')

  .component('main', {
    // template,
    controller: MainCtrl,
  });
