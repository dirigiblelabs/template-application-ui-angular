const viewData = {
    id: "{{name}}-details",
    label: "{{name}}",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/{{name}}/main-details/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
