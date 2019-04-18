import * as angular from 'angular';
import template from './progress-dialog.template.html';

class ProgressDialogCtrl {
  constructor($timeout, $rootScope, $http, Error) {
    Object.assign(this, { $timeout, $rootScope, $http, Error });
  }

  $onInit() {
    this.progress = false;
    console.log('this.resolve.data', this.resolve.data);
    console.log('this.$rootScope.token.id', this.$rootScope.token.id);
    this.$http.post('/api/create-customer', JSON.stringify(angular.copy(this.resolve.data)), { headers: { 'Content-Type': 'application/json', Authorization: this.$rootScope.token.id } })
      .then(() => {
        this.progress = false;
        this.submitted = false;
      })
      .catch((httpResponse) => {
        this.modalInstance.dismiss();
        console.log('error', httpResponse); // eslint-disable-line no-console
        this.Error.message(httpResponse.data || `${httpResponse.status} ${httpResponse.statusText}`);
        this.submitted = false;
      });
  }

  cancel() {
    this.modalInstance.dismiss('cancel');
  }
}

angular.module('progressDialog')

  .component('progressDialog', {
    template,
    bindings: {
      modalInstance: '<',
      resolve: '=',
    },
    controller: ProgressDialogCtrl,
  });
