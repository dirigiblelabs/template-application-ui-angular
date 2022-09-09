const viewData = {
    id: "{{name}}",
    label: "{{name}}",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/{{name}}/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
