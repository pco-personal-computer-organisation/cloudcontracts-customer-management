import * as angular from 'angular';
import template from './login-page.template.html';

class LoginPageCtrl {
  constructor($location, $timeout, $http, $rootScope, Error) {
    Object.assign(this, { $location, $timeout, $http, $rootScope, Error });

    this.shake = false;

    this.credentials = {};
    this.wrongcreds = false;
  }

  reset() {
    this.wrongcreds = false;
  }

  static focusNext(name) {
    angular.element(`input[name="${name}"]`).focus();
  }

  login() {
    const creds = angular.copy(this.credentials);

    this.submitted = true;

    if (!creds.email.includes('@')) {
      creds.username = creds.email;
      delete creds.email;
    }

    this.$http.post('/api/login', JSON.stringify(creds), { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        this.progress = false;
        this.submitted = false;
        this.$rootScope.token = res.data;
        this.$location.path('/create-customer/');
      })
      .catch((httpResponse) => {
        console.log('error', httpResponse); // eslint-disable-line no-console
        this.Error.message(`${httpResponse.status} ${httpResponse.statusText}`);
        this.submitted = false;
      });
  }
}

angular.module('loginPage')

  .component('loginPage', {
    template,
    controller: LoginPageCtrl,
  });
