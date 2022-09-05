const perspectiveData = {
	id: "{{perspectiveName}}",
	name: "{{perspectiveName}}",
	link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/index.html",
	order: "100",
	// icon: "/services/v4/web/chronos/gen/ui/Timesheets/images/workbench.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}