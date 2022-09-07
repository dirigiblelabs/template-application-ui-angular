/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 * SPDX-License-Identifier: EPL-2.0
 */
var registry = require("platform/v4/registry");
var templateEngines = require("platform/v4/template-engines");
var restTemplateManager = require("template-application-rest/template/template");
var shellTemplate = require("template-application-ui-angular/template/shell/template");
var uiTemplate = require("template-application-ui-angular/template/ui/template");

exports.generate = function (model, parameters) {
    let generatedFiles = [];
    let templateSources = exports.getTemplate(parameters).sources;

    model.entities.forEach(e => {
        e.properties.forEach(p => {
            p.dataNotNull = p.dataNullable === "false";
            p.dataAutoIncrement = p.dataAutoIncrement === "true";
            p.dataNullable = p.dataNullable === "true";
            p.dataPrimaryKey = p.dataPrimaryKey === "true";
            p.dataUnique = p.dataUnique === "true";
            p.isCalculatedProperty = p.isCalculatedProperty === "true";
            p.widgetIsMajor = p.widgetIsMajor === "true";
            p.widgetLabel = p.widgetLabel ? p.widgetLabel : p.name;

            if (p.dataPrimaryKey) {
                if (e.primaryKeys === undefined) {
                    e.primaryKeys = [];
                }
                e.primaryKeys.push(p.name);
                e.primaryKeysString = e.primaryKeys.join(", ");
            }
            if (p.relationshipType === "COMPOSITION" && p.relationshipCardinality === "1_n") {
                e.masterEntity = p.relationshipEntityName;
                e.masterEntityId = p.name;
                // e.masterEntityPrimaryKey = model.entities.filter(m => m.name === e.masterEntity)[0].properties.filter(k => k.dataPrimaryKey)[0].name;
            }

            if (p.widgetType == "DROPDOWN") {
                e.hasDropdowns = true;
            }
            if (p.dataType === "CHAR" || p.dataType === "VARCHAR") {
                // TODO minLength is not available in the model and can't be determined
                p.minLength = 0;
                p.maxLength = -1;
                let widgetLength = parseInt(p.widgetLength);
                let dataLength = parseInt(p.dataLength)
                p.maxLength = dataLength > widgetLength ? widgetLength : dataLength;
            } else if (p.dataType === "DATE" || p.dataType === "TIME" || p.dataType === "TIMESTAMP") {
                p.isDateType = true;
                e.hasDates = true;
            }
            p.inputRule = p.widgetPattern ? p.widgetPattern : "";

            if (e.layoutType === "MANAGE_MASTER" && p.widgetIsMajor) {
                if (e.masterProperties == null) {
                    e.masterProperties = {
                        title: null,
                        properties: []
                    };
                }
                if (e.masterProperties.title == null) {
                    e.masterProperties.title = {
                        name: p.name,
                        widgetType: p.widgetType
                    };
                } else {
                    e.masterProperties.properties.push({
                        name: p.name,
                        widgetType: p.widgetType
                    });
                }
            }
        });
    });

    let uiManageModels = model.entities.filter(e => e.layoutType === "MANAGE" && e.type === "PRIMARY");
    let uiListModels = model.entities.filter(e => e.layoutType === "LIST" && e.type === "PRIMARY");
    let uiManageMasterModels = model.entities.filter(e => e.layoutType === "MANAGE_MASTER" && e.type === "PRIMARY");
    let uiListMasterModels = model.entities.filter(e => e.layoutType === "LIST_MASTER" && e.type === "PRIMARY");
    let uiManageDetailsModels = model.entities.filter(e => e.layoutType === "MANAGE_DETAILS" && e.type === "DEPENDENT");
    let uiListDetailsModels = model.entities.filter(e => e.layoutType === "LIST_DETAILS" && e.type === "DEPENDENT");
    let uiReportTableModels = model.entities.filter(e => e.layoutType === "REPORT_TABLE" && e.type === "REPORT");
    let uiReportBarsModels = model.entities.filter(e => e.layoutType === "REPORT_BAR" && e.type === "REPORT");
    let uiReportLinesModels = model.entities.filter(e => e.layoutType === "REPORT_LINE" && e.type === "REPORT");
    let uiReportPieModels = model.entities.filter(e => e.layoutType === "REPORT_PIE" && e.type === "REPORT");

    parameters.perspectives = parameters.perspectives == null ? [] : parameters.perspectives;

    model.entities.forEach(e => {
        if (e.perspectiveName) {
            if (parameters.perspectives[e.perspectiveName] == null) {
                parameters.perspectives[e.perspectiveName] = {
                    views: []
                };
            }
            parameters.perspectives[e.perspectiveName].name = e.perspectiveName;
            parameters.perspectives[e.perspectiveName].label = e.perspectiveName;
            parameters.perspectives[e.perspectiveName].order = e.perspectiveOrder;
            parameters.perspectives[e.perspectiveName].icon = e.perspectiveIcon;
            parameters.perspectives[e.perspectiveName].views.push(e.name);
        }
    });

    for (let i = 0; i < templateSources.length; i++) {
        let template = templateSources[i];
        let content = registry.getText(template.location);
        if (content == null) {
            throw new Error(`Template file at location '${templateSources[i].location}' does not exists.`)
        }

        if (template.action === "copy") {
            generatedFiles.push({
                content: content,
                path: templateEngines.getMustacheEngine().generate(template.rename, parameters)
            });
        } else if (template.action === "generate") {
            let generationEngine = getGenerationEngine(template);
            switch (template.collection) {
                case "models":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, model.entities, parameters));
                    break;
                case "uiManageModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiManageModels, parameters));
                    break;
                case "uiListModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiListModels, parameters));
                    break;
                case "uiManageMasterModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiManageMasterModels, parameters));
                    break;
                case "uiListMasterModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiListMasterModels, parameters));
                    break;
                case "uiManageDetailsModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiManageDetailsModels, parameters));
                    break;
                case "uiListDetailsModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiListDetailsModels, parameters));
                    break;
                case "uiReportTableModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiReportTableModels, parameters));
                    break;
                case "uiReportBarsModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiReportBarsModels, parameters));
                    break;
                case "uiReportLinesModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiReportLinesModels, parameters));
                    break;
                case "uiReportPieModels":
                    generatedFiles = generatedFiles.concat(generateCollection(generationEngine, content, template, model, uiReportPieModels, parameters));
                    break;
                default:
                    // No collection
                    parameters.models = model.entities;
                    generatedFiles.push({
                        content: getGenerationEngine(template).generate(content, parameters),
                        path: templateEngines.getMustacheEngine().generate(template.rename, parameters)
                    });
                    break;
            }
        }
    }
    return generatedFiles;
};

