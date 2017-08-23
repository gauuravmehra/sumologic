(function () {
	'use strict';
	/* global alert */

	module.exports = function autoComplete () {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				resultCount: '=resultcount'
			},
			templateUrl: './app/js/form/inner-form.view.html',
			link: function(scope, element) {

				scope.data = scope.$parent.vm.data;
				scope.employeesList = [];

				// cache elements
				var select = element.find('#selectOrg'),
					txtBox = $('.search-input'),
					closeBtn = $('.close-btn'),
					confirmBtn = $('.confirm-btn'),
					wrap = element.find('#auto-input'),
					resultNodes,
					cache = {},
					handle = {};
				
				// fill select dropdown
				(function fillSelect () {
					scope.data.forEach(function (o) {
						select.append('<option val="' + o.team + '">' + o.team + '</option>');
					});
				})();

				select.on('change', function () {
					var val = $(this).find('option:selected').val(),
						len = scope.data.length;

					while (len--) {
						if (val === scope.data[len].team) {
							scope.employeesList = scope.data[len].employees;
							break;
						}
					}

					if (val !== '') {
						txtBox
							.val('')
							.attr('disabled', false);
					} else {
						txtBox.attr('disabled', true);
					}
				});

				closeBtn.on('click', function () {
					alert('Are you sure you want to close?');
				});

				wrap.on('input', grabEvent);
				wrap.on('keydown', grabEvent);
				wrap.find('.ac-results-wrapper a').on('click', handle.enter);
				confirmBtn.on('click', validate);


				////////////////////////////////////////////////////////////////
				// auto complete area

				handle.enter = function (e) {
					e.preventDefault();
					txtBox.val($(e.target).text());
					hideAllNodes();
				}
					
				handle.up = function (e) {
					e.preventDefault();
					// UP key implementation here
				};
				
				handle.down = function (e) {  
					e.preventDefault();
					// Down key implementation here
				};

				handle.input = function (e) {
					var val = e.target.value.trim().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
					return val ? insert(cacheMethod(val, check)) : insert();
				};

				function validate () {
					if (txtBox && txtBox.val() === '') {
						txtBox.parents('.form-group').addClass('has-error');
					} else {
						txtBox.parents('.form-group').removeClass('has-error');
					}
				}

				function hideAllNodes () {
					resultNodes.each(function (i, o) {
						o.style.display = 'none';
					});
				}

				function insert (d) {
					if (d && d.length) {
						var i = d.length;
						while (i--) {
							if (d && d[i]) {
								resultNodes[i].style.display = 'block';
								resultNodes[i].firstChild.nodeValue = d[i].tag;
							} else if (!d || !d[i]) {
								resultNodes[i].style.display = 'none';
							}
						}
					} else {
						hideAllNodes();
					}
				}

				function cacheMethod (v, c) {
					return cache[v] ? cache[v] : cache[v] = c(v), cache[v];
				}

				function check (q) {
					if (scope.employeesList.length) {
						var regexFn = function(s) {
								return '^(.*?(' + s + ')[^$]*)$'; 
							},
							regex = new RegExp(q.replace(/(\S+)/g, regexFn).replace(/\s+/g, ''), 'gi'),
							arr = [];
						
						testFn (scope.employeesList); 

						function testFn (obj) {
							var j = obj.length;
							for (var i = 0; i < j; i++) {
								if (regex.test(obj[i])) {
									arr.push({
									'tag': obj[i]
									});
								}
							}
						}
						return arr;
					} else {
						return [];
					}
				}

				function grabEvent (e) {
					var key = e.keyCode,
						eventHandler = key === 13 ? 'enter' : key === 38 ? 'up' : key === 40 ? 'down' : e.type === 'input' ? 'input' : null;
					return eventHandler ? handle[eventHandler](e) : null;
				}
				
				(function setElements () {
					var container = wrap.find('.ac-results-wrapper');
					var i = scope.resultCount;
					while (i--) {
						var link = $('<a/>', {
							href: '#',
						}).html('a');
						container.append(link);
					}
					resultNodes = wrap.find('a');
				})();
			}
		};
	};
})();