exports.getTile = function () {
    return {
        group: "{{perspectiveName}}",
        name: "{{name}}",
        caption: "{{caption}}",
        tooltip: "{{tooltip}}",
        // icon: "file-o",
        location: "/services/v4/web/{{projectName}}/gen/ui/{{perspectiveName}}/index.html",
        order: "{{menuIndex}}",
        groupOrder: "{{perspectiveOrder}}"
    };
};
