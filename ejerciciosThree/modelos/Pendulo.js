import * as Three from "../libs/three.module.js";

class Pendulo extends Three.Object3D {
    constructor(gui, gui_title) {
        super();

        this.palo_grande = new PaloGrande();
        this.add(this.palo_grande);
        this.createGUI(gui, gui_title);
    }

    createGUI(gui, gui_title) {
        this.guiControls = new (function () {
            this.angulo_grande = 0;
            this.longitud_pieza_roja = 5.0;
        })();
        var carpeta_pendulo_g = gui.addFolder("Primer péndulo");
        var that = this;

        carpeta_pendulo_g
            .add(
                this.guiControls,
                "angulo_grande",
                -Math.PI / 4,
                Math.PI / 4,
                0.01
            )
            .name("Giro")
            .onChange(function (valor) {
                that.palo_grande.rotation.set(
                    0,
                    0,
                    that.guiControls.angulo_grande
                );
            })
            .listen();

        carpeta_pendulo_g
            .add(this.guiControls, "longitud_pieza_roja", 5, 10, 0.01)
            .name("Longitud")
            .onChange(function (valor) {
                that.palo_grande.pieza_roja.scale.set(
                    1,
                    that.guiControls.longitud_pieza_roja / 5, // En escala, llevar [5, 10] a [1, 2]
                    1
                );
                that.palo_grande.pieza_roja.position.y =
                    -2 - that.guiControls.longitud_pieza_roja / 2.0;
                that.palo_grande.pieza_verde_2.position.y =
                    -2 - that.guiControls.longitud_pieza_roja - 2;
            })
            .listen();
    }
}

class PaloGrande extends Three.Object3D {
    constructor(gui, gui_title) {
        super();

        this.pieza_verde_1 = new PiezaVerde();
        this.add(this.pieza_verde_1);

        this.eje_grande = new Eje();
        this.eje_grande.position.z = this.eje_grande.position.z + 2;
        this.add(this.eje_grande);

        this.pieza_roja = new PiezaRoja();
        this.pieza_roja.position.y = -4.5;
        this.add(this.pieza_roja);

        this.pieza_verde_2 = new PiezaVerde();
        this.pieza_verde_2.position.y = this.pieza_verde_2.position.y - 9;
        this.add(this.pieza_verde_2);

        this.createGUI(gui, gui_title);
    }

    createGUI(gui, gui_title) {}
}

class PaloChico extends Three.Object3D {
    constructor(gui, gui_title) {
        super();
    }
}

class Eje extends Three.Object3D {
    constructor() {
        super();

        const forma = new Three.Shape();
        forma
            .moveTo(1, 0)
            .lineTo(Math.sqrt(2) / 2, Math.sqrt(2) / 2)
            .lineTo(0, 1)
            .lineTo(-Math.sqrt(2) / 2, Math.sqrt(2) / 2)
            .lineTo(-1, 0)
            .lineTo(-Math.sqrt(2) / 2, -Math.sqrt(2) / 2)
            .lineTo(0, -1)
            .lineTo(Math.sqrt(2) / 2, -Math.sqrt(2) / 2)
            .lineTo(1, 0);

        const extrude_settings = {
            steps: 1,
            depth: 0.5,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 1,
        };

        const geometry = new Three.ExtrudeGeometry(forma, extrude_settings);
        const material = new Three.MeshPhongMaterial({ color: 0xff9ff3 });
        const mesh = new Three.Mesh(geometry, material);
        this.add(mesh);
    }
}

class PiezaVerde extends Three.Object3D {
    constructor() {
        super();

        const geometria = new Three.BoxGeometry(4, 4, 4);
        const material = (this.material = new Three.MeshPhongMaterial({
            color: 0x1dd1a1,
        }));

        this.add(new Three.Mesh(geometria, material));
    }
}

class PiezaRoja extends Three.Object3D {
    constructor() {
        super();

        const geometria = new Three.BoxGeometry(4, 5, 4);
        const material = (this.material = new Three.MeshPhongMaterial({
            color: 0xff6b6b,
        }));

        this.add(new Three.Mesh(geometria, material));
    }
}

export { Pendulo };
