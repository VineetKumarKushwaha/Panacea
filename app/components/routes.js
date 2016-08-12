import router from 'angular-route';
import loginSignupController from 'components/loginSignup/loginSignupController.js';
import dashboardController from 'components/dashboard/dashboardController.js';

function config($routeProvider){
    $routeProvider
        .when('/login',{
            templateUrl:'./components/loginSignup/loginSignup.html',
            controller: loginSignupController,
            controllerAs: "vm"
        })
        .when('/dashboard', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: dashboardController,
            controllerAs: "vm"
        })
        .otherwise({redirectTo:'/login'});
}

config.$inject = ['$routeProvider'];

export default config;

