import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ISkillData } from '../../models/skill';

@Injectable()
export class DataService implements OnInit {

    async ngOnInit() {
        await this.loadSkills();
        console.log('DataService is initialized');
    }

    constructor(
        private http: Http,
    ) {
    }

    private async loadSkills() {
        let skillData: ISkillData[];
        let response: Response = await this.http.get('../assets/skills.json').toPromise();

        try {
            skillData = response.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
