define( [], function () {
	'use strict';

	// *****************************************************************************
	// Dimension for selection return
	// *****************************************************************************
	var dimensions = {
		type: "items",
		label: "Dimensions",
		ref: "qListObjectDef",
		min: 1,
		max: 1,
		show: false,
		items: {
			label: {
				type: "string",
				ref: "qListObjectDef.qDef.qFieldLabels.0",
				label: "Label",
				show: true
			},
			libraryId: {
				type: "string",
				component: "library-item",
				libraryItemType: "dimension",
				ref: "qListObjectDef.qLibraryId",
				label: "Dimension",
				show: function ( data ) {
					return data.qListObjectDef && data.qListObjectDef.qLibraryId;
				}
			},
			field: {
				type: "string",
				expression: "always",
				expressionType: "dimension",
				ref: "qListObjectDef.qDef.qFieldDefs.0",
				label: "Node Name",
				show: function ( data ) {
					return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
				}
			}
		}
	};

	// *****************************************************************************
	// Appearance section
	// *****************************************************************************
	var appearanceSection = {
		uses: "settings"
	};

	var treeConfigurations = {
		type: "items",
		component: "expandable-items",
		label: "Tree Configuration",
		items: {
			treeStructure:{
				type: "items",
				label: "Tree Structure Definition",
				show: function( data ){ return data.qListObjectDef.qDef.qFieldDefs && data.qListObjectDef.qDef.qFieldDefs!=""; },
				items: {
					list_nodeName:{
						ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Node Name",
						type: "string",
						expression: ""
					},//qListObjectDef.qDef.qFieldDefs
					nodeName: {
						ref: "properties.treeStructure.nodeName",
						//ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Hidden Node Name",
						type: "string",
						expression: "",
						show: false
					},//treeConfiguration.items.treeStructure.items.nodeName
					depth: {
						ref: "properties.treeStructure.nodeDepth",
						//ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Node Depth",
						type: "string",
						expression: ""
					},//treeConfiguration.items.treeStructure.items.depth
					nodeID: {
						ref: "properties.treeStructure.nodeID",
						label: "Node ID",
						type: "string",
						expression: ""
					},//treeConfiguration.items.treeStructure.items.nodeID
					parentNodeID: {
						ref: "properties.treeStructure.parentNodeID",
						label: "Parent Node ID",
						type: "string",
						expression: ""
					}
				}//treeConfiguration.items.treeStructure.items
			}
		}//treeConfiguration.items
	} //treeConfiguration

	// *****************************************************************************
	// Main properties panel definition
	// *****************************************************************************
	return {
		type: "items",
		component: "accordion",
		items: {
			treeConfiguration: treeConfigurations,
			appearance: appearanceSection,
			dimension: dimensions
		}
	};
}
);
