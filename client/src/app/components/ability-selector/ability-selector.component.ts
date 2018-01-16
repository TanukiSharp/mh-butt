import { Component, OnInit } from '@angular/core';
import { InversearchService, IInverseAbility } from '../../services/inversearch.service';
import { LocalizationService } from '../../services/localization.service';

interface AbilityViewModel {
    isSelected: boolean;
    ability: IInverseAbility;
}

@Component({
    selector: 'app-ability-selector',
    templateUrl: './ability-selector.component.html',
    styleUrls: ['./ability-selector.component.css']
})
export class AbilitySelectorComponent implements OnInit {

    public abilities: AbilityViewModel[];

    public selectAbility(value: AbilityViewModel) {
        value.isSelected = !value.isSelected;
    }

    private _abilityFilter: string;
    private _abilityFilterProcessed: string;

    public get abilityFilter(): string {
        return this._abilityFilter;
    }

    public set abilityFilter(value: string) {
        console.log('abilityFilter: ' + value);
        this._abilityFilter = value;
        this._abilityFilterProcessed = value.toLowerCase().trim();
    }

    constructor(
        private inversearchService: InversearchService,
        private localizationService: LocalizationService
    ) {
    }

    public isAbilityVisible(ability: IInverseAbility): boolean {

        if (!this._abilityFilterProcessed || this._abilityFilterProcessed.length === 0) {
            return true;
        }

        let text: string|null = this.localizationService.getAbilityText(ability.id);

        if (!text) {
            return false;
        }

        return text.toLowerCase().indexOf(this._abilityFilterProcessed) >= 0;
    }

    async ngOnInit() {

        let abilities: IInverseAbility[]|null = await this.inversearchService.getAbilities();

        if (!abilities) {
            console.error('Failed get abilities');
            return;
        }

        this.abilities = abilities.map(x => <AbilityViewModel>{
            isSelected: false,
            ability: x
        });
    }
}
