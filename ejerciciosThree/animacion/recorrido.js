import * as TWEEN from "../libs/tween.esm.js";
import * as Three from "../libs/three.module.js";

class Recorrido extends Three.Object3D {
    constructor() {
        super();

        this.trayectoria = new Trayectoria();
        this.add(this.trayectoria);

        this.avion = new Avion();
        this.add(this.avion);

        var origen = { t: 0 };
        var intermedio = { t: 0.5 };
        var destino = { t: 1 };

        var that = this;

        this.movimiento_2 = new TWEEN.Tween(intermedio)
            .to(destino, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function () {
                intermedio.t = 0.5;
            })
            .onUpdate(function () {
                var nueva_posicion = that.trayectoria.spline.getPointAt(
                    intermedio.t
                );

                that.avion.position.copy(nueva_posicion);

                nueva_posicion.add(
                    that.trayectoria.spline.getTangentAt(intermedio.t)
                );
                that.avion.lookAt(nueva_posicion);
            });

        this.movimiento_1 = new TWEEN.Tween(origen)
            .to(intermedio, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function () {
                origen.t = 0;
            })
            .onUpdate(function () {
                var nueva_posicion = that.trayectoria.spline.getPointAt(
                    origen.t
                );
                that.avion.position.copy(nueva_posicion);

                nueva_posicion.add(
                    that.trayectoria.spline.getTangentAt(origen.t)
                );
                that.avion.lookAt(nueva_posicion);
            });

        this.movimiento_1.chain(this.movimiento_2);
        this.movimiento_2.chain(this.movimiento_1);

        this.movimiento_1.start();

        console.log(this.trayectoria.spline.getPointAt(0.5));
    }

    update() {
        TWEEN.update(); // FIXME creo que no hace falta el tiempo.
    }
}

class Trayectoria extends Three.Object3D {
    constructor() {
        super();

        this.spline = new Three.CatmullRomCurve3([
            // Primera parte
            new Three.Vector3(0, 0, 0),
            new Three.Vector3(0.5, 2, 1.9375),
            new Three.Vector3(-3, 0, 2.3),
            new Three.Vector3(1, -1, 7),
            new Three.Vector3(1.5, 0.5, 5.937),
            new Three.Vector3(2, 0.4, -4),
            new Three.Vector3(1, -3, -2.5),
            new Three.Vector3(-1, -1, -1.5),
            new Three.Vector3(0, 0, 0),
        ]);

        var geometria_linea = new Three.Geometry();
        geometria_linea.vertices = this.spline.getPoints(100);

        var material_linea = new Three.LineDashedMaterial({ color: 0x3c6382 });

        this.add(new Three.Line(geometria_linea, material_linea));
    }
}

class Avion extends Three.Object3D {
    constructor() {
        super();

        var avion = new Three.Mesh(
            new Three.ConeBufferGeometry(0.2, 0.8),
            new Three.MeshPhongMaterial({ color: 0xffb142 })
        );

        avion.rotateX(Math.PI / 2);

        this.add(avion);
    }
}

export { Recorrido };
