import { Component, OnInit, Input } from '@angular/core';
import { DetailedScoredSkill } from '../../models/skill';

@Component({
    selector: 'app-detailed-scored-skill',
    templateUrl: './detailed-scored-skill.component.html',
    styleUrls: ['./detailed-scored-skill.component.css']
})
export class DetailedScoredSkillComponent implements OnInit {

    @Input()
    public detailedScoredSkill: DetailedScoredSkill;

    constructor() { }

    ngOnInit() {
    }
}
