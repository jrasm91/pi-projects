import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { APIService } from '../../api.service';
import { Zone } from '../../models';

@Component({
	selector: 'pi-zones',
	templateUrl: './zones.component.html',
})
export class ZonesComponent implements OnInit, OnDestroy {
	private unsubscribe$ = new Subject();

	zones: Zone[];

	constructor(private apiService: APIService) { }

	public ngOnInit() {
		this.apiService.zones$
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(zones => this.zones = zones);
	}

	public ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

}
