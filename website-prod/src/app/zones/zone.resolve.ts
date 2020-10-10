import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Zone } from '../../../../common';
import { APIService } from '../api.service';

@Injectable()
export class ZoneResolve implements Resolve<Zone> {
	constructor(
		private apiService: APIService,
	) { }

	resolve(route: ActivatedRouteSnapshot) {
		const id = route.paramMap.get('id');
		return this.apiService.getZoneById(id);
	}
}
