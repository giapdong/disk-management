import { TypeNodeHierachy } from '../interface';

export default class Hierachy {
	parent: Hierachy | null;
	name: string;
	storage: number;
	fsize: number;
	type: TypeNodeHierachy;
	child: Array<Hierachy>;

	constructor(parent: Hierachy | null, name: string, storage: number, type: TypeNodeHierachy) {
		this.parent = parent;
		this.name = name;
		this.storage = storage;
		if (type == TypeNodeHierachy.File) {
			this.fsize = storage;
		} else {
			this.fsize = 0;
		}

		this.type = type;
		this.child = [];
	}

	addStorage(value: number, increaseFile: boolean = false) {
		this.storage += value;
		if (increaseFile) {
			this.fsize += value;
		}

		if (this.parent) this.parent.addStorage(value);
	}
}
