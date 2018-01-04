import { Skill, ScoredSkill } from './skill';

export enum EquipmentType {
    None = 0,
    Weapon = 1,
    Neckless = 2,
    Survival = 3,
    Helm = 4,
    Armor = 5,
    Gloves = 6,
    Tassets = 7,
    Leggings = 8
}

export interface IEquipmentLocale {
    name: string;
    description: string;
}

export interface IEquipmentSkillData {
    id: number;
    score: number;
}

export interface IEquipmentData {
    id: number;
    rarity: number;
    type: EquipmentType;
    skills: IEquipmentSkillData[];
}

export class Equipment {
    public constructor(
        private _id: number,
        private _name: string,
        private _description: string,
        private _rarity: number,
        private _type: EquipmentType,
        private _skills: ScoredSkill[]
    ) {
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get rarity(): number {
        return this._rarity;
    }

    public get type(): EquipmentType {
        return this._type;
    }

    public get skills(): ScoredSkill[] {
        return this._skills;
    }

    public findSkillById(skillId: number): ScoredSkill|null {

        for (let i: number = 0; i < this._skills.length; i += 1) {
            if (this._skills[i].skill.id === skillId) {
                return this._skills[i];
            }
        }

        return null;
    }
}
