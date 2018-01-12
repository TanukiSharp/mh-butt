import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InfoSkillComponent } from './components/info-skill/info-skill.component';
import { SkillLevelsComponent } from './components/skill-levels/skill-levels.component';
import { DetailedScoredSkillComponent } from './components/detailed-scored-skill/detailed-scored-skill.component';

@NgModule({
    declarations: [
        AppComponent,
        InfoSkillComponent,
        SkillLevelsComponent,
        DetailedScoredSkillComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
