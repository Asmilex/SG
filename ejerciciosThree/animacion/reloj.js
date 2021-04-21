import * as TWEEN from "../libs/tween.esm.js";
import * as Three from "../libs/three.module.js";

class Reloj extends Three.Object3D {
    constructor(gui, gui_title) {
        super();

        // Reloj
        this.clock = new Three.Clock();

        // Invocar manecillas
        const alpha = (2 * Math.PI) / 12;
        var angulo = 0;
        const radio = 1;
        const distancia_bolas = 10;

        var esferas = new Three.Object3D();
        var geometria_esferas_externas = new Three.SphereBufferGeometry(
            radio,
            20,
            20
        );

        for (var i = 0; i < 12; i++) {
            var esfera = new Three.Mesh(
                geometria_esferas_externas,
                new Three.MeshPhongMaterial({
                    color: 0x3c40c6,
                })
            );
            esfera.position.set(
                distancia_bolas * Math.cos(angulo),
                0,
                distancia_bolas * Math.sin(angulo)
            );
            esferas.add(esfera);

            angulo = angulo + alpha;
        }

        console.log(esferas);
        this.add(esferas);

        // Crear pelota que se mueve
        var pelota = new Three.Mesh(
            new Three.SphereBufferGeometry(radio, 20, 20),
            new Three.MeshPhongMaterial({ color: 0x00d8d6 })
        );
        pelota.translateX(distancia_bolas - 3);
        this.sistema_pelota = new Three.Object3D();
        this.sistema_pelota.add(pelota);

        this.add(this.sistema_pelota);

        this.createGUI(gui, gui_title);
    }

    createGUI(gui, gui_title) {
        this.guiControls = new (function () {
            this.velocidad = 1;
        })();

        var carpeta = gui.addFolder(gui_title);

        carpeta
            .add(this.guiControls, "velocidad", 0, 20, 0.1)
            .name("Velocidad:")
            .listen();
    }

    update() {
        const up = new Three.Vector3(0, 1, 0);
        this.sistema_pelota.rotateOnAxis(
            up,
            this.guiControls.velocidad * this.clock.getDelta()
        );
    }
}

export { Reloj };
