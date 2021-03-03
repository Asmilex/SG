import * as Three from "../libs/three.module.js";
import { GUI } from "../libs/dat.gui.module.js";
import { TrackballControls } from "../libs/TrackballControls.js";
import Stats from "../libs/stats.js";

import {
    Cubo,
    //Cilindro,
    //Cono,
    //Esfera,
    //Toro,
    //Icosaedro,
} from "./Geometria_basica.js";

//
// ───────────────────────────────────────────────────────────────────── MAIN ─────
//

class MyScene extends Three.Scene {
    constructor(myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);

        this.gui = this.createGUI();

        // Construir los elementos de la escena.
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

        // Crear el modelo por último.
        this.model = new Cubo(this.gui, "Controles del cubo");
        this.add(this.model);
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

        this.cameraControl.rotateSpeed = 5;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        this.cameraControl.target = look;
    }

    createGround() {
        var geometryGround = new Three.PlaneGeometry(100, 100);

        var texture = new Three.TextureLoader().load(
            "../imgs/bright_squares256.png"
        );

        texture.repeat.set(10, 10);
        texture.wrapS = texture.wrapT = Three.RepeatWrapping;
        texture.magFilter = Three.NearestFilter;
        texture.encoding = Three.sRGBEncoding;

        var materialGround = new Three.MeshPhongMaterial({
            shininess: 2,
            color: 0x576574,
            specular: 0xc8d6e5,
            map: texture,
        });
        var ground = new Three.Mesh(geometryGround, materialGround);

        ground.position.y = -0.2;
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;

        this.add(ground);
    }

    createGUI() {
        var gui = new GUI();

        this.guiControls = new (function () {
            this.lightIntensity = 0.5;
            this.axisOnOff = true;
        })();

        var folder = gui.addFolder("Luz y ejes");

        folder
            .add(this.guiControls, "lightIntensity", 0, 1, 0.1)
            .name("Intensidad de la luz:\t");

        folder.add(this.guiControls, "axisOnOff").name("Mostrar ejes:\t");

        return gui;
    }

    createLights() {
        var ambientLight = new Three.AmbientLight(0xfefef3, 1);
        this.add(ambientLight);

        var sunLight = new Three.DirectionalLight("white", 2.5);
        sunLight.position.set(1000, 2000, 1000);
        sunLight.castShadow = true;
        sunLight.shadow.camera.top = 750;
        sunLight.shadow.camera.bottom = -750;
        sunLight.shadow.camera.left = -750;
        sunLight.shadow.camera.right = 750;
        sunLight.shadow.camera.near = 750;
        sunLight.shadow.camera.far = 5000;
        sunLight.shadow.mapSize.set(1024, 1024);
        sunLight.shadow.bias = -0.0002;

        this.add(sunLight);

        this.spotLight = new Three.SpotLight(
            0xf6b93b,
            this.guiControls.lightIntensity
        );
        this.spotLight.position.set(60, 60, 40);
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

        this.spotLight.intensity = this.guiControls.lightIntensity;
        this.axis.visible = this.guiControls.axisOnOff;

        this.cameraControl.update();

        this.model.update();

        this.stats.update();

        const delta = this.clock.getDelta();

        requestAnimationFrame(() => this.update());
    }
}

$(function () {
    var scene = new MyScene("#WebGL-output");
    window.addEventListener("resize", () => scene.onWindowResize());
    scene.update();
});
