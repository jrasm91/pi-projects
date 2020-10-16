import { Component, OnInit } from '@angular/core';
import { APIService, CookingSensor } from '../api.service';

@Component({
	selector: 'pi-sous-vide',
	templateUrl: './sous-vide.component.html',
})
export class SousVideComponent implements OnInit {

	sensors: CookingSensor[] = [];

	constructor(private api: APIService) { }

	ngOnInit() {
		this.api.getSousVides().subscribe(response => {
			this.sensors = response;
		});
	}
}
