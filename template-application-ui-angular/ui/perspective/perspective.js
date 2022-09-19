const perspectiveData = {
	id: "{{perspectiveName}}",
	name: "{{perspectiveName}}",
	link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/index.html",
	order: "{{perspectiveOrder}}",
	icon: "{{perspectiveIcon}}",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}