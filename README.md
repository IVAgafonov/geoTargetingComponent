### Geo targeting component for angular 1.6.x

Example: 

You can see example in ./docs/ (https://ivagafonov.github.io/geoTargetingComponent/)

**Setup:**

Install with npm
```bash
npm install geo-targeting-component --save
```

Install with bower
```bash
bower install geo-targeting-component --save
```

**Usage:**

1. Add require module:
```js
angular.module('app', ['geoTargetingModule'])
```

2. Add html component and resolve 'model' dependency
```html
<geo-targeting-component model="$ctrl.model" options="$ctrl.options"></geo-targeting-component>
```

3. Create geo targeting model in parent controller
```js
var vm = this;

vm.model = {}

vm.options = {
    coordinates: [
        37.64,
        55.76
    ],
    address: 'Волгоград триумфальная 13',
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
```

Time targeting model
* coordinates - [lat, lon] float coordinates of circle
* address - calculated address
* radius - radius (int [km])

Time targeting  options:
* coordinates - [lat, lon] float coordinates of circle (low init priority);
* address - address (high init priority)
* object.geometry.type - 'Circle'
* object.geometry.radius - radius (int [km])
* object.properties.hintContent - title of object