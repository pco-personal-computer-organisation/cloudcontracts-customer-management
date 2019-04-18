import * as angular from 'angular';

angular.module('objectResourceMapper')

  .service('ObjectResourceMapper', ($http) => {
    class Resource {
      constructor(baseUrl, values) {
        const data = values.data || {};

        Object.assign(this, data);
      }

      save() {
        return $http.put(`${this.baseUrl}/${this.id}`, this.toJson());
      }

      destroy() {
        return $http.delete(`${this.baseUrl}/${this.id}`);
      }

      toJson() {
        const data = angular.copy(this);
        delete data.save;
        delete data.destroy;
        delete data.toJson;
        delete data.baseUrl;
        return data;
      }
    }

    return (baseUrl) => { // eslint-disable-line arrow-body-style
      return {
        findAll: params => $http.get(baseUrl, { params }).then(values => Resource(baseUrl, values)), // eslint-disable-line max-len
        create: data => $http.post(baseUrl, data).then(values => Resource(baseUrl, values)), // eslint-disable-line max-len
        findById: (id, params) => $http.get(`${baseUrl}/${id}`, { params }).then(values => Resource(baseUrl, values)), // eslint-disable-line max-len
      };
    };
  });
