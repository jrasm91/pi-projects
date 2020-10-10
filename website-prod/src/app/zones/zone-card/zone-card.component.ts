import { Component, Input, OnInit } from '@angular/core';
import { Zone } from '../../models';

@Component({
	selector: 'pi-zone-card',
	templateUrl: './zone-card.component.html',
})
export class ZoneCardComponent implements OnInit {
	@Input() zone: Zone;

	constructor() { }

	ngOnInit() {
	}

}
