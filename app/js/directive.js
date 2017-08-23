(function () {
	'use strict';

	var angular = require('angular');

	// load all directives
	var autoComplete = require('./form/form.directive');

	module.exports = angular.module('app.directive', [])
		.directive('autoComplete', autoComplete);

})();