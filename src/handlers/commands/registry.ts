import {ArgOptions} from "../../decorators/expects";

export const REGISTRY = new Map<string, Map<string, ArgOptions[]>>();
export function register(cls: string, property: string, decorator: ArgOptions) {
    let map: Map<string, ArgOptions[]>;

    if (REGISTRY.has(cls)) {
        map = REGISTRY.get(cls)!;
    } else {
        map = new Map<string, ArgOptions[]>();
        REGISTRY.set(cls, map);
    }

    let list: ArgOptions[];
    if (map.has(property)) {
        list = map.get(property)!;
    } else {
        list = [];
        map.set(property, list);
    }

    if (list.indexOf(decorator) < 0) {
        list.push(decorator);
    }
}
