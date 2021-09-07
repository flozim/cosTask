import { NumberSymbol } from "@angular/common";

export class AppImg {
    id: number;
    data: string;
    tags: string | string[];
    timestamp: string;

    constructor(data: string, tags: string) {
        this.data = data;
        this.tags = tags;
    }
}