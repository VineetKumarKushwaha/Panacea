class Authentication {
    constructor($http) {
        this.$http = $http;
        //this.host = "http://10.120.89.187:3000/"
        this.host = "/"
    }

    login (ary, succCal,errorCal) {

        var auth = {
            username: ary[0].value,
            password: ary[1].value
        };

        this.$http({
            method: 'POST',
            url: this.host + 'api/users/login',
            data: auth
        }).then(succCal, errorCal);
    }

    signup (obj,succCal,errorCal) {

        var data = {
            "realm": obj.fname,
            "username": obj.email,
            "email": obj.email,
            "emailVerified": true,
            "password": obj.password
        };
        this.$http({
            method: 'POST',
            url: this.host + 'api/users/',
            data: data
        }).then(succCal, errorCal);
    }

    logoutClicked (id,succCal,errorCal) {
        this.$http({
            method: 'POST',
            url: this.host + 'api/users/logout' + "?access_token=" + id
        }).then(succCal, errorCal);
    }

}


Authentication.$inject = ['$http'];
export default Authentication;