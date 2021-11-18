if (!!window.EventSource) {
  const source = new EventSource("http://192.168.137.50/events");

  source.addEventListener(
    "open",
    function (e) {
      console.log("Data Terhubung");
    },
    false
  );

  source.addEventListener(
    "error",
    function (e) {
      if (e.target.readyState != EventSource.OPEN) {
        console.log("Data Terputus");
      }
    },
    false
  );

  source.addEventListener(
    "gyro_readings",
    function (e) {
      //console.log("gyro_readings", e.data);
      const obj = JSON.parse(e.data);
      document.getElementById("gyroX").value = obj.gyroX;
      document.getElementById("gyroY").value = obj.gyroY;
      document.getElementById("gyroZ").value = obj.gyroZ;

      // Change cube rotation after receiving the readinds
      //   cube.rotation.x = obj.gyroY;
      //   cube.rotation.z = obj.gyroX;
      //   cube.rotation.y = obj.gyroZ;
      //   renderer.render(scene, camera);
    },
    false
  );

  // source.addEventListener('temperature_reading', function(e) {
  //   console.log("temperature_reading", e.data);
  //   document.getElementById("temp").innerHTML = e.data;
  // }, false);

  // source.addEventListener('accelerometer_readings', function(e) {
  //   console.log("accelerometer_readings", e.data);
  //   var obj = JSON.parse(e.data);
  //   document.getElementById("accX").innerHTML = obj.accX;
  //   document.getElementById("accY").innerHTML = obj.accY;
  //   document.getElementById("accZ").innerHTML = obj.accZ;
  // }, false);
}

function resetPosition(element) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://192.168.137.24/" + element.id, true);
  console.log(element.id);
  xhr.send();
}
