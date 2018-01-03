import { IAbilityData } from "./ability";

export interface ISkillLocale {
    name: string;
    description: string;
}

export interface ISkillData {
    id: number;
    abilities: IAbilityData[];
}

export class Skill {
    public constructor(
        private _name: string,
        private _description: string,
        private _abilities: string[]
    ) {
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get abilities(): string[] {
        return this._abilities;
    }
}
