exports.getTile = function () {
    return {
        group: "{{perspectiveName}}",
        name: "{{name}}",
        // icon: "file-o",
        location: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/index.html",
        order: "100"
    };
};