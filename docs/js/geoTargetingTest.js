(function () {
    'use strict';
    angular.module('testApp', ['geoTargetingModule'])
        .component('testComponent', {
            template: '<h2>Geo targeting component</h2><geo-targeting-component model="$ctrl.model" options="$ctrl.options"></geo-targeting-component>',
            controller: [testController]
        });

    function testController() {
        var vm = this;

        vm.model = {

            findAddrByCoords: function (coordinates) {

            },
            setAddress: function(address) {

            }
        };

        vm.options = {
            coordinates: [
                37.64,
                55.76
            ],
            radius: 5000,
            zoom: 10,
            address: '',
            object: {
                geometry: {
                    type: 'Circle',
                    coordinates: [37.60,55.76],
                    radius: 5000
                },
                properties: {
                    hintContent: "Подвинь меня"
                }
            },
            onInit: function () {
                console.log('init');
            }
        };
    }
})();