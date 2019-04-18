import * as angular from 'angular';

angular.module('userModel')

  .service('User', ($http, $window, $location, ObjectResourceMapper, Token) => {
    const baseUrl = $location.absUrl().replace($location.path(), '/v1/users');
    const funcs = ObjectResourceMapper(baseUrl);

    funcs.login = data => $http.post(`${baseUrl}/login`, data, { ignoreAuthentication: true }).then((d) => {
      Token.setToken(d.data);
      return d.data;
    });

    funcs.newToken = () => $http.post(`${baseUrl}/newToken`, undefined, { ignoreAuthentication: true }).then((d) => {
      Token.setToken(d.data);
      return d.data;
    });

    funcs.getCurrent = () => funcs.findById(Token.userId());

    return funcs;
  });
