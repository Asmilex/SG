import * as Three from "../libs/three.module.js";

/* TODO
    - Elementos a crear: Cubo, cono, cilindro, esfera, toro, icosaedro.
    - Material usado es MeshNormalMaterial en los vídeos.
    - Sombreado suave: flatShading = true
        NOTE: poner true al atributo needsUpdate del material para que se tenga en cuenta el cambio
        NOTE: no hace falta con renderer.physicallyCorrectLights = true
    - Movimiento continuo se consigue aumentando un poco la rotación poco a poco. Por ejemplo: += 0.01.
        NOTE: quizás, pequeña rotación continua lateral + oscilación hacia arriba y hacia abajo?

    - Colores: https://flatuicolors.com/palette/ca
*/

//
// ─────────────────────────────────────────────────────────────────── CLASES ─────
//

/*
    Implementación de los controles básicos de los objetos.
    No repetimos los mismos elementos para todos los objetos
*/
class Basic_Geometry extends Three.Mesh {
    constructor(gui, gui_title) {
        super();
        this.createGUI(gui, gui_title);
    }

    createGUI(gui, titleGui) {
        this.guiControls = new (function () {
            this.sizeX = 1;
            this.sizeY = 1;
            this.sizeZ = 1;

            this.rotX = 0.0;
            this.rotY = 0.0;
            this.rotZ = 0.0;

            this.posX = 0.0;
            this.posY = 0.4;
            this.posZ = 0.0;

            this.reset_position = new Three.Vector3(0, 0.4, 0);

            this.wireframe = false;

            // Un botón para dejarlo todo en su posición inicial
            // Cuando se pulse se ejecutará esta función.
            this.reset = function () {
                this.sizeX = 1.0;
                this.sizeY = 1.0;
                this.sizeZ = 1.0;

                this.rotX = 0.0;
                this.rotY = 0.0;
                this.rotZ = 0.0;

                this.posX = this.reset_position.x;
                this.posY = this.reset_position.y;
                this.posZ = this.reset_position.z;
            };
        })();

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas lineas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
        folder.add(this.guiControls, "wireframe").name("Wireframe");
        folder
            .add(this.guiControls, "sizeX", 0.1, 5.0, 0.1)
            .name("Tamaño X:\t")
            .listen();

        folder
            .add(this.guiControls, "sizeY", 0.1, 5.0, 0.1)
            .name("Tamaño Y:\t")
            .listen();

        folder
            .add(this.guiControls, "sizeZ", 0.1, 5.0, 0.1)
            .name("Tamaño Z:\t")
            .listen();

        folder
            .add(this.guiControls, "rotX", 0.0, Math.PI / 2, 0.1)
            .name("Rotación X:\t")
            .listen();

        folder
            .add(this.guiControls, "rotY", 0.0, Math.PI / 2, 0.1)
            .name("Rotación Y:\t")
            .listen();

        folder
            .add(this.guiControls, "rotZ", 0.0, Math.PI / 2, 0.1)
            .name("Rotación Z:\t")
            .listen();

        folder
            .add(this.guiControls, "posX", -20.0, 20.0, 0.1)
            .name("Posición X:\t")
            .listen();

        folder
            .add(this.guiControls, "posY", 0.0, 10.0, 0.1)
            .name("Posición Y:\t")
            .listen();

        folder
            .add(this.guiControls, "posZ", -20.0, 20.0, 0.1)
            .name("Posición Z:\t")
            .listen();

        folder.add(this.guiControls, "reset").name("[ Reset ]");
    }
    update() {
        this.position.set(
            this.guiControls.posX,
            this.guiControls.posY,
            this.guiControls.posZ
        );
        this.rotation.set(
            this.guiControls.rotX,
            this.guiControls.rotY,
            this.guiControls.rotZ
        );
        this.scale.set(
            this.guiControls.sizeX,
            this.guiControls.sizeY,
            this.guiControls.sizeZ
        );

        this.material.wireframe = this.guiControls.wireframe;
    }

    set_spawn_coordinates(coordenadas) {
        this.guiControls.posX = coordenadas.x;
        this.guiControls.posY = coordenadas.y;
        this.guiControls.posZ = coordenadas.z;

        this.guiControls.reset_position = coordenadas;
    }

