let scene, camera, cube;

function parentWidth(elem) {
  return elem.parentElement.clientWidth;
}

function parentHeight(elem) {
  return elem.parentElement.clientHeight;
}

function init3D() {
  scene = new THREE.Scene();
  //   scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(
    75,
    parentWidth(document.getElementById('3Dcube')) /
      parentHeight(document.getElementById('3Dcube')),
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(
    parentWidth(document.getElementById('3Dcube')),
    parentHeight(document.getElementById('3Dcube'))
  );

  document.getElementById('3Dcube').appendChild(renderer.domElement);

  // Create a geometry
  const geometry = new THREE.BoxGeometry(5, 1, 4);

  const pointlight = new THREE.PointLight(0xffffff, 1);
  pointlight.position.set(200, 200, 200);

  const material = new THREE.MeshPhysicalMaterial();

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  scene.add(pointlight);
  camera.position.z = 6;
  renderer.render(scene, camera);
}

// Resize the 3D object when the browser window changes size
function onWindowResize() {
  camera.aspect =
    parentWidth(document.getElementById('3Dcube')) /
    parentHeight(document.getElementById('3Dcube'));
  //camera.aspect = window.innerWidth /  window.innerHeight;
  camera.updateProjectionMatrix();
  //renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(
    parentWidth(document.getElementById('3Dcube')),
    parentHeight(document.getElementById('3Dcube'))
  );
}

window.addEventListener('resize', onWindowResize, false);

// Create the 3D representation
init3D();

if (!!window.EventSource) {
  const source = new EventSource('http://192.168.137.50/events');

  source.addEventListener(
    'open',
    function (e) {
      console.log('Data Terhubung');
    },
    false
  );

  source.addEventListener(
    'error',
    function (e) {
      if (e.target.readyState != EventSource.OPEN) {
        console.log('Data Terputus');
      }
    },
    false
  );

  source.addEventListener(
    'gyro_readings',
    function (e) {
      //console.log("gyro_readings", e.data);
      const obj = JSON.parse(e.data);
      document.getElementById('gyroX').value = obj.gyroX;
      document.getElementById('gyroY').value = 0;
      document.getElementById('gyroZ').value = 0;

      // Change cube rotation after receiving the readinds
      cube.rotation.x = 0;
      cube.rotation.z = obj.gyroX;
      cube.rotation.y = 0;
      renderer.render(scene, camera);
    },
    false
  );
}
