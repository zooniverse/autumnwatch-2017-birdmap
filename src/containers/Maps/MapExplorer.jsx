/*
Map Explorer
============

The primary component for the Map Explorer feature.

This feature is a 'data visualisation tool' allows users to view data from a
Zooniverse project on a visual, geographical map.

********************************************************************************
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapVisuals from './MapVisuals';

class MapExplorer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="map-explorer">
        <MapVisuals
          mapConfig={this.props.mapConfig}
        />
      </div>
    );
  }
}

MapExplorer.propTypes = {
  mapConfig: PropTypes.object,
};
MapExplorer.defaultProps = {
  mapConfig: null,
};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(MapExplorer);
