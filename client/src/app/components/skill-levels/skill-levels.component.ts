import { Component, OnInit, Input } from '@angular/core';
import { DetailedScoredSkill } from '../../models/skill';

@Component({
    selector: 'app-skill-levels',
    templateUrl: './skill-levels.component.html',
    styleUrls: ['./skill-levels.component.css']
})
export class SkillLevelsComponent implements OnInit {

    @Input()
    public detailedScoredSkill: DetailedScoredSkill;

    constructor() {
    }

    public pointsToText(points: number): string {
        if (points <= 0) {
            return '';
        }
        return points.toString();
    }

    public pointsToEquipmentIcon(what: string, points: number): string {
        return '../../../assets/images/' + what + '_' + (points <= 0 ? 'gray' : 'yellow') + '.png';
    }

    public pointsToBottomHighlight(points: number) {
        if (points <= 0) {
            return 'bottom-bg';
        }
        return 'bottom-bg-highlight';
    }

    ngOnInit() {
    }
}
