import { ThreeBSP } from "../libs/ThreeBSP.js";
import * as Three from "../libs/three.module.js";

class Taza extends Three.Object3D {
    constructor() {
        super();

        var material = new Three.MeshPhongMaterial();

        // Geometrías
        var geometria_toro = new Three.TorusGeometry(1, 0.2, 15, 32);
        geometria_toro.scale(0.5, 0.6, 0.5);
        geometria_toro.translate(-1, 0, 0);

        var geometria_cilindro_externo = new Three.CylinderGeometry(
            1,
            1,
            2,
            20,
            32
        );
        var geometria_cilindro_interno = new Three.CylinderGeometry(
            1,
            1,
            2,
            20,
            32
        );
        geometria_cilindro_interno.scale(0.9, 1, 0.9);
        geometria_cilindro_interno.translate(0, 0.1, 0);

        // BSPs
        var toro_BSP = new ThreeBSP(geometria_toro);
        var cilindro_externo = new ThreeBSP(geometria_cilindro_externo);
        var cilindro_interno = new ThreeBSP(geometria_cilindro_interno);

        var taza = cilindro_externo.union(toro_BSP).subtract(cilindro_interno);

        this.add(taza.toMesh(material));
    }
}

export { Taza };
