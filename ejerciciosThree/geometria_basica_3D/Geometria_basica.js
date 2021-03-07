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

            this.spawn_position = new Three.Vector3(0, 0.4, 0);

            this.wireframe = false;

            this.enable_animation = true;

            // Un botón para dejarlo todo en su posición inicial
            // Cuando se pulse se ejecutará esta función.
            this.reset = function () {
                this.sizeX = 1.0;
                this.sizeY = 1.0;
                this.sizeZ = 1.0;

                this.rotX = 0.0;
                this.rotY = 0.0;
                this.rotZ = 0.0;

                this.posX = this.spawn_position.x;
                this.posY = this.spawn_position.y;
                this.posZ = this.spawn_position.z;
            };
        })();

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas lineas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice

        //
        // ────────────────────────────────────────────────── POSICION ─────
        //

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

        //
        // ──────────────────────────────────────────────────── TAMAÑO ─────
        //

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

        //
        // ────────────────────────────────────────────────── ROTACION ─────
        //

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

        //
        // ───────────────────────────────────────────────────── OTROS ─────
        //

        folder.add(this.guiControls, "wireframe").name("Wireframe").listen();

        folder
            .add(this.guiControls, "enable_animation")
            .name("Animaciones")
            .listen();

        folder.add(this.guiControls, "reset").name("[ Reset ]");
    }

    set_spawn_coordinates(coordenadas) {
        this.guiControls.posX = coordenadas.x;
        this.guiControls.posY = coordenadas.y;
        this.guiControls.posZ = coordenadas.z;

        this.guiControls.spawn_position = coordenadas;
    }

    set_spawn_coordinates(x, y, z) {
        this.guiControls.posX = x;
        this.guiControls.posY = y;
        this.guiControls.posZ = z;

        this.guiControls.spawn_position.x = x;
        this.guiControls.spawn_position.y = y;
        this.guiControls.spawn_position.z = z;
    }

    set_position(x, y, z) {
        this.position.set(x, y, z);
        this.guiControls.posX = x;
        this.guiControls.posY = y;
        this.guiControls.posZ = z;
    }
    // ────────────────────────────────────────────────────────────────────────────────

    animate(t) {
        this.set_position(
            this.position.x,
            this.guiControls.spawn_position.y + Math.abs(Math.sin(2 * t)),
            this.position.z
        );

        if (this.guiControls.rotY + 0.01 < 2 * Math.PI)
            this.guiControls.rotY = this.guiControls.rotY + 0.01;
        else this.guiControls.rotY = 0;
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

// ────────────────────────────────────────────────────────────────────────────────

class Cilindro extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        this.geometry = new Three.CylinderGeometry(0.5, 0.5, 1, 20);
        this.material = new Three.MeshPhongMaterial({
            color: 0x5f27cd,
            wireframe: false,
        });
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Esfera extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        this.geometry = new Three.SphereGeometry(0.5, 10, 10);
        this.material = new Three.MeshPhongMaterial({
            color: 0x00d2d3,
            wireframe: false,
        });
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Toro extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        this.geometry = new Three.TorusGeometry(0.4, 0.2, 20, 20);
        this.material = new Three.MeshPhongMaterial({
            color: 0x54a0ff,
            wireframe: false,
        });
    }
}

// ────────────────────────────────────────────────────────────────────────────────

class Icosaedro extends Basic_Geometry {
    constructor(gui, gui_title) {
        super(gui, gui_title);

        this.geometry = new Three.IcosahedronGeometry(0.5);
        this.material = new Three.MeshNormalMaterial({
            wireframe: false,
        });
    }
}

export { Cubo, Cilindro, Cono, Esfera, Icosaedro, Toro };
