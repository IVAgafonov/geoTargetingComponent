(function () {
    'use strict';
    angular.module('geoTargetingModule', ['yaMap'])
        .component('geoTargetingComponent', {
            bindings: {
                model: '=',
                options: '<'
            },
            templateUrl: 'geoTargetingComponent.html',
            controller: ['$timeout', geoTargetingController]
        });

    function geoTargetingController($timeout) {
        var vm = this;

        vm.circle = {};
        vm.map = {};
        vm.model = {};

        vm.options = {
            zoom: 10,
            coordinates: [37.64, 55.76],
            object: {
                geometry: {
                    type: 'Circle',
                    coordinates: [37.60, 55.76],
                    radius: 5000
                },
                properties: {
                    hintContent: "Подвинь меня"
                }
            },
            defaultAddress: ''
        };

        vm.$onInit = function() {
            console.log('init');
        };

        vm.getCircle = function (target) {
            vm.circle = target;
            vm.model.coordinates = vm.options.coordinates;
            vm.circle.geometry.setCoordinates(vm.model.coordinates);
            vm.model.setRadius = function(radius) {
                radius = parseInt(radius);
                vm.circle.geometry.setRadius(radius * 1000);
                vm.model.radius = radius;
            };
            vm.model.getRadius = function () {
                return vm.circle.geometry.getRadius() / 1000;
            };
            vm.circle.events.add('dragend', function (e) {
                vm.model.coordinates = vm.circle.geometry.getCoordinates();
                vm.tryFindAddrByCoords(vm.model.coordinates);
            });
            $timeout(function () {
                vm.model.setRadius(vm.options.object.geometry.radius);
            }, 0);

            if (vm.options.address) {
                vm.model.findByAddress(vm.options.address);
            } else if (vm.options.coordinates) {
                vm.model.setCoordinates(vm.options.coordinates);
            } else {
                vm.model.setCoordinates([37.64, 55.76]);
            }

            if (vm.options.onInit) {
                vm.options.onInit();
            }
        };

        vm.getMap = function (target) {
            vm.map = target;
            vm.map.events.add('click', function (e) {
                var coords = e.get('coords');
                vm.model.coordinates = coords;
                vm.circle.geometry.setCoordinates(vm.model.coordinates);
                vm.tryFindAddrByCoords(vm.model.coordinates);
            });

            vm.model.findByAddress = function(address) {
                vm.tryFindByAddr(address);
            };

            vm.model.setCoordinates = function(coordinates) {
                vm.map.setCenter(coordinates);
                vm.tryFindAddrByCoords(coordinates);
            };
        };

        vm.tryFindByAddr = function (address) {
            ymaps.geocode(address, {
                results: 1
            }).then(function (res) {
                if (res) {
                    var firstGeoObject = res.geoObjects.get(0),
                        coords = firstGeoObject.geometry.getCoordinates(),
                        bounds = firstGeoObject.properties.get('boundedBy');
                    if (bounds) {
                        vm.model.address = firstGeoObject.getAddressLine() ? firstGeoObject.getAddressLine() : 'Не удалось определить адрес.';
                        vm.model.coordinates = coords;
                        vm.circle.geometry.setCoordinates(coords);
                        vm.map.setCenter(coords);
                        vm.tryFindAddrByCoords(coords);
                    }
                }
            });
        };

        vm.tryFindAddrByCoords = function (coords) {
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject.getAddressLine()) {
                    $timeout(function () {
                        vm.model.address = firstGeoObject.getAddressLine() ? firstGeoObject.getAddressLine() : 'Не удалось определить адрес.';
                    }, 0);
                }
                vm.model.coordinates = coords;
                vm.circle.geometry.setCoordinates(coords);
            });
        };
    }
})();