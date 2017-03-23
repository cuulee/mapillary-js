/// <reference path="../../../../typings/index.d.ts" />

import * as THREE from "three";

import {ILatLon} from "../../../API";
import {
    ICircleMarkerOptions,
    Marker,
} from "../../../Component";

export class CircleMarker extends Marker {
    private _color: number | string;
    private _opacity: number;
    private _radius: number;

    constructor(id: string, latLon: ILatLon, options?: ICircleMarkerOptions) {
        super(id, latLon);

        options = !!options ? options : {};
        this._color = options.color != null ? options.color : 0xffffff;
        this._opacity = options.opacity != null ? options.opacity : 0.4;
        this._radius = options.radius != null ? options.radius : 1;
    }

    protected _createGeometry(position: number[]): void {
        const circle: THREE.Mesh = new THREE.Mesh(
            new THREE.CircleGeometry(this._radius, 16),
            new THREE.MeshBasicMaterial({
                color: this._color,
                opacity: this._opacity,
                transparent: true,
            }));

        circle.up.fromArray([0, 0, 1]);
        circle.renderOrder = -1;

        const group: THREE.Object3D = new THREE.Object3D();
        group.add(circle);
        group.position.fromArray(position);

        this._geometry = group;
    }

    protected _disposeGeometry(): void {
        for (let mesh of <THREE.Mesh[]>this._geometry.children) {
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
    }

    protected _getInteractiveObjectIds(): string[] {
        return [];
    }
}

export default CircleMarker;