import * as Three from "../libs/three.module.js";
import { GUI } from "../libs/dat.gui.module.js";
import { TrackballControls } from "../libs/TrackballControls.js";
import Stats from "../libs/stats.js";

import {
    Cubo,
    Cono,
    Cilindro,
    Esfera,
    Toro,
    Icosaedro,
} from "../geometria_basica_3D/Geometria_basica.js";
import { Torno } from "../geometria_basica_3D/Geometria_revol.js";
import {
    Pastilla_2D,
    Pastilla_3D,
    Helice,
} from "../geometria_basica_3D/Geometria_shape.js";
import { Taza } from "../geometria_basica_3D/Geometria_CSG.js";
import { PortalGun } from "../modelos/PortalGun.js";
import { Pendulo } from "../modelos/Pendulo.js";

//
// ───────────────────────────────────────────────────────────────────── MAIN ─────
//

class MyScene extends Three.Scene {
    constructor(myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);

        this.gui = this.createGUI();

        this.createLights();
        this.createCamera();
        this.createGround();

        this.fog = new Three.Fog(0, 1000, 10000);

        this.axis = new Three.AxesHelper(5);
        this.add(this.axis);

        // sacar el reloj para actualizaciones
        this.clock = new Three.Clock();

        // Estadísticas
        this.stats = this.createStats(myCanvas);

        // Agrupamos todos los objetos en el objeto `objeto_escena`. Luego tendremos que actualizarlos.
        this.pendulo = new Pendulo(this.gui, "Controles del péndulo");
        this.add(this.pendulo);

        // ─────────────────────────────────────────────────────────────────
    }

    createCamera() {
        this.camera = new Three.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set(20, 10, 20);

        var look = new Three.Vector3(0, 0, 0);
        this.camera.lookAt(look);
        this.add(this.camera);

        this.cameraControl = new TrackballControls(
            this.camera,
            this.renderer.domElement
        );

        this.cameraControl.rotateSpeed = 2.0;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        this.cameraControl.target = look;
    }

    createGround() {
        var geometryGround = new Three.PlaneGeometry(100, 100);

        var texture_ground = new Three.TextureLoader().load(
            "../imgs/bright_squares256.png"
        );

        texture_ground.repeat.set(10, 10);
        texture_ground.wrapS = texture_ground.wrapT = Three.RepeatWrapping;
        texture_ground.magFilter = Three.NearestFilter;
        texture_ground.encoding = Three.sRGBEncoding;

        var materialGround = new Three.MeshPhongMaterial({
            shininess: 2,
            color: 0x576574,
            specular: 0xc8d6e5,
            map: texture_ground,
        });
        var ground = new Three.Mesh(geometryGround, materialGround);

        ground.position.y = -17;
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;

        this.add(ground);
    }

    createGUI() {
        var gui = new GUI();

        this.guiControls = new (function () {
            this.spotlightIntensity = 0.5;
            this.ambientLightIntensity = 1;
            this.sunLightIntensity = 2.5;
            this.axisOnOff = true;
        })();

        //
        // ───────────────────────────────────────────────────── LUCES ─────
        //

        var folder = gui.addFolder("Luz y ejes");

        folder
            .add(this.guiControls, "spotlightIntensity", 0, 50, 1)
            .name("Spotlight intensity");

        folder
            .add(this.guiControls, "ambientLightIntensity", 0, 3, 0.1)
            .name("Ambient light intensity");
        folder
            .add(this.guiControls, "sunLightIntensity", 0, 3, 0.1)
            .name("Sunlight intensity");

        gui.add(this.guiControls, "axisOnOff").name("Mostrar ejes");

        return gui;
    }

    createLights() {
        // Luz ambiental
        this.ambientLight = new Three.AmbientLight(
            0xfefef3,
            this.guiControls.ambientLightIntensity
        );
        this.add(this.ambientLight);

        // Luz solar
        this.sunLight = new Three.DirectionalLight(
            "white",
            this.guiControls.sunLightIntensity
        );
        this.sunLight.position.set(1000, 2000, 1000);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.top = 750;
        this.sunLight.shadow.camera.bottom = -750;
        this.sunLight.shadow.camera.left = -750;
        this.sunLight.shadow.camera.right = 750;
        this.sunLight.shadow.camera.near = 750;
        this.sunLight.shadow.camera.far = 5000;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.bias = -0.0002;

        this.add(this.sunLight);

        // Spotlight
        this.spotLight = new Three.SpotLight(
            0xf6b93b,
            this.guiControls.spotlightIntensity
        );
        this.spotLight.position.set(0, 50, 0);
        this.add(this.spotLight);
    }

    createRenderer(myCanvas) {
        var renderer = new Three.WebGLRenderer();

        renderer.setClearColor(new Three.Color(0xeeeeee), 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.physicallyCorrectLights = true;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = Three.PCFSoftShadowMap;

        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    createStats(myCanvas) {
        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "0";
        stats.domElement.style.top = "0";

        $(myCanvas).append(stats.domElement);

        return stats;
    }

    getCamera() {
        return this.camera;
    }

    setCameraAspect(ratio) {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    }

    onWindowResize() {
        this.setCameraAspect(window.innerWidth / window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.renderer.render(this, this.getCamera());

        this.spotLight.intensity = this.guiControls.spotlightIntensity;
        this.ambientLight.intensity = this.guiControls.ambientLightIntensity;
        this.ambientLight.intensity = this.guiControls.sunLightIntensity;

        this.axis.visible = this.guiControls.axisOnOff;

        this.cameraControl.update();

        // Actualizar los objetos de la escena

        var time = this.clock.getElapsedTime();
        var delta = this.clock.getDelta();

        this.pendulo.update();

        this.stats.update();

        requestAnimationFrame(() => this.update());
    }
}

$(function () {
    var scene = new MyScene("#WebGL-output");
    window.addEventListener("resize", () => scene.onWindowResize());
    scene.update();
});
