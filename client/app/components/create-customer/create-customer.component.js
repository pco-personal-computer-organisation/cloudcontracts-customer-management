import * as angular from 'angular';
import template from './create-customer.template.html';

class CreateCustomerCtrl {
  constructor($location, $timeout, $http, $window, $uibModal, $rootScope, Error) {
    Object.assign(this, { $location, $timeout, $http, $window, $uibModal, $rootScope, Error });

    this.clearFields();
    // this.progress = true;
  }

  clearFields() {
    this.values = {
      maxUsers: 3,
    };
  }

  static focusNext(name) {
    angular.element(`input[name="${name}"]`).focus();
  }

  create() {
    this.submitted = true;
    this.progress = true;

    const obj = {
      customer: {
        name: this.values.firma,
        kdnr: this.values.kdnr,
        maxUsers: this.values.maxUsers,
      },
      user: {
        email: this.values.email,
        username: this.values.email,
        vorname: this.values.vorname,
        nachname: this.values.name,
      },
      createdBy: this.$rootScope.token.user.username,
    };

    const modalInstance = this.$uibModal.open({
      component: 'progressDialog',
      resolve: {
        data: () => obj,
      },
    });

    modalInstance.result.then(() => {
      this.clearFields();
    }, () => {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  }
}

angular.module('createCustomer')

  .component('createCustomer', {
    template,
    controller: CreateCustomerCtrl,
  });
