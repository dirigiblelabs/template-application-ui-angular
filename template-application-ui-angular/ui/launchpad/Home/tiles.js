const response = require("http/v4/response");
const extensions = require("core/v4/extensions");

let tiles = {};

let tileExtensions = extensions.getExtensions("${projectName}-tile");
for (let i = 0; tileExtensions !== null && i < tileExtensions.length; i++) {
    let tileExtension = require(tileExtensions[i]);
    let tile = tileExtension.getTile();
    if (!tiles[tile.group]) {
        tiles[tile.group] = [];
    }
    tiles[tile.group].push({
        name: tile.name,
        location: tile.location,
        caption: tile.caption,
        tooltip: tile.tooltip,
        order: parseInt(tile.order),
        groupOrder: parseInt(tile.groupOrder)
    });
}

for (let next in tiles) {
    tiles[next] = tiles[next].sort((a, b) => a.order - b.order);
}

let sortedGroups = [];
for (let next in tiles) {
    sortedGroups.push({
        name: next,
        order: tiles[next][0] && tiles[next][0].groupOrder ? tiles[next][0].groupOrder : 100,
        tiles: tiles[next]
    });
}
sortedGroups = sortedGroups.sort((a, b) => a.order - b.order);

let sortedTiles = {};
for (let i = 0; i < sortedGroups.length; i++) {
    sortedTiles[sortedGroups[i].name] = sortedGroups[i].tiles;
}

response.println(JSON.stringify(sortedTiles));