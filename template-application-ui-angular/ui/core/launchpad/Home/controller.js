angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = '{{projectName}}.launchpad.Home';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/{{projectName}}/gen/ui/core/services/tiles.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.openView = function (location) {
			messageHub.postMessage("openView", {
				location: location
			});
		}

		entityApi.list().then(function (response) {
			if (response.status != 200) {
				messageHub.showAlertError("Home", `Unable to get Home Launchpad: '${response.message}'`);
				return;
			}
			$scope.data = response.data;
			$scope.groups = Object.keys(response.data);
		});

	}]);
