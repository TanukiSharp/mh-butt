import { Equipment } from './equipment';
import { DetailedScoredSkill } from './skill';

export class ArmorSet {

    public constructor(
        private _equipments: Equipment[],
        private _equippedSkills: DetailedScoredSkill[]
    ) {
    }

    public get equipments(): Equipment[] {
        return this._equipments;
    }

    public get equippedSkills(): DetailedScoredSkill[] {
        return this._equippedSkills;
    }
}
