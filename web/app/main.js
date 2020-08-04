angular
    .module("ohm-delivery", [])
    .controller("ohmstatus", function($scope, $rootScope, $http) {

        // Keep tracking statuses in rootScope
        $rootScope.trackingStatuses = [];

        // Get tracking statuses from server
        $http.get(`/trackingStatuses`).then(res => {
            $rootScope.trackingStatuses = res.data;
            console.log($scope.trackingStatuses);
        }).catch(err => {
            console.log(err);
        });

        // Progress delivery status
        $scope.progressTracking = function() {
            console.log('OKOK TEST');

            $scope.loading = true;

            $http.post(`/ohms/${$scope.ohm.id}/progress`).then((res) => {
                $rootScope.ohm = res.data;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                // just to show loadder a bit more :)
                setTimeout(() => $scope.$apply(() => $scope.loading = false), 800);
            });
        };

        // Finalize the delivery
        $scope.finalizeTrackingById = function() {
            $scope.loading = true;

            $http.post(`/ohms/${$scope.ohm.id}/finalize`, JSON.stringify({success : !!$scope.finalizeStatus, note : $scope.finalizeComment})).then((res) => {
                $rootScope.ohm = res.data;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                $("#finalizeModal").modal('hide');
                // just to show loadder a bit more :)
                setTimeout(() => $scope.$apply(() => $scope.loading = false), 800);
            })
        }

        // Reorder same product
        $scope.reorder = function() {
            $scope.loading = true;

            $http.post(`/ohms/${$scope.ohm.id}/reorder`).then((res) => {
                $rootScope.ohm = res.data;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                // just to show loadder a bit more :)
                setTimeout(() => $scope.$apply(() => $scope.loading = false), 800);
            })
        }

        // Add a comment to a delivery
        $scope.addComment = function() {
            $scope.loading = true;
            $http.post(`/ohms/${$scope.ohm.id}/addcomment`, JSON.stringify({comment : $scope.ohm.comment})).then((res) => {
                $rootScope.ohm = res.data;
            }).catch(err => {
                console.log(err);
                $scope.commentErrorMessage = 'An error occured when saving the comment, please try again';
            }).finally(() => {
                // just to show loadder a bit more :)
                setTimeout(() => $scope.$apply(() => $scope.loading = false), 800);
            })
        };

        $scope.canStatusProgress = function(status) {
            return $rootScope.trackingStatuses.includes(status) && $rootScope.trackingStatuses.indexOf(status) < $rootScope.trackingStatuses.length - 1;
        };

        $scope.canStatusFinalize = function(status) {
            return $rootScope.trackingStatuses.includes(status) && $rootScope.trackingStatuses.indexOf(status) == $rootScope.trackingStatuses.length - 1
        };

        $scope.getNextStatus = function(status) {
            return $rootScope.trackingStatuses[$rootScope.trackingStatuses.indexOf(status) + 1];
        };
    })
    .controller("tracking", function($scope, $http, $rootScope) {
        $scope.sendData = function() {
            $http.get(`/ohms/track/${this.trackingId}`)
            .then((res) => {
                $rootScope.ohm = res.data;
            }).catch((err) => {
                console.log(err);
                this.errorMessage = err.statusText;
            });
        };
    });