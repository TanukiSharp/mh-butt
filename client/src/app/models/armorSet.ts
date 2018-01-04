import { Equipment } from './equipment';
import { ScoredSkill } from './skill';

export class ArmorSet {

    public constructor(
        private _equipments: Equipment[],
        private _equippedSkills: ScoredSkill[]
    ) {
    }

    public get equipments(): Equipment[] {
        return this._equipments;
    }

    public get equippedSkills(): ScoredSkill[] {
        return this._equippedSkills;
    }
}
