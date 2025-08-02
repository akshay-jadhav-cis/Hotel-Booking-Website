let mapbox="<%= process.env.MAPTOKEN %>"
          console.log(mapbox);
	      mapboxgl.accessToken = mapbox;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
        });