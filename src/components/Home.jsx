import React from 'react';
import mapConfig from '../lib/map-config.js';
import MapExplorer from '../containers/Maps/MapExplorer';

export default function Home() {
  return (
    <MapExplorer mapConfig={mapConfig} />
  );
}
