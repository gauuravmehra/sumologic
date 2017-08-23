(function () {
	'use strict';

	var angular = require('angular');

	// load all controllers
	var headerController = require('./header/header.Controller'),
		DataController = require('./form/form.controller');

	module.exports = angular.module('app.controller', [])
		.controller('headerController',                 headerController)
		.controller('DataController',                   DataController);

})();