/// <reference path="../../../typings/index.d.ts" />

import {IAPINavImIm, IGPano} from "../../../src/API";
import {PointGeometry, GeometryTagError} from "../../../src/Component";
import {Transform} from "../../../src/Geo";

describe("PointGeometry.ctor", () => {
    it("should be defined", () => {
        let pointGeometry: PointGeometry = new PointGeometry([0.5, 0.5]);

        expect(pointGeometry).toBeDefined();
    });

    it("point should be set", () => {
        let pointGeometry: PointGeometry = new PointGeometry([0.5, 0.5]);

        expect(pointGeometry.point[0]).toBe(0.5);
        expect(pointGeometry.point[1]).toBe(0.5);
    });

    it("should throw if basic coord is below supported range", () => {
        expect(() => { return new PointGeometry([-1, 0.5]); }).toThrowError(GeometryTagError);
        expect(() => { return new PointGeometry([0.5, -1]); }).toThrowError(GeometryTagError);
    });

    it("should throw if basic coord is above supported range", () => {
        expect(() => { return new PointGeometry([2, 0.5]); }).toThrowError(GeometryTagError);
        expect(() => { return new PointGeometry([0.5, 2]); }).toThrowError(GeometryTagError);
    });
});

describe("PointGeometry.setVertex2d", () => {
    let createTransform: (pano: boolean) => Transform = (pano: boolean): Transform => {
        let gpano: IGPano = pano ?
            {
                CroppedAreaImageHeightPixels: 1,
                CroppedAreaImageWidthPixels: 1,
                CroppedAreaLeftPixels: 0,
                CroppedAreaTopPixels: 0,
                FullPanoHeightPixels: 1,
                FullPanoWidthPixels: 1,
            } :
            null;

        let apiNavImIm: IAPINavImIm = { gpano: gpano, key: "", rotation: [0, 0, 0] };

        return new Transform(apiNavImIm, null, [0, 0, 0]);
    };

    it("should set point to value", () => {
        let original: number[] = [0, 0];
        let pointGeometry: PointGeometry = new PointGeometry(original);

        let point: number[] = [0.5, 0.5];
        let transform: Transform = createTransform(true);

        pointGeometry.setCentroid2d(point, transform);

        expect(pointGeometry.point[0]).toBe(point[0]);
        expect(pointGeometry.point[1]).toBe(point[1]);
    });

    it("should clamp negative input value to [0, 1] interval", () => {
        let original: number[] = [0.5, 0.5];
        let pointGeometry: PointGeometry = new PointGeometry(original);

        let point: number[] = [-1, -1];
        let transform: Transform = createTransform(true);

        pointGeometry.setCentroid2d(point, transform);

        expect(pointGeometry.point[0]).toBe(0);
        expect(pointGeometry.point[1]).toBe(0);
    });

    it("should clamp input value larger than 1 to [0, 1] interval", () => {
        let original: number[] = [0.5, 0.5];
        let pointGeometry: PointGeometry = new PointGeometry(original);

        let point: number[] = [2, 2];
        let transform: Transform = createTransform(true);

        pointGeometry.setCentroid2d(point, transform);

        expect(pointGeometry.point[0]).toBe(1);
        expect(pointGeometry.point[1]).toBe(1);
    });
});
