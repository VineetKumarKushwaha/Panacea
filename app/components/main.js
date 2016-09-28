import router from 'angular-route';
//import angular_google_picker from 'angular-google-picker';
import config from 'components/routes.js';
import authentication from 'services/authentication.js'

export  var app = angular.module('mainModule', ['ngRoute'])
    .config(config)
    .service('authentication',authentication);