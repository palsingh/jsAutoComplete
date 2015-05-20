# jsAutoComplete | v1.0.0
AngularJS Auto Complete Directive

# Description
A simple AngularJS directive which creates an Auto Complete input field. It get data from an API endpoint and filter it and display it in list.

# Setup
You will need to add AngularJS lib. Download it from [here](https://angularjs.org/).

After adding lib, you need following three files: 
```html
  <link href="app/stylesheets/style.css" rel="stylesheet" />
  <script src="app/component/auto-complete/js-auto-complete.js"></script>
  <script src="app/component/auto-complete/js-api-service.js"></script>
```
Now, In your module where you want to use this auto complete directive, inject its dependency with following syntax
```javascript
var app = angular.module('app', ['jsAutoComplete']);
```

## Usage
In your view template, add following html tag
```html
  <js-auto-complete
       class-name="form-control"
       max-result="15"
       placeholder="Some text"
       api-end-point="<API_URL>">
  </js-auto-complete>
```

### Attributes

`api-end-point` : Your data source URL. Data type: `STRING`.

`broadcast` : *(optional)* Use this if you want to broadcast the response which you get from your api end point. If you use this attribute, its mandatory to use `broadcast-event-name` attribute, else it won't broadcast. This will be helpful if you want to populate your results somewhere else than list. Data type: `BOOLEAN`. Default: `false`.

`broadcast-event-name` : *(optional)* Name of the event which will be listened by listeners. Mandatory to use with `broadcast` attribute. Data type: `STRING`.

`create-text` : *(optional)* The value of this attribute will be visible last in the auto-complete list. If user clicks on this list item, he will be redirected some other page. User will be redirected to specified route which is provided in different attribute `create-text-route`. This is helpful if you want user to do something if his desired result wasn't populated in the auto complete list. Data type: `STRING`.

`create-text-route` : *(optional)* This attribute becomes mandatory if you are using `create-text`. When user clicks on the list item which is specified in `create-text` attribute, he will be redirected to this route or URL. Data type: `STRING`.

`class-name` : *(optional)* Add CSS class to the input element of this directive. Add multiple CSS classes with space separation. Data type: `STRING`.

`display-list` : *(optional)* If set to `false` it hides the auto complete list permanently. Data type: `BOOLEAN`. Default: `true`

`max-result` : *(optional)* Max results to populate in the auto complete list. Data type: `NUMBER`. Default: `15`.

`placeholder` : *(optional)* This is HTML5 placeholder attribute on the input element. Data type: `STRING`.

