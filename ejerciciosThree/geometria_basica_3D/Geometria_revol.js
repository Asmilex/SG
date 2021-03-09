import * as Three from "../libs/three.module.js";

class Torno extends Three.Mesh {
    constructor(gui, gui_title) {
        super();
        this.createGUI(gui, gui_title);

        this.points = [];

        for (let i = 0; i < 20; i++) {
            this.points.push(
                new Three.Vector2(Math.sin(i * 0.5) + 1 * 2, i + 1)
            );
        }

        this.geometry = new Three.LatheGeometry(
            this.points,
            this.guiControls.segmentos,
            this.guiControls.phi_start,
            this.guiControls.phi_length
        );
        this.material = new Three.MeshNormalMaterial();
    }

    // ────────────────────────────────────────────────────────────────────────────────

    createGUI(gui, gui_title) {
        this.guiControls = new (function () {
            this.segmentos = 12;
            this.phi_start = 0;
            this.phi_length = 2 * Math.PI;
            this.wireframe = false;
        })();

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(gui_title);
        var that = this;

        folder
            .add(this.guiControls, "segmentos", 1, 40, 1)
            .name("Segmentos")
            .onChange(function (value) {
                that.geometry.dispose();
                that.geometry = new Three.LatheGeometry(
                    that.points,
                    that.guiControls.segmentos,
                    that.guiControls.phi_start,
                    that.guiControls.phi_length
                );
            })
            .listen();

        folder
            .add(this.guiControls, "phi_start", 0, 2 * Math.PI, 0.1)
            .name("Phi start")
            .onChange(function (value) {
                that.geometry.dispose();
                that.geometry = new Three.LatheGeometry(
                    that.points,
                    that.guiControls.segmentos,
                    that.guiControls.phi_start,
                    that.guiControls.phi_length
                );
            })
            .listen();

        folder
            .add(this.guiControls, "phi_length", 0, 2 * Math.PI, 0.1)
            .name("Phi length")
            .onChange(function (value) {
                that.geometry.dispose();
                that.geometry = new Three.LatheGeometry(
                    that.points,
                    that.guiControls.segmentos,
                    that.guiControls.phi_start,
                    that.guiControls.phi_length
                );
            })
            .listen();

        folder
            .add(this.guiControls, "wireframe")
            .name("Wireframe")
            .onChange(function (value) {
                that.material.wireframe = that.guiControls.wireframe;
            })
            .listen();
    }
    update() {}
}

export { Torno };
