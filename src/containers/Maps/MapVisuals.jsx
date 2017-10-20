/*
Map Explorer - Visuals
======================

Part of the Map Explorer feature.

********************************************************************************
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import L from 'leaflet';
import superagent from 'superagent';

//Arbitrary values for a default map marker.
//TODO / QUESTION: make this customisable?
const DEFAULT_MARKER = {
  color: '#fff',
  fillColor: '#fc3',
  emptyFillColor: '#999',
  fillOpacity: 0.8,
  radius: 10,
  minRadius: 5,
  maxRadius: 20,
  minValue: 0,
  maxValue: 1000,
};

class MapVisuals extends React.Component {
  constructor(props) {
    super(props);
    
    this.initMapExplorer = this.initMapExplorer.bind(this);
    this.renderMarker = this.renderMarker.bind(this);
    
    this.map = null;
    this.mapContainer = null;
    this.dataLayer = null;
  }
  
  //----------------------------------------------------------------

  initMapExplorer() {
    if (this.map) return;  //Don't initialise the map if a map already exists.
    if (!this.props.mapConfig) return;
    
    //Prepare the actual map. POWERED BY LEAFLET!
    //--------------------------------
    console.log(this.mapContainer);
    this.map = new L.Map(this.mapContainer, {
      center: [this.props.mapConfig.map.centre.latitude, this.props.mapConfig.map.centre.longitude],  //Lat-Long
      zoom: this.props.mapConfig.map.centre.zoom,
    });
    //--------------------------------
    
    //Prepare the tile (map base) layers.
    //--------------------------------
    const tileLayers = {};
    this.props.mapConfig.map.tileLayers.map((layer, index) => {
      const tl = L.tileLayer(layer.url, { attribution: layer.attribution, });
      tileLayers[layer.name] = tl;
      if (index === 0) tl.addTo(this.map);  //Use the first tile layer as the default tile layer.
    });
    //--------------------------------
    
    //Prepare the dynamic data layer.
    //Starts off empty, but is populated by updateDataLayer().
    //--------------------------------
    this.dataLayer = L.geoJson(null, {
      pointToLayer: this.renderMarker
    }).addTo(this.map);
    
    //TODO!!!
    //Actions.getMapMarkers({
    //  mapConfig: this.props.mapConfig,
    //  filters: this.props.filters,
    //});
    //--------------------------------
    
    //Prepare additional geographic information layers (park boundaries, etc)
    //--------------------------------
    const extraLayers = (this.props.mapConfig.map && this.props.mapConfig.map.extraLayers)
      ? this.props.mapConfig.map.extraLayers
      : [];
    
    const geomapLayers = {};
    extraLayers.map(item => {  //TODO: Maybe move this to an external duck?
      geomapLayers[item.label] = L.geoJson(null, { style: item.style }).addTo(this.map);
      
      const url = this.props.mapConfig.database.urls.geojson.replace('{SQLQUERY}', encodeURIComponent(item.query));
      superagent.get(url)
      .then(response => {
        if (!response) { throw 'ERROR (MapVisuals/getExtraLayers): No response'; }
        if (response.ok && response.body) {
          return response.body;
        }
        throw 'ERROR (MapVisuals/getExtraLayers): invalid response';
      })
      .then(geojson => {
        if (!geomapLayers[item.label]) return;
        geomapLayers[item.label].clearLayers();
        geomapLayers[item.label].addData(geojson);
        this.dataLayer && this.dataLayer.bringToFront();  //Always keep the data layer at the forefront.
      })
      .catch(err => {
        console.error(err);
      });
    });
    //--------------------------------
    
    //Add a map legend, if applicable.
    //--------------------------------
    /* TEMP
    if (this.props.mapConfig.map && this.props.mapConfig.map.legend) {
      if (this.props.mapConfig.map.legend.type === 'simple') {
        const legend = L.control({position: 'bottomleft'});
        legend.onAdd = (map) => {
          let div = L.DomUtil.create('div', 'map-legend');
          ReactDOM.render(<SimpleMapLegend items={this.props.mapConfig.map.legend.items} />, div);
          return div;
        };
        legend.addTo(this.map);
        
      }
    }
    */
    //--------------------------------
    
    
    //Add standard 'Layer' controls
    //--------------------------------
    let controllableLayers = {};
    controllableLayers['Cameras'] = this.dataLayer;
    //TEMP controllableLayers = { ...controllableLayers, ...geomapLayers };
    
    L.control.layers(tileLayers, controllableLayers, {
      position: 'topleft',
      collapsed: true,
    }).addTo(this.map);
    //--------------------------------
  }
  
  //----------------------------------------------------------------
  
  /*  This function acts as the "render()" action for the Leaflet map, since
      the Leaflet map isn't tied into the React lifecycle and needs to be nudged
      (via componentWillReceiveProps()) when the data state updates.
   */
  updateDataLayer(props = this.props) {
    if (!this.map || !this.dataLayer || !props.markersData) return;
    
    this.dataLayer.clearLayers();
    this.dataLayer.addData(props.markersData);  //Markers Data must be in GeoJSON format.
  }
  
  renderMarker(feature, latlng) {
    const count = (feature && feature.properties && feature.properties.count !== undefined)
      ? feature.properties.count : 0;  //Warning: assumption is `count` is an integer.
    const radius = 
      Math.max(Math.min((count - DEFAULT_MARKER.minValue) / DEFAULT_MARKER.maxValue, 1), 0) *
      (DEFAULT_MARKER.maxRadius - DEFAULT_MARKER.minRadius) +
      DEFAULT_MARKER.minRadius;
    
    const marker = L.circleMarker(latlng, {
      color: DEFAULT_MARKER.color,
      fillColor: (count > 0) ? DEFAULT_MARKER.fillColor : DEFAULT_MARKER.emptyFillColor,
      fillOpacity: DEFAULT_MARKER.fillOpacity,
      radius,
    });
    
    marker.on('click', this.examineMarker);
    return marker;
  }
  
  //----------------------------------------------------------------
  
  render() {
    return (
      <div className="map-visuals" ref={(c)=>{this.mapContainer=c}}></div>
    );
  }
  
  componentDidMount() {
    this.initMapExplorer();
  }
  
  componentWillReceiveProps(nextProps) {
    this.updateDataLayer(nextProps);
  }
  
  //----------------------------------------------------------------
}

MapVisuals.propTypes = {
  mapConfig: PropTypes.object,
};
MapVisuals.defaultProps = {
  mapConfig: null,
};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(MapVisuals);
