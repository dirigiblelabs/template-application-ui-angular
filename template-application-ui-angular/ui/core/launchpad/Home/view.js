const viewData = {
    id: "home-launchpad",
    label: "Home Launchpad",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/${projectName}/gen/ui/core/launchpad/Home/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