function generateCollection(generationEngine, content, template, model, collection, parameters) {
    try {
        let generatedFiles = [];
        for (let i = 0; i < collection.length; i++) {
            let templateParameters = {};
            Object.assign(templateParameters, collection[i], parameters);
            // TODO Move this to the more generic "generate()" function, with layoutType === "MANAGE_MASTER" check
            templateParameters.perspectiveViews = templateParameters.perspectives[collection[i].perspectiveName].views;
            if (template.collection === "uiManageMasterModels") {
                collection.filter(e => e.perspectiveName === collection[i].perspectiveName).forEach(e => templateParameters.perspectiveViews.push(e.name + "-details"));
            }

            generatedFiles.push({
                content: generationEngine.generate(content, templateParameters),
                path: templateEngines.getMustacheEngine().generate(template.rename, templateParameters)
            });
        }
        return generatedFiles;
    } catch (e) {
        let message = `Error occurred while generating template:\n\nError: ${e.message}\n\nTemplate:\n${JSON.stringify(template, null, 2)}\n`;
        console.error(message);
        throw e;
    }
}

exports.getTemplate = function (parameters) {
    let restTemplate = restTemplateManager.getTemplate(parameters);

    let templateSources = [];
    templateSources = templateSources.concat(restTemplate.sources);
    // templateSources = templateSources.concat(shellTemplate.getSources(parameters));
    templateSources = templateSources.concat(uiTemplate.getSources(parameters));

    let templateParameters = getTemplateParameters();
    templateParameters = templateParameters.concat(restTemplate.parameters);

    return {
        name: "Application - UI (AngularJS)",
        description: "Application with UI, REST APIs and DAOs",
        extension: "model",
        sources: templateSources,
        parameters: templateParameters
    };
};

function getTemplateParameters() {
    return [
        {
            name: "brand",
            label: "Brand",
            placeholder: "Enter Brand"
        },
        {
            name: "brandUrl",
            label: "Brand URL",
            placeholder: "Enter Brand URL"
        },
        {
            name: "title",
            label: "Title",
            placeholder: "Enter Title"
        },
        {
            name: "description",
            label: "Description",
            placeholder: "Enter Description"
        }
    ];
}

function getGenerationEngine(template) {
    let generationEngine = null;
    if (template.engine === "velocity") {
        generationEngine = templateEngines.getVelocityEngine();
    } else {
        generationEngine = templateEngines.getMustacheEngine();
    }

    if (template.sm) {
        generationEngine.setSm(template.sm);
    }
    if (template.em) {
        generationEngine.setEm(template.em);
    }
    return generationEngine;
}