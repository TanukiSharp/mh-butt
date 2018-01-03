import { ISkillData, Skill } from "./skill";

export enum EquipmentType {
    None = 0,
    Weapon = 1,
    Neckless = 2,
    Survival = 3,
    Helm = 4,
    Chest = 5,
    Glove = 6,
    Belt = 7,
    Legging = 8
}

export interface IEquipmentLocale {
    name: string;
    description: string;
}

export interface IEquipmentData {
    id: number;
    rarity: number;
    type: EquipmentType;
    skills: number[];
}

export class Equipement {
    public constructor(
        private _rarity: number,
        private _type: EquipmentType,
        private _skills: Skill[]
    ) {
    }

    public get rarity(): number {
        return this._rarity;
    }

    public get type(): EquipmentType {
        return this._type;
    }

    public get skills(): Skill[] {
        return this._skills;
    }
}
