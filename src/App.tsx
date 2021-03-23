import {useEffect, useRef, useState} from 'react';
import {Loader, LoaderOptions} from '@googlemaps/js-api-loader';
import './App.css';
import './App.sass';

const layers = [
  {
    tilePrefix:
      'https://storage.googleapis.com/nico-earthshot-test/playground-map-cloud-experiment-county-parcels/',
    tileSuffix: '',
    name: 'Parcels',
  },
  {
    tilePrefix:
      'https://storage.googleapis.com/nico-earthshot-test/playground-map-cloud-experiment-county-borders/',
    tileSuffix: '',
    name: 'County Borders',
  },
  {
    tilePrefix:
      'https://storage.googleapis.com/gee-export-bucket/riley-agb-parcel-data-2021/',
    tileSuffix: '',
    name: 'AGB 2021',
  },
  {
    tilePrefix:
      'https://storage.googleapis.com/gee-export-bucket/riley-agb-parcel-data-2031/',
    tileSuffix: '',
    name: 'AGB 2031',
  },
  {
    tilePrefix:
      'https://storage.googleapis.com/gee-export-bucket/riley-agb-parcel-data-2051/',
    tileSuffix: '',
    name: 'AGB 2051',
  },
  {
    tilePrefix:
      'https://storage.googleapis.com/saurya-earthshot-test/playground-map-cloud-experiment/',
    tileSuffix: '',
    name: 'Hudak',
  },
];

function App() {
  const [mapInstance, setMapInstance] = useState<Loader>();
  const [config, setConfig] = useState<{GOOGLE_API_KEY: string}>();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config) {
      fetch(`${process.env.PUBLIC_URL}/config.json`).then((resp) =>
        resp.json().then(setConfig),
      );
    } else if (config) {
      const options: LoaderOptions = {
        apiKey: config.GOOGLE_API_KEY,
      };
      const loader = new Loader(options);
      setMapInstance(loader);
    }
  }, [config]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.load().then(() => {
        if (mapRef.current !== null) {
          var minZoom = 0.0;
          var maxZoom = 13.0;
          const initialMap = new google.maps.Map(mapRef.current, {
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            minZoom: minZoom,
            maxZoom: maxZoom,
          });
          var latLngBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(42.87999999999998, -124.1),
            new google.maps.LatLng(43.38006806800515, -123.6),
          );
          initialMap.fitBounds(latLngBounds);
          layers.forEach((layer) => {
            var overlayMapType = new google.maps.ImageMapType({
              getTileUrl: (coord, zoom) => {
                if (zoom < minZoom || zoom > maxZoom) {
                  return '';
                }
                var numTiles = 1 << zoom;
                var x = ((coord.x % numTiles) + numTiles) % numTiles;
                return [
                  layer.tilePrefix,
                  zoom,
                  '/',
                  x,
                  '/',
                  coord.y,
                  layer.tileSuffix,
                ].join('');
              },
              tileSize: new google.maps.Size(256, 256),
            });
            const exampleButton = document.querySelector(
              '#example_layer_control',
            ) as HTMLElement;
            const layerControl = exampleButton.cloneNode(true) as HTMLElement;
            layerControl.id = layer.name + '_control';
            const toggleButton = layerControl.querySelector(
              'button',
            ) as HTMLElement;
            toggleButton.textContent = layer.name;
            layerControl.classList.add('activated');
            toggleButton.addEventListener('click', () => {
              if (layerControl.classList.contains('activated')) {
                overlayMapType.setOpacity(0);
                layerSlider.value = '0';
                layerControl.classList.remove('activated');
              } else {
                overlayMapType.setOpacity(1.0);
                layerSlider.value = '100';
                layerControl.classList.add('activated');
              }
            });

            const layerSlider = layerControl.querySelector(
              'input.slider',
            ) as HTMLInputElement;
            layerSlider.addEventListener('input', () => {
              overlayMapType.setOpacity(parseInt(layerSlider.value) / 100);
            });
            initialMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(
              layerControl,
            );
            initialMap.overlayMapTypes.push(overlayMapType);
          });
        }
      });
    }
  }, [mapInstance]);

  return (
    <div>
      <div className="map_container container">
        <div className="title has-text-centered">Welcome to LandX AI</div>
        <div className="layer_control container" id="example_layer_control">
          <button className="layer_button button" />
          <input
            type="range"
            min="1"
            max="100"
            value="100"
            className="slider"
          />
        </div>
        <div id="map-canvas" ref={mapRef} className="card"></div>
      </div>
    </div>
  );
}

export default App;
