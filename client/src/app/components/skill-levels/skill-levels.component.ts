import { Component, OnInit, Input } from '@angular/core';
import { Skill, ScoredSkill } from '../../models/skill';

@Component({
    selector: 'app-skill-levels',
    templateUrl: './skill-levels.component.html',
    styleUrls: ['./skill-levels.component.css']
})
export class SkillLevelsComponent implements OnInit {

    @Input()
    public scoredSkill: ScoredSkill;

    constructor() {
    }

    ngOnInit() {
    }
}
