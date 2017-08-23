(function () {
	'use strict';
	
	var angular = require('angular');
	
	// load all directives
	var DataService = require('./form/form.service');
	
	module.exports = angular.module('app.service', [])
		.service('DataService', DataService);
	
})();