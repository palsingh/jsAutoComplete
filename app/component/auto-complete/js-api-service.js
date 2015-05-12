angular.module("jsAutoComplete").service("jsAPI", ["$http", "$q", function ($http, $q) {
    this.apiCall = function (url) {
        var dfd = $q.defer();
        $http.get(url, { timeout: dfd.promise }).
            success(dfd.resolve).error(dfd.reject);
        return dfd;
    }
}]);