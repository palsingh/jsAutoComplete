/**
 * A directive for adding auto-complete to a text box
 *
 * Usage:
 *
 * <auto-complete
 *      class-name="form-control"
 *      max-result="15"
 *      create-text="Create Address"
 *      create-text-route="active"
 *      broadcast="true"
 *      broadcast-event-name="name"
 *      display-list="true"
 *      placeholder="Some text"
 *      api-end-point="<URL>">
 * </auto-complete>
 *
 * @attr STRING `class-name` will be applied on the input element.
 * @attr NUMBER `max-result` is maximum results to show in the list. Default: 15 + 1 (create-text).
 * @attr STRING `create-text` will show up last in the auto complete list.
 * @attr STRING `create-text-route` define route for create text list item.
 * @attr BOOLEAN `broadcast` it will broadcast result on $rootScope. Default: false.
 * @attr STRING `broadcast-event-name` it will used by listeners, to be used with broadcast true. Mandatory with `broadcast`.
 * @attr BOOLEAN `display-list` it will show or hide list results. Default: true.
 * @attr STRING `placeholder` it will be used as placeholder text for input field.
 * @attr STRING `api-end-point` it will be the url from where results will be shown.
 *
 */
angular.module("jsAutoComplete", []).directive("jsAutoComplete", ["$location", "$rootScope", "$window", "jsAPI", function ($location, $rootScope, $window, jsAPI) {
    return {
        scope: true,
        link: function (scope, elem, attrs) {
            var requestInst = null,
                listLength = attrs.maxLength || 15,
                listResult = 0,
                displayResultInList = (attrs.displayList == "false") ? false : true,
                broadcast = attrs.broadcast == "false" ? false : true,
                broadcastName = attrs.broadcastEventName || "";
            scope.state = {
                className: attrs.className,
                createItem: attrs.createText,
                data: null,
                displayList: false,
                focusIndex: 0,
                listNumber: -1,
                maxResult: attrs.maxResult,
                noResult: false,
                placeholder: attrs.placeholder || ""
            };

            scope.createItemRedirect = function () {
                if (attrs.createTextRoute) {
                    window.location.href = attrs.createTextRoute;
                }
            };

            scope.getData = function () {
                // cancel ongoing request
                if (requestInst && requestInst.reject) {
                    requestInst.resolve();
                }
                if (scope.state.data && attrs.apiEndPoint) {
                    requestInst = jsAPI.apiCall(attrs.apiEndPoint);
                    requestInst.promise.then(responseHandler);
                }
            };

            scope.setContent = function (name) {
                scope.state.data = name;
                scope.state.displayList = false;
            };

            function responseHandler (data) {
                scope.state.listData = data;
                scope.state.focusIndex = 0;
                if (displayResultInList) {
                    scope.state.displayList = true;
                }

                if (broadcast && broadcastName) {
                    broadcastData(data);
                }
            }

            function broadcastData (data) {
                console.log("Broadcasting...");
                $rootScope.$broadcast(broadcastName, {data: data});
            }

            angular.element(elem.find("input")).bind("keydown", function (e) {
                var liNode = [],
                    listResult = elem.find("li"),
                    listNumber = listResult.length < listLength ? (listResult.length - 1) : listLength;
                    listNumber = scope.state.createItem ? (listNumber - 1): (listNumber - 2);

                scope.state.listNumber = listNumber;

                if (e.keyCode === 13) { // enter
                    if ((scope.state.createItem && scope.state.focusIndex === listNumber)) {
                        if (attrs.createTextRoute) {
                            window.location.href = attrs.createTextRoute;
                            return;
                        }
                    }
                    liNode = angular.element(listResult[scope.state.focusIndex]);
                    if (scope.state.focusIndex > -1 && liNode.length && !liNode.hasClass("unselectable")) {
                        scope.state.data = liNode.text();
                        scope.state.displayList = false;
                    }
                } else if (e.keyCode === 38) { // Arrow up
                    if (scope.state.focusIndex < 0) {
                        scope.state.focusIndex = -1;
                    } else {
                        scope.state.focusIndex -= 1;
                    }
                } else if (e.keyCode === 40) { // Arrow down
                    if (scope.state.focusIndex > (listNumber - 1)) {
                        scope.state.focusIndex = listNumber;
                    } else {
                        scope.state.focusIndex += 1;
                    }
                } else if (e.keyCode === 9 || e.keyCode === 27) { // tab || esc
                    scope.state.displayList = false;
                }

                scope.$digest();
            });

            angular.element($window).on("click", function() {
                scope.state.displayList = false;
                scope.$digest();
            });
        },
        template: '\
                <div class="auto-complete-wrapper" ng-click="$event.stopPropagation()">\
                    <input type="text" class="{{state.className}}" ng-model="state.data" ng-change="getData()" placeholder="{{state.placeholder}}" />\
                    <ul ng-show="state.displayList">\
                        <li ng-click="setContent(result.name)" ng-repeat="result in filtered = (state.listData | filter: state.data) | limitTo: state.maxResult" ng-class="{\'selected-record\': $index === state.focusIndex}">{{result.name}}</li>\
                        <li ng-show="!filtered.length" class="unselectable">No result found</li>\
                        <li ng-show="state.createItem" ng-class="{\'selected-record\': state.listNumber == state.focusIndex}" ng-click="createItemRedirect()"\>{{state.createItem}}</li>\
                    </ul>\
                </div>'
    }
}]);