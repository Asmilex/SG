import * as Three from "../libs/three.module.js";

class Pastilla_2D extends Three.Mesh {
    constructor() {
        super();

        this.geometry = new Three.ShapeGeometry(this.crear_forma());
        this.material = new Three.MeshNormalMaterial({
            color: 0x8395a7,
            side: Three.DoubleSide,
        });
    }

    crear_forma() {
        var x = 0,
            y = 0,
            radius = 1,
            height = 5,
            width = 2;

        var forma = new Three.Shape()
            .moveTo(x, y + radius)
            .lineTo(x, y + height - radius)
            .quadraticCurveTo(x, y + height, x + radius, y + height)
            .lineTo(x + width - radius, y + height)
            .quadraticCurveTo(
                x + width,
                y + height,
                x + width,
                y + height - radius
            )
            .lineTo(x + width, y + radius)
            .quadraticCurveTo(x + width, y, x + width - radius, y)
            .lineTo(x + radius, y)
            .quadraticCurveTo(x, y, x, y + radius);

        return forma;
    }
}

class Pastilla_3D extends Three.Mesh {
    constructor() {
        super();
        var extrude_settings = {
            depth: 1,
            bevelEnabled: true,
            bevelSegments: 10,
            steps: 2,
            bevelSize: 0.3,
            bevelThickness: 1,
        };

        this.geometry = new Three.ExtrudeGeometry(
            this.crear_forma(),
            extrude_settings
        );
        this.material = new Three.MeshNormalMaterial({
            color: 0x8395a7,
            side: Three.DoubleSide,
        });
    }

    crear_forma() {
        var x = 0,
            y = 0,
            radius = 1,
            height = 5,
            width = 2;

        var forma = new Three.Shape()
            .moveTo(x, y + radius)
            .lineTo(x, y + height - radius)
            .quadraticCurveTo(x, y + height, x + radius, y + height)
            .lineTo(x + width - radius, y + height)
            .quadraticCurveTo(
                x + width,
                y + height,
                x + width,
                y + height - radius
            )
            .lineTo(x + width, y + radius)
            .quadraticCurveTo(x + width, y, x + width - radius, y)
            .lineTo(x + radius, y)
            .quadraticCurveTo(x, y, x, y + radius);

        return forma;
    }
}

class Helice extends Three.Mesh {
    constructor() {
        super();

        const spline_cerrado = new Three.CatmullRomCurve3(
            this.puntos_spline(),
            false,
            "chordal"
        );
        spline_cerrado.curveType = "catmullrom";

        const extrude_settings = {
            steps: 500,
            bevelEnabled: true,
            bevelSize: 0.1,
            extrudePath: spline_cerrado,
        };

        this.geometry = new Three.ExtrudeGeometry(
            this.forma(),
            extrude_settings
        );
        this.material = new Three.MeshPhongMaterial({
            color: 0x8395a7,
        });
    }

    puntos_spline() {
        const puntos = [];
        const pasos = 20;

        for (let i = 0; i < pasos; i++) {
            puntos.push(new Three.Vector3(Math.cos(i), Math.sin(i), i / 2));
        }

        return puntos;
    }

    forma() {
        return new Three.Shape()
            .moveTo(1, 0)
            .lineTo(0, 1)
            .lineTo(-1, 0)
            .lineTo(0, -1)
            .lineTo(1, 0);
    }
}
export { Pastilla_2D, Pastilla_3D, Helice };
