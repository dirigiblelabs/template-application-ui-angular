const viewData = {
    id: "{{name}}",
    label: "{{name}}",
    factory: "frame",
    region: "bottom",
    link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/{{masterEntity}}/{{name}}/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
