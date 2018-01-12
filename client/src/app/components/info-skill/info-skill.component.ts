import { Component, OnInit, Input } from '@angular/core';
import { ArmorSet } from '../../models/armorSet';
import { DetailedScoredSkill } from '../../models/skill';

@Component({
    selector: 'app-info-skill',
    templateUrl: './info-skill.component.html',
    styleUrls: ['./info-skill.component.css']
})
export class InfoSkillComponent implements OnInit {

    private _armorSet: ArmorSet;

    public get armorSet(): ArmorSet {
        return this._armorSet;
    }

    @Input()
    public set armorSet(value: ArmorSet) {

        if (!value) {
            return;
        }

        this._armorSet = value;
        this.selectedSkill = this.armorSet.equippedSkills[0];
    }

    public selectedSkill: DetailedScoredSkill;

    constructor() {
    }

    ngOnInit() {
    }
}