    set_spawn_coordinates(x, y, z) {
        this.guiControls.posX = x;
        this.guiControls.posY = y;
        this.guiControls.posZ = z;

        this.guiControls.reset_position.x = x;
        this.guiControls.reset_position.y = y;
        this.guiControls.reset_position.z = z;
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Cubo extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        // Un Mesh se compone de geometría y material
        this.geometry = new Three.BoxGeometry(1, 1, 1);
        // Como material se crea uno a partir de un color
        this.material = new Three.MeshPhongMaterial({
            color: 0xee5253,
            flatShading: true,
            specular: 0.4,
            shininess: 0.1,
            reflectivity: 0.2,
        });
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Cono extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        this.geometry = new Three.ConeGeometry(0.8, 1.5, 20);

        this.material = new Three.MeshPhongMaterial({
            color: 0xff9f43,
            specular: 0.8,
            shininess: 0.1,
            reflectivity: 0.8,
        });
    }
}

    createGUI(gui, gui_title) {
        this.guiControls = new (function () {
            this.sizeX = 1.0;
            this.sizeY = 1.0;
            this.sizeZ = 1.0;

            this.rotX = 0.0;
            this.rotY = 0.0;
            this.rotZ = 0.0;

            this.posX = 2.0;
            this.posY = 0.4;
            this.posZ = 0.0;

            this.wireframe = false;

            // Un botón para dejarlo todo en su posición inicial
            // Cuando se pulse se ejecutará esta función.
            this.reset = function () {
                this.sizeX = 1.0;
                this.sizeY = 1.0;
                this.sizeZ = 1.0;

                this.rotX = 0.0;
                this.rotY = 0.0;
                this.rotZ = 0.0;

                this.posX = 2.0;
                this.posY = 0.4;
                this.posZ = 0.0;
            };
        })();

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(gui_title);

        // Estas lineas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
        folder.add(this.guiControls, "wireframe").name("Wireframe");
        folder
            .add(this.guiControls, "sizeX", 0.1, 5.0, 0.1)
            .name("Tamaño X:\t")
            .listen();

        folder
            .add(this.guiControls, "sizeY", 0.1, 5.0, 0.1)
            .name("Tamaño Y:\t")
            .listen();

        folder
            .add(this.guiControls, "sizeZ", 0.1, 5.0, 0.1)
            .name("Tamaño Z:\t")
            .listen();

        folder
            .add(this.guiControls, "rotX", 0.0, Math.PI / 2, 0.1)
            .name("Rotación X:\t")
            .listen();

        folder
            .add(this.guiControls, "rotY", 0.0, Math.PI / 2, 0.1)
            .name("Rotación Y:\t")
            .listen();

        folder
            .add(this.guiControls, "rotZ", 0.0, Math.PI / 2, 0.1)
            .name("Rotación Z:\t")
            .listen();

        folder
            .add(this.guiControls, "posX", -20.0, 20.0, 0.1)
            .name("Posición X:\t")
            .listen();

        folder
            .add(this.guiControls, "posY", 0.0, 10.0, 0.1)
            .name("Posición Y:\t")
            .listen();

        folder
            .add(this.guiControls, "posZ", -20.0, 20.0, 0.1)
            .name("Posición Z:\t")
            .listen();

        folder.add(this.guiControls, "reset").name("[ Reset ]");
    }
    update() {
        this.position.set(
            this.guiControls.posX,
            this.guiControls.posY,
            this.guiControls.posZ
        );
        this.rotation.set(
            this.guiControls.rotX,
            this.guiControls.rotY,
            this.guiControls.rotZ
        );
        this.scale.set(
            this.guiControls.sizeX,
            this.guiControls.sizeY,
            this.guiControls.sizeZ
        );

        this.material.wireframe = this.guiControls.wireframe;
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Cilindro extends Three.Object3D {
    constructor(gui, gui_title) {
        super();

        this.createGUI(gui, gui_title);

        this.geometry = new Three.CylinderGeometry(1, 1, 1, 20);
        this.material = new Three.MeshToonMaterial({
            color: 0x5f27cd,
            wireframe: false,
        });
    }

    guiControls(gui, gui_title) {}
    update() {}
}

// ────────────────────────────────────────────────────────────────────────────────

class Esfera extends Three.Object3D {}

// ────────────────────────────────────────────────────────────────────────────────

class Toro extends Three.Object3D {}

// ────────────────────────────────────────────────────────────────────────────────

class Icosaedro extends Three.Object3D {}

export { Cubo, Cilindro, Cono, Esfera, Icosaedro, Toro };