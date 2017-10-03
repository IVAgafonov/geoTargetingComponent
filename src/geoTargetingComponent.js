(function () {
    'use strict';
    angular.module('geoTargetingModule', ['yaMap'])
        .component('geoTargetingComponent', {
            bindings: {
                model: '=',
                options: '<'
            },
            templateUrl: 'geoTargetingComponent.html',
            controller: [geoTargetingController]
        });

    function geoTargetingController() {
        var vm = this;

        vm.circle = {};
        vm.map = {};

        console.log(vm.model);
        console.log(vm.options);

        vm.getCircle = function (target) {
            vm.circle = target;
            vm.circle.events.add('dragend', function (e) {
                vm.tryFindAddrByCoords(vm.circle.geometry.getCoordinates());
            });
        };

        vm.getMap = function (target) {
            vm.map = target;
            vm.map.events.add('click', function (e) {
                var coords = e.get('coords');
                vm.circle.geometry.setCoordinates(coords);
                vm.tryFindAddrByCoords(coords);
            });
            if (vm.existsAddress) {
                vm.tryFindByAddr(vm.existsAddress);
            }
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
                        vm.currentAddress = firstGeoObject.getAddressLine() ? firstGeoObject.getAddressLine() : 'Не удалось определить адрес.';
                    }, 0);
                    vm.circle.geometry.setCoordinates(coords);
                }
            });
        };

    }
})();