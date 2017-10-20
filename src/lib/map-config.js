/*
WildCam Darien Map Config
=========================

Configuration file for the MapExplorer feature. Each MapConfig is tailored to a
specific project, and this config file is for WildCam Darien.

Requires:
* (External dependency) an external database containing the map data for said
  project; in this case, Carto.

********************************************************************************
 */

const mapConfig = {
  //Connection details for the external data source.
  'database': {
    'urls': {
      'json': '//wildcam-darien.carto.com/api/v2/sql?q={SQLQUERY}',
      'geojson': '//wildcam-darien.carto.com/api/v2/sql?format=GeoJSON&q={SQLQUERY}',
      'csv': '//wildcam-darien.carto.com/api/v2/sql?format=CSV&q={SQLQUERY}'
    },
    'queries': {
      //For each camera, show how many (filtered) results are available.
      'selectCameraCount': 'SELECT cam.*, COUNT(sbjagg.*) as count FROM cameras AS cam LEFT JOIN (SELECT sbj.camera, sbj.location, sbj.date, sbj.season, sbj.time_period, agg.data_choice, agg.subject_id FROM subjects AS sbj INNER JOIN aggregations AS agg ON sbj.subject_id = agg.subject_id) AS sbjagg ON cam.id = sbjagg.camera {WHERE} GROUP BY cam.cartodb_id ORDER BY count DESC',
      
      //Get all the details for all the (filtered) results.
      'selectForDownload': 'SELECT cam.*, sbjagg.* FROM cameras AS cam INNER JOIN (SELECT sbj.camera, sbj.location, sbj.month, sbj.year, sbj.season, sbj.time_period, sbj.time, sbj.date, sbj.darien_id, agg.data_choice, agg.data_answers_howmany_1, agg.data_answers_howmany_2, agg.data_answers_howmany_3, agg.data_answers_howmany_4, agg.data_answers_howmany_5, agg.data_answers_howmany_6, agg.data_answers_howmany_7, agg.data_answers_howmany_8, agg.data_answers_howmany_9, agg.data_answers_howmany_10, agg.data_answers_howmany_1120, agg.data_answers_howmany_21 FROM subjects AS sbj INNER JOIN aggregations AS agg ON sbj.subject_id = agg.subject_id) AS sbjagg ON cam.id = sbjagg.camera {WHERE}',
      
      //Select all the photos from a specific camera. Similar to selectForDownload
      'selectCameraData': 'SELECT DISTINCT(sbjagg.location) FROM cameras AS cam INNER JOIN (SELECT sbj.camera, sbj.location, sbj.month, sbj.year, sbj.season, sbj.time_period, sbj.time, sbj.date, sbj.darien_id, agg.data_choice FROM subjects AS sbj INNER JOIN aggregations AS agg ON sbj.subject_id = agg.subject_id) AS sbjagg ON cam.id = sbjagg.camera {WHERE}',
      
      //Select a single camera, mostly for the camera's metadata.
      'selectCameraMetadata': 'SELECT * FROM cameras {WHERE}',
    }
  },
  
  //The map visualisation bits. Compatible with Leaflet tech.
  'map': {
    'centre': {  //Some arbitrary point between Soberania National Park and Darien National Park. 
      'latitude': 8.300,
      'longitude': -78.600,
      'zoom': 8
    },
    'tileLayers': [
      {
        'name': 'Terrain',
        'url': '//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        'attribution': 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
      },
      {
        'name': 'Terrain (Shaded)',
        'url': '//server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        'attribution': 'Tiles &copy; Esri &mdash; Source: Esri'
      },
      {
        'name': 'Roads',
        'url': '//{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
        'attribution': '&copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
      },
      {
        'name': 'Satellite',
        'url': '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      {
        'name': 'Plain',
        'url': '//{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'attribution': '&copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> &copy; <a href=\'http://cartodb.com/attributions\'>CartoDB</a>'
      }
    ],
    extraLayers: [
      {
        'name': 'darien_national_park',
        'label': 'Darien National Park',
        'query': 'SELECT * FROM darien_national_park',
        'style': function (feature) {
          return {
            stroke: true,
            color: '#3cc',
            fill: false,
          };
        },
      },
      {
        'name': 'soberania_national_park',
        'label': 'Soberania National Park',
        'query': 'SELECT * FROM soberania_national_park',
        'style': function (feature) {
          return {
            stroke: true,
            color: '#3cc',
            fill: false,
          };
        },
      },
      {
        'name': 'veg_type',
        'label': 'Habitats',
        'query': 'SELECT * FROM vegetation_map',
        'style': function (feature) {
          let color = '#ccc';
          if (feature && feature.properties) {
            switch (feature.properties.veg_type) {
              case 'Evergreen tropical ombrophilous broadleaf submontane (500 - 1,000 m Caribbean, 700 - 1,200 m Pacific)':
                color = '#9c3'; break;
              case 'Production system with significant natural or spontaneous woody vegetation (10 - 50%)':
                color = '#993'; break;
              case 'Production system with significant natural or spontaneous woody vegetation (<10%)':
                color = '#693'; break;
              case 'Evergreen ombrophylous tropical lowland broadleaf forest - heavily logged':
                color = '#663'; break;
              case 'Tropical lowland semi-deciduous forest - heavily logged':
                color = '#393'; break;
              case 'Water region':
                color = '#39c'; break;
              case 'Tropical lowland semi-deciduous forest':
                color = '#9c6'; break;
              case 'Tropical lowland semi-deciduous forest - minimally logged':
                color = '#6c6'; break;
              case 'Evergreen tropical ombrophilous broadleaf montane montane (1,000 - 1,500 m Caribbean, 1,200 - 1,800 m Pacific)':
                color = '#cc6'; break;
              case 'Evergreen, broad-leaved tropical broad-leaved evergreen forest':
                color = '#9c9'; break;
            }
          }
          
          return {
            stroke: false,
            fill: true,
            fillColor: color,
            fillOpacity: 0.5,
          };
        },
      },
    ],
    'legend': {
      'type': 'simple',
      'items': {
        '#9c3': 'Evergreen tropical ombrophilous broadleaf submontane (500 - 1,000 m Caribbean, 700 - 1,200 m Pacific)',
        '#993': 'Production system with significant natural or spontaneous woody vegetation (10 - 50%)',
        '#693': 'Production system with significant natural or spontaneous woody vegetation (<10%)',
        '#663': 'Evergreen ombrophylous tropical lowland broadleaf forest - heavily logged',
        '#393': 'Tropical lowland semi-deciduous forest - heavily logged',
        '#39c': 'Water region',
        '#9c6': 'Tropical lowland semi-deciduous forest',
        '#6c6': 'Tropical lowland semi-deciduous forest - minimally logged',
        '#cc6': 'Evergreen tropical ombrophilous broadleaf montane montane (1,000 - 1,500 m Caribbean, 1,200 - 1,800 m Pacific)',
        '#9c9': 'Evergreen, broad-leaved tropical broad-leaved evergreen forest',
      },
    },
    'filters': {
      'data_choice': {
        'label': 'Species',
        'type': 'multichoice',
        'options': [
          {
            'value': 'agouti',
            'label': 'Agouti'
          },
          {
            'value': 'armadillonakedtailed',
            'label': 'Armadillo, Naked-tailed'
          },
          {
            'value': 'armadilloninebanded',
            'label': 'Armadillo, Nine-banded'
          },
          {
            'value': 'bat',
            'label': 'Bat'
          },
          {
            'value': 'birdother',
            'label': 'Bird (other)'
          },
          {
            'value': 'capuchinmonkey',
            'label': 'Capuchin Monkey'
          },
          {
            'value': 'capybara',
            'label': 'Capybara'
          },
          {
            'value': 'coati',
            'label': 'Coati'
          },
          {
            'value': 'coyote',
            'label': 'Coyote'
          },
          {
            'value': 'crestedguan',
            'label': 'Crested Guan'
          },
          {
            'value': 'deerredbrocket',
            'label': 'Deer, Red Brocket'
          },
          {
            'value': 'deerwhitetailed',
            'label': 'Deer, White-tailed'
          },
          {
            'value': 'dogbush',
            'label': 'Dog, Bush'
          },
          {
            'value': 'dogdomestic',
            'label': 'Dog, Domestic'
          },
          {
            'value': 'foxcrabeating',
            'label': 'Fox, Crab-eating'
          },
          {
            'value': 'foxgray',
            'label': 'Fox, Gray'
          },
          {
            'value': 'giantanteater',
            'label': 'Giant Anteater'
          },
          {
            'value': 'greatcurassow',
            'label': 'Great Curassow'
          },
          {
            'value': 'greattinamou',
            'label': 'Great Tinamou'
          },
          {
            'value': 'grison',
            'label': 'Grison'
          },
          {
            'value': 'jaguar',
            'label': 'Jaguar'
          },
          {
            'value': 'jaguarundi',
            'label': 'Jaguarundi'
          },
          {
            'value': 'margay',
            'label': 'Margay'
          },
          {
            'value': 'monkeyother',
            'label': 'Monkey (other)'
          },
          {
            'value': 'ocelot',
            'label': 'Ocelot'
          },
          {
            'value': 'oncilla',
            'label': 'Oncilla'
          },
          {
            'value': 'opossumother',
            'label': 'Opossum (other)'
          },
          {
            'value': 'opossumcommon',
            'label': 'Opossum, Common'
          },
          {
            'value': 'otter',
            'label': 'Otter'
          },
          {
            'value': 'paca',
            'label': 'Paca'
          },
          {
            'value': 'peccarycollared',
            'label': 'Peccary, Collared'
          },
          {
            'value': 'peccarywhitelipped',
            'label': 'Peccary, White-lipped'
          },
          {
            'value': 'porcupine',
            'label': 'Porcupine'
          },
          {
            'value': 'puma',
            'label': 'Puma'
          },
          {
            'value': 'rabbit',
            'label': 'Rabbit'
          },
          {
            'value': 'raccoon',
            'label': 'Raccoon'
          },
          {
            'value': 'redtailedsquirrel',
            'label': 'Red-tailed Squirrel'
          },
          {
            'value': 'reptileamphibian',
            'label': 'Reptile / Amphibian'
          },
          {
            'value': 'rodentother',
            'label': 'Rodent (other)'
          },
          {
            'value': 'skunk',
            'label': 'Skunk'
          },
          {
            'value': 'spinyrat',
            'label': 'Spiny Rat'
          },
          {
            'value': 'tamandua',
            'label': 'Tamandua'
          },
          {
            'value': 'tapir',
            'label': 'Tapir'
          },
          {
            'value': 'tayra',
            'label': 'Tayra'
          },
          {
            'value': 'weasel',
            'label': 'Weasel'
          },
          {
            'value': 'humannotvehicles',
            'label': 'Human (not vehicles)'
          },
          {
            'value': 'vehicle',
            'label': 'Vehicle'
          },
          {
            'value': 'nothinghere',
            'label': 'Nothing here'
          }
        ]
      },
      'veg_type': {
        'label': 'Habitats',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Mature Forest',
            'label': 'Mature Forest'
          },
          {
            'value': 'Lowland semideciduous tropical forest',
            'label': 'Lowland semideciduous tropical forest'
          },
          {
            'value': 'Lowland evergreen tropical forest',
            'label': 'Lowland evergreen tropical forest'
          }
        ]
      },
      'season': {
        'label': 'Seasons',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Dry',
            'label': 'Dry'
          },
          {
            'value': 'Wet',
            'label': 'Wet'
          }
        ]
      },
      'time_period': {
        'label': 'Times of Day',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Dawn 0555-0616',
            'label': 'Dawn (05:55-06:16)'
          },
          {
            'value': 'Day 0617-1827',
            'label': 'Day (06:17-18:27)'
          },
          {
            'value': 'Dusk 1828-1849',
            'label': 'Dusk (18:28-18:49)'
          },
          {
            'value': 'Night 1850-0554',
            'label': 'Night (18:50-05:54)'
          }
        ]
      },
      'national_park': {
        'label': 'National Parks',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Darien',
            'label': 'Darien'
          },
          {
            'value': 'Soberania',
            'label': 'Soberania'
          }
        ]
      },
      'land_use': {
        'label': 'Land Use',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Tourism',
            'label': 'Tourism'
          },
          {
            'value': 'Wilderness',
            'label': 'Wilderness'
          }
        ]
      },
      'human_type': {
        'label': 'Nearby Humans',
        'type': 'multichoice',
        'options': [
          {
            'value': 'Road',
            'label': 'Road'
          },
          {
            'value': 'Village',
            'label': 'Village'
          }
        ]
      },
      'water_type': {
        'label': 'Nearby Water',
        'type': 'multichoice',
        'options': [
          {
            'value': 'River',
            'label': 'River'
          },
          {
            'value': 'Lake',
            'label': 'Lake'
          }
        ]
      }
    }
  }
};

export default mapConfig;