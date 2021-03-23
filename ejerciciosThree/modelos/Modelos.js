import * as Three from "../libs/three.module.js";
import { MTLLoader } from "../libs/MTLLoader.js";
import { OBJLoader } from "../libs/OBJLoader.js";

class PortalGun extends Three.Object3D {
    constructor() {
        super();

        var that = this;

        var material_loader = new MTLLoader();
        var object_loader = new OBJLoader();

        material_loader.load(
            "../models/PortalGun/PortalGun.mtl",
            function (materials) {
                object_loader.setMaterials(materials);
                object_loader.load(
                    "../models/PortalGun/PortalGun.obj",
                    function (object) {
                        var modelo = object;
                        that.add(modelo);
                    },
                    null,
                    null
                );
            }
        );
    }
}

export { PortalGun };
