export class Ability {
    public constructor(
        private _id: number,
        private _title: string
    ) {
    }

    public get id(): number {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }
}
