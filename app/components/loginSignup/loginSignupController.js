import 'components/loginSignup/login.css!css';

class LoginSignupController {
    constructor(authentication, $location, $timeout, $window) {
        this.$location = $location;
        this.validateUser($window);
        this.$timeout = $timeout;
        this.authentication = authentication;
        this.$window = $window;
        this.init()
    }

    init() {
        this.errorText = "";
        this.selectedTab = 1;
        this.loginInputs = [
            {
                type:"text",
                name: "Email Address",
                value: ""
            },
            {
                name:"Password",
                type: "password",
                value: ""
            }
        ];
        this.tab = {
            1: 1,
            2: 2
        };
        this.inputsValue =  {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        this.signup = {};
        this.map = {
            1: "fname",
            2: "lname",
            3: "email",
            4: "password",
            5: "confirmPassword"
        }
    }

    validateUser($window) {
        let obj = $window.sessionStorage.getItem("token");
        if (obj) {
            this.$location.path("/dashboard")
        }
    }

    isAlphabet ($event) {
        let pattern = /^[a-zA-Z]+$/;
        if (!$event.key.match(pattern)) {
            $event.preventDefault();
        }
    }
    isEmailValid (email) {
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (email.match(pattern)) {
            return true;
        }
        return false;
    }
    signupClicked () {
        let vm = this;
        if (Object.keys(this.signup).length !== 5) {
            return;
        } else if (!this.isEmailValid(this.signup.email)){
            this.errorText = "Email is not valid";
            this.$timeout(function () {
                vm.errorText = "";
            },3000);
        } else if (this.signup.password.length < 4 || this.signup.confirmPassword.length < 4) {
            this.errorText = "Password length should be greater than 4";
            this.signup.confirmPassword = "";
            this.signup.password = "";
            this.$timeout(function () {
                vm.errorText = "";
            },3000);
        } else if (this.signup.password !== this.signup.confirmPassword) {
            this.errorText = "Passwords are not same";
            this.signup.confirmPassword = "";
            this.signup.password = "";
            this.$timeout(function () {
                vm.errorText = "";
            },3000);
        } else {
            vm.showLoader = true;
            this.authentication.signup(this.signup,function (data) {
                vm.selectedTab = 2;
                vm.showLoader = false;
                vm.errorText = "Success..!!";
                vm.signup = {};
            }, function (error) {
                vm.errorText = error.statusText;
                vm.showLoader = false;
                vm.$timeout(function () {
                    vm.errorText = "";
                },2000);
            });
        }
    }

    login () {
        let vm = this;
        if (!this.loginInputs[0].value || !this.loginInputs[1].value ) {
            return;
        }
        else {
            vm.showLoader = true;
            this.authentication.login(
                this.loginInputs,
                function (data) {
                    vm.showLoader = false;
                    vm.$window.sessionStorage.setItem("token",data.data.id);
                    vm.$location.path("/dashboard");
            },function (error) {
                    vm.errorText = "Invalid username/password";
                    vm.showLoader = false;
                    vm.$timeout(function () {
                        vm.errorText = "";
                    },2000);
            });
        }
    }
    onFocus (index) {
        this.inputsValue[index] = 1;
    }
    tabClicked (index) {
        this.selectedTab = index;
        this.signup = {};
        this.errorText = "";
    }
    onBlur (index) {
        if (!this.signup[this.map[index]]) {
            this.inputsValue[index] = 0;
        }
    }
}
LoginSignupController.$inject = ['authentication','$location','$timeout', '$window'];

export default LoginSignupController;