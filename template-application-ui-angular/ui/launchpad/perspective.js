const perspectiveData = {
	id: "home",
	name: "Home",
	link: "/services/v4/web/${projectName}/gen/index.html",
	order: "1",
	icon: "/services/v4/web/resources/unicons/estate.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}