/*global
            define,
            require,
            window,
            console,
            _
*/
/*jslint    devel:true,
            white: true
 */
define([
        'js/qlik',
        'jquery',
        'underscore',
        './treelayoutlistbox-properties',
        './treelayoutlistbox-initialproperties',
        './lib/js/extensionUtils',
        'text!./lib/css/style.css'
],
function (qlik, $, _, props, initProps, extensionUtils, cssContent) {
    'use strict';

    extensionUtils.addStyleToHeader(cssContent);

    return {

        definition: props,
        initialProperties: initProps,

        snapshot: { canTakeSnapshot: true },

        resize : function() {
            //do nothing
        },

//        clearSelectedValues : function($element) {
//
//        },


        // Angular Template
        //template: '',
        // (Angular Template)

        // Angular Controller
        controller: ['$scope', function ($scope) {

        }],
        // (Angular Controller)


        // Paint Method
        paint: function ($element, layout) {
            var self = this;
            var dimension_info="";
		        if(this.backendApi.getDimensionInfos())
		          dimension_info=this.backendApi.getDimensionInfos();

    		    if(dimension_info!="")
    		        layout.properties.treeStructure.nodeName=dimension_info[0].qFallbackTitle;

            var app = qlik.currApp(this);

            if(!layout.properties.treeStructure.nodeName || !layout.properties.treeStructure.nodeDepth || !layout.properties.treeStructure.nodeID || !layout.properties.treeStructure.parentNodeID) {
              var html_text = '<h1 style="font-size: 150%;">Please make sure you have correctly set up all the fields that define the Tree Structure.</h1>';
              html_text +='<br />This extension requires the following information:<br /><br />';
              html_text +='<b style="color: #1A8C27">Node Name:</b> This is the display name that will be representing each node of the tree<br />';
              if(!layout.properties.treeStructure.nodeDepth) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
              html_text +='Node Depth:</b> This is the depth level of the node in the tree<br />';
              if(!layout.properties.treeStructure.nodeID) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
              html_text +='Node ID:</b> This is the numeric ID that is related with the specified <i>Node Name</i><br />';
              if(!layout.properties.treeStructure.parentNodeID) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
              html_text +='Parent Node ID:</b> This is the numeric ID that identifies the parent of the node<br /><br />';
              html_text +='The use of the Hierarchy Function to prepare this information is highly recommended. For more info click <a href="http://help.qlik.com/sense/2.1/en-US/online/#../Subsystems/Hub/Content/Scripting/ScriptPrefixes/Hierarchy.htm">here</a>'
              $element.html(html_text);
            } else {

              var treeProperties = {
                treeStructure: layout.properties.treeStructure,
              };

              var qSortCriteriasContents={
                qSortByAscii: 1
              }

              app.createCube({
                qDimensions : [
                  { qDef : {qFieldDefs : ["="+treeProperties.treeStructure.nodeDepth]} },
                  { qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeID]} },
                  { qDef : {qFieldDefs: ["="+treeProperties.treeStructure.parentNodeID]} },
                  //{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]} }
                  { qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]},
                                qSortCriterias: [ qSortCriteriasContents ]  }
                ],
                qMeasures : [
                  { qDef : { qDef : "1" } }
                ],
                qInitialDataFetch : [
                  { qHeight : 1000, qWidth : 5 }
                ]
              }, function (reply) {
                renderList(reply, $element, "tree"+layout.qInfo.qId, treeProperties);
              });

            }

            // Function to render a listbox
            function renderList(treeData, element, object_id, treeProperties){
              var html = "<ul>";

              var qMatrix = treeData.qHyperCube.qDataPages[0].qMatrix;

              var data = qMatrix.map(function(d) {
                return {
                  "NodeID": d[1].qNum,
                  "parentNodeID": d[2].qNum,
                  "qElemNumber": d[3].qElemNumber
                }
              });

              // Sort by Alphabetic order
              qMatrix.sort(function(a, b){
               var nameA=a[3].qText.toLowerCase(), nameB=b[3].qText.toLowerCase();
               if (nameA < nameB) //sort string ascending
                return -1;
               if (nameA > nameB)
                return 1;
               return 0; //default return value (no sorting)
              });

              // Creating listbox
              qMatrix.forEach( function ( row ) {
               html += '<li class="data state' + row[3].qState + '" data-value="' + row[3].qElemNumber + '">' + row[3].qText;
               html += '</li>';
               } );
               html += "</ul>";
               element.html( html );

               // Event triggered by selection
               element.find( 'li' ).on( 'qv-activate', function (d) {
            			 if ( this.hasAttribute( "data-value" ) ) {
            			 	var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;

                    //Define arrays to store queue and selected node list
                    var q = [], selected = [];

                    //Get the top node's NodeID
                    var topNode = _.findWhere(data, {"qElemNumber": value});
                    var topNodeID = topNode.NodeID;

                    //Add topNodeID to the queue and selected node
                    q.push(topNodeID);
                    selected.push(value);

                    //Repeat to include all child nodes into selected node list
                    while( q.length > 0 ) {
                      var res = _.where(data, {"parentNodeID": q.pop()});
                      _.each(res, function(d) {
                        q.push(d.NodeID);
                        selected.push(d.qElemNumber);
                      })
                    }

                    //Apply selection
                    self.selectValues( dim, selected , true );
            			 }
            		} );

            }
        }
        // (Paint Method)
    };

});
