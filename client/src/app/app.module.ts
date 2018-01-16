import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InfoSkillComponent } from './components/info-skill/info-skill.component';
import { SkillLevelsComponent } from './components/skill-levels/skill-levels.component';
import { DetailedScoredSkillComponent } from './components/detailed-scored-skill/detailed-scored-skill.component';
import { EquipmentPickerComponent } from './components/equipment-picker/equipment-picker.component';
import { AbilitySelectorComponent } from './components/ability-selector/ability-selector.component';

@NgModule({
    declarations: [
        AppComponent,
        InfoSkillComponent,
        SkillLevelsComponent,
        DetailedScoredSkillComponent,
        EquipmentPickerComponent,
        AbilitySelectorComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
