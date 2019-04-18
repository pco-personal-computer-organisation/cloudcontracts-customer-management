import * as angular from 'angular';

angular.module('token')

  .service('Token', ($http, $window, $routeParams, $cookies) => {
    if ($routeParams.token) {
      $http.defaults.headers.common.Authorization = $routeParams.token; // eslint-disable-line no-param-reassign, max-len
    } else {
      $http.defaults.headers.common.Authorization = $cookies.get('token'); // eslint-disable-line no-param-reassign, max-len
    }

    return {
      setToken: (token) => { $http.defaults.headers.common.Authorization = token; }, // eslint-disable-line no-param-reassign, max-len
      userId: () => JSON.parse($window.atob($http.defaults.headers.common.Authorization.split('.')[1])).id,
      token: () => $http.defaults.headers.common.Authorization,
      exp: () => JSON.parse($window.atob($http.defaults.headers.common.Authorization.split('.')[1])).exp,
    };
  });
