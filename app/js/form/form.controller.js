(function () {
	'use strict';
	/* global angular */

	DataController.$inject = ['$scope', 'DataService'];

	function DataController ($scope, DataService) {
		
		var vm = this;
		vm.data = DataService.getEmployee();
		
	};

	module.exports = DataController;
})();
