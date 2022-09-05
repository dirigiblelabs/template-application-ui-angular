const viewData = {
    id: "{{name}}-details",
    label: "{{name}}",
    link: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/{{name}}/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}