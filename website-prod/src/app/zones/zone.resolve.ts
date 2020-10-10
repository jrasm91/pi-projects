import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { APIService } from '../api.service';
import { Zone } from '../models';

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
