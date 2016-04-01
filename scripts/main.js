(function() {

  // Based On: https://github.com/sitepoint-editors/VRWeatherParticles

  // Set up scene
  var scene = new THREE.Scene();

  // Set up camera
  var aspectRatio = window.innerWidth / window.innerHeight;
  var camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.001, 700);
  camera.position.set(14, 15, 1);

  scene.add(camera);

  // Set up the renderer
  var renderer = new THREE.WebGLRenderer();
  var element = renderer.domElement;
  var container = document.getElementById('viewer');
  container.appendChild(element);

  // Set up stereoscopic effect (Google Cardboard 3D effect)
  var effect = new THREE.StereoEffect(renderer);

  // Use mouse controls as a fallback
  var controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x + 0.15,
    camera.position.y,
    camera.position.z + 0.15
  );
  controls.enablePan = false;
  controls.enableZoom = false;

  // If available, enable Google Cardboard controls
  // (oritentation and fullscreen)
  function enableCardboardControls(e)
  {
    if (!e.alpha)
    {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', enableCardboardControls, true);
  }

  window.addEventListener('deviceorientation', enableCardboardControls, true);

  var textureLoader = new THREE.TextureLoader();

  // Form
  var formTexture = textureLoader.load('images/form.jpg');

  var form = new THREE.Mesh(new THREE.CubeGeometry(5, 0.1, 5), new THREE.MeshBasicMaterial({ map: formTexture }));
  form.position.set(15, 13, 5);
  form.rotateZ(Math.PI);
  form.rotateX(Math.PI/2);
  scene.add(form);

  // Floor
  var envTexture = textureLoader.load('images/space.jpg');
  envTexture.wrapS = THREE.RepeatWrapping;
  envTexture.wrapT = THREE.RepeatWrapping;
  envTexture.repeat = new THREE.Vector2(1, 1);
  envTexture.anisotropy = renderer.getMaxAnisotropy();

  var envMaterial = new THREE.MeshBasicMaterial({ map: envTexture });

  var environment = new THREE.Mesh(new THREE.BoxGeometry(600, 600, 600, 7, 7, 7), envMaterial);
  environment.scale.x = -1;
  scene.add(environment);

  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);

  // Animation Loop
  clock = new THREE.Clock();

  animate();

  function animate()
  {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
  }

  function resize()
  {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
  }

  function update(dt)
  {
    resize();

    camera.updateProjectionMatrix();
    controls.update(dt);
  }

  function render(dt)
  {
    effect.render(scene, camera);
  }

  function fullscreen()
  {
    if (container.requestFullscreen)
    {
      container.requestFullscreen();
    }
    else if (container.msRequestFullscreen)
    {
      container.msRequestFullscreen();
    }
    else if (container.mozRequestFullScreen)
    {
      container.mozRequestFullScreen();
    }
    else if (container.webkitRequestFullscreen)
    {
      container.webkitRequestFullscreen();
    }
  }


})();
