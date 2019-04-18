import * as angular from 'angular';

angular.module('authenticationService')

// idea and some implementation from https://github.com/witoldsz/angular-http-auth
  .service('Authentication', ($cookies, $injector, $window, $routeParams, RequestBuffer) => {
    let User;
    let Token;

    function redirectToLogin() {
      $window.location.href = 'http://localhost:3000/'; // eslint-disable-line no-param-reassign, max-len
    }

    return () => {
      User = User || $injector.get('User');
      Token = Token || $injector.get('Token');

      if (Token.token() && Token.exp() > (Date.now() / 1000)) {
        User.newToken()
          .then(RequestBuffer.retryAll)
          .catch(redirectToLogin);
      } else {
        redirectToLogin();
      }
    };
  })

  .service('AuthInterceptor', ['$q', '$window', 'RequestBuffer', 'Authentication', ($q, $window, RequestBuffer, Authentication) => { // eslint-disable-line arrow-body-style, max-len
    return {
      responseError: (rejection) => {
        if (rejection.status === 401) {
          if (!rejection.config.ignoreAuthentication) {
            const deferred = $q.defer();
            const bufLen = RequestBuffer.append(rejection.config, deferred);
            if (bufLen === 1) {
              Authentication();
            }
          }
        }
        return $q.reject(rejection);
      },
    };
  }])

  .service('RequestBuffer', ['$injector', ($injector) => {
    const buffer = [];
    let $http;

    return {
      append: (config, deferred) => buffer.push({ config, deferred }),
      rejectAll: (reason) => {
        buffer.map(n => n.deferred.reject(reason));
        buffer.length = 0;
      },
      retryAll: () => {
        buffer.map((obj) => {
          $http = $http || $injector.get('$http');

          $http(obj.config).then((res) => {
            obj.deferred.resolve(res);
          }, (res) => {
            obj.deferred.reject(res);
          });

          return obj;
        });
        buffer.length = 0;
      },
    };
  }])

  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push(['$injector', $injector => $injector.get('AuthInterceptor')]);
  }]);
