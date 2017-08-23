(function () {
	'use strict';
	var employeeInfo = require('./../../assets/data/employee-info.json');

	var DataService = function () {
		
		var vm = this;

		vm.getEmployee = getEmployee;
		////////

		function getEmployee () {
			// mimic server call
			return employeeInfo;
		}
	
	};

	module.exports = DataService;
	
})();