import 'babel-polyfill';
import * as $ from 'jquery'; // eslint-disable-line no-unused-vars
import * as angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'angular-ui-bootstrap/dist/ui-bootstrap-csp.css';
import 'csshake/dist/csshake.css';
import 'angular-route';
import 'angular-resource';
import 'angular-translate';
import 'angular-animate';
import 'angular-sanitize';
// import './../assets/css/login.css';
import './components/create-customer';
import './components/main';
import './components/login-page';

/* eslint-disable no-param-reassign */

angular.module('pcoCloud', ['createCustomer', 'loginPage', 'main', 'ngRoute', 'ngResource', 'pascalprecht.translate', 'ngAnimate', 'ngSanitize']) // eslint-disable-line no-undef

  .directive('prime', () => {
    console.log('No starship may interfere with the normal development of any alien life or society.'); // eslint-disable-line no-console
  })

  .directive('clickAndDisable', ['$parse', ($parse) => { // eslint-disable-line arrow-body-style
    return {
      restrict: 'A',
      compile: ($element, attr) => { // from anuglar's ng-click
        const fn = $parse(attr.clickAndDisable, /* interceptorFn */ null, /* expensiveChecks */ true); // eslint-disable-line max-len
        return function ngEventHandler(scope, element) {
          element.on('click', (event) => {
            const callback = () => fn(scope, { $event: event });
            element.prop('disabled', true);

            scope.$apply(callback).then(() => {
              element.prop('disabled', false);
            });
            element.prop('disabled', false);
          });
        };
      },
    };
  }])

  .directive('required', () => { // eslint-disable-line arrow-body-style
    return {
      restrict: 'A',
      terminal: true,
      compile: () => { // eslint-disable-line arrow-body-style
        return {
          pre: (scope, element) => {
            const input = element;
            const label = angular.element(`label[for='${input.attr('name')}']`);
            const formScope = scope.$ctrl[input.closest('form').attr('name').substring(6)]; // TODO: maybe use $parse from angular?
            const formGroup = label.closest('.form-group');

            input.bind('blur', () => {
              formGroup.toggleClass('has-error', formScope[input.attr('name')].$invalid);
            });

            label.append(' <span class="required">*</span>');
          },
        };
      },
    };
  })

  .directive('inputFocusFunction', () => { // eslint-disable-line arrow-body-style
    return {
      restrict: 'A',
      link: (scope, element, attr) => {
        scope.fn[attr.inputFocusFunction] = () => {
          element.focus();
        };
      },
    };
  })

  .controller('AppCtrl', ['$scope', '$route', ($scope, $route) => {
    $scope.$route = $route;
  }])

  .config(['$qProvider', ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  }])

  .config(['$routeProvider', '$locationProvider', '$translateProvider', ($routeProvider, $locationProvider, $translateProvider) => {
    $routeProvider
      .when('/login/', {
        template: '<login-page></login-page>',
        isLogin: true,
      })
      .when('/create-customer/', {
        template: '<create-customer></create-customer>',
      })
      .otherwise({ redirectTo: '/login/' });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true,
      rewriteLinks: true,
    });

    $translateProvider.translations('de', {
    });
    $translateProvider.preferredLanguage('de'); // $translateProvider.determinePreferredLanguage();
  }]);
