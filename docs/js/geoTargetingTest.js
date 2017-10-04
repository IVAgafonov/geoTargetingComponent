(function () {
    'use strict';
    angular.module('testApp', ['geoTargetingModule'])
        .component('testComponent', {
            template: '<h2>Geo targeting component</h2><geo-targeting-component model="$ctrl.model" options="$ctrl.options"></geo-targeting-component>'
            + '<h2>Coordinates</h2><p>{{$ctrl.model.coordinates}}</p><h2>Radius</h2><p>{{$ctrl.model.radius}}</p>'
            + '<h2>Address</h2><p>{{$ctrl.model.address}}</p>'
            + '<h2>Set address</h2>'
            + '<div class="form-line"><input style="width: 300px;" class="form-control" type="text" ng-model="$ctrl.address" placeholder="Insert address"><button class="btn btn-outline" ng-click="$ctrl.setAddress();">set</button></div></div>'
            + '<h2>Set radius</h2>'
            + '<div class="form-line"><input style="width: 300px;" type="range" class="form-control" type="text" ng-model="$ctrl.radius" ng-change="$ctrl.setRadius();" placeholder="Insert address"><button class="btn btn-outline" >{{$ctrl.radius}}</button></div></div>',
            controller: [testController]
        });

    function testController() {
        var vm = this;

        vm.address = '';

        vm.radius = 5;

        vm.model = {
        };

        vm.options = {
            coordinates: [
                37.64,
                55.76
            ],
            address: 'Волгоград триумфальная 13',
            zoom: 10,
            object: {
                geometry: {
                    type: 'Circle',
                    radius: 7
                },
                properties: {
                    hintContent: "Подвинь меня"
                }
            },
            onInit: function () {
                console.log('init');
            }
        };

        vm.setAddress = function () {
            if (vm.model.findByAddress) {
                vm.model.findByAddress(vm.address);
            }
        };

        vm.setRadius = function () {
            if (vm.model.setRadius) {
                vm.model.setRadius(vm.radius);

            }
        }
    }
})();