import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Import CSS cho Geocoder

// Đảm bảo bạn đã thay đổi accessToken thành của riêng bạn
mapboxgl.accessToken = "pk.eyJ1IjoiZGluaDE2MTAiLCJhIjoiY20wamQ5bzZhMHc1bDJycTV3YndjM2ZtNiJ9.yR21wIhXcO8qmM58h_JIUw";

const MapBoxComponent = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current, // Thẻ HTML chứa bản đồ
        style: "mapbox://styles/dinh1610/cm0jeiqxm005b01qydqacanqd", // Style của bản đồ
        center: [108.2506521, 15.9752654], // Tọa độ ban đầu [longitude, latitude]
        zoom: 16, // Độ zoom ban đầu
      });

      // Thêm điều khiển zoom
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Thêm điều khiển toàn màn hình
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

       // Thêm điều khiển tìm kiếm
       const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Tìm kiếm địa điểm...', // Placeholder cho thanh tìm kiếm
      });

      map.addControl(geocoder, 'top-left');

      // Lắng nghe sự kiện result của Geocoder
      geocoder.on('result', (e) => {
        const placeName = e.result.place_name; // Tên địa điểm
        const coordinates = e.result.geometry.coordinates; // Tọa độ [longitude, latitude]
        console.log('Địa điểm được chọn:', placeName);
        console.log('Tọa độ:', coordinates);
      });

      // Thêm popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML("<h3>Đây là một popup</h3><p>Thông tin bổ sung ở đây.</p>");
      new mapboxgl.Marker()
        .setLngLat([105.7938072, 21.0244246])
        .setPopup(popup)
        .addTo(map);

      // Thêm sự kiện click vào bản đồ
      map.on('click', (e) => {
        new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map);
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setHTML(`<p>Vị trí bạn vừa nhấp: ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}</p>`)
          .addTo(map);
        console.log(e.lngLat);
      });

      // Thêm công cụ vẽ (dùng Mapbox Draw)
      const Draw = require('@mapbox/mapbox-gl-draw');
      const draw = new Draw();
      map.addControl(draw);

      return () => map.remove(); // Cleanup khi component bị unmount
    }
  }, []);

  return (
    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
  );
};

export default MapBoxComponent;
