import angular from 'angular';
import {app} from './components/main.js';

angular.element(document.body).ready(function() {
    angular.bootstrap(document, [app.name]);
});