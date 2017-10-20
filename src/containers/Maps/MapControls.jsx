/*
Map Explorer - Controls
=======================

Part of the Map Explorer feature.

********************************************************************************
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class MapControls extends React.Component {
  constructor(props) {
    super(props);
  }
  
  //----------------------------------------------------------------

  render() {
    return (
      null
    );
  }
}

MapControls.propTypes = {};
MapControls.defaultProps = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(MapControls);
