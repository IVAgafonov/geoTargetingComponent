(function () {
    'use strict';
    angular.module('geoTargetingModule', ['yaMap'])
        .component('geoTargetingComponent', {
            bindings: {
                model: '=',
                options: '<'
            },
            template:'<div class="geo-targeting-component"><ya-map ya-after-init="$ctrl.getMap($target);" ya-zoom="$ctrl.options.zoom" ya-controls ya-center="$ctrl.options.coordinates" style="width: 600px; height: 600px; display: inline-block;"><ya-geo-object ya-after-init="$ctrl.getCircle($target);" ya-source="$ctrl.options.object" ya-options="{draggable: true, fillColor: \'#ffc53877\',strokeColor: \'#ffc538\',strokeOpacity: 0.8,strokeWidth: 1}"></ya-geo-object></ya-map></div>',
            controller: [geoTargetingController]
        });

    function geoTargetingController() {
        var vm = this;

        vm.geoModel = {};
        vm.circle = {};
        vm.map = {};

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