import { Ability } from './ability';

export interface ISkillLocale {
    name: string;
    description: string;
}

export interface ISkillLevelData {
    level: number;
    abilityIds: number[];
}

export interface ISkillData {
    id: number;
    levels: ISkillLevelData[];
}

export interface IScores {
    weapon: number;
    helm: number;
    armor: number;
    gloves: number;
    tassets: number;
    leggings: number;
    talisman: number;
    total: number;
}

export class ScoredSkill {

    public constructor(
        private _score: number,
        private _skill: Skill
    ) {
    }

    public get score(): number {
        return this._score;
    }

    public get skill(): Skill {
        return this._skill;
    }

    public toString(): string {
        return `score: ${this.score}, skill: [${this.skill.toString()}]`;
    }
}

export class DetailedScoredSkill {

    public constructor(
        private _scores: IScores,
        private _skill: Skill
    ) {
    }

    public get scores(): IScores {
        return this._scores;
    }

    public get skill(): Skill {
        return this._skill;
    }

    public toString(): string {
        return `total score: ${this.scores.total}, skill: [${this.skill.toString()}]`;
    }
}

export class SkillLevel {
    public constructor(
        private _level: number,
        private _abilities: Ability[]
    ) {
    }

    public get level(): number {
        return this._level;
    }

    public get abilities(): Ability[] {
        return this._abilities;
    }
}

export class Skill {
    public constructor(
        private _id: number,
        private _name: string,
        private _description: string,
        private _levels: SkillLevel[]
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

    public get levels(): SkillLevel[] {
        return this._levels;
    }

    public findAbilitiesByLevel(level: number): Ability[]|null {

        for (let i: number = 0; i < this._levels.length; i += 1) {
            if (this._levels[i].level === level) {
                return this._levels[i].abilities;
            }
        }

        return null;
    }

    public findLowestLevel(): number {

        let lowestLevel: number = Number.MAX_SAFE_INTEGER;

        if (this._levels.length === 0) {
            return -1;
        }

        for (let i: number = 0; i < this._levels.length; i += 1) {
            if (this._levels[i].level < lowestLevel) {
                lowestLevel = this._levels[i].level;
            }
        }

        return lowestLevel;
    }

    public findHighestLevel(): number {

        let highestLevel: number = 0;

        if (this._levels.length === 0) {
            return -1;
        }

        for (let i: number = 0; i < this._levels.length; i += 1) {
            if (this._levels[i].level > highestLevel) {
                highestLevel = this._levels[i].level;
            }
        }

        return highestLevel;
    }

    public toString(): string {
        return `name: ${this.name}, levels: ${this.levels.length}`;
    }
}

export class ScoreUtils {
    public static createIScores(): IScores {
        let scores: IScores = {
            weapon: 0,
            helm: 0,
            armor: 0,
            gloves: 0,
            tassets: 0,
            leggings: 0,
            talisman: 0,
            total: 0
        };
        return scores;
    }

    public static incrementScore(scores: IScores, equipmentType: EquipmentType) {
        switch (equipmentType) {
            case EquipmentType.Weapon:
                scores.weapon += 1;
                break;
            case EquipmentType.Helm:
                scores.helm += 1;
                break;
            case EquipmentType.Armor:
                scores.armor += 1;
                break;
            case EquipmentType.Gloves:
                scores.gloves += 1;
                break;
            case EquipmentType.Tassets:
                scores.tassets += 1;
                break;
            case EquipmentType.Leggings:
                scores.leggings += 1;
                break;
            case EquipmentType.Talisman:
                scores.talisman += 1;
                break;
        }

        scores.total += 1;
    }
}
