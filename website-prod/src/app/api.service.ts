import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Zone } from '../../../common';

@Injectable({ providedIn: 'root' })
export class APIService {
	private _zones = new BehaviorSubject<Zone[]>([]);

	public get zones$(): Observable<Zone[]> {
		return this._zones.asObservable();
	}

	constructor(private http: HttpClient) { }

	public init() {
		this.loadZones();
	}

	public loadZones() {
		this.getZones().subscribe(zones => this._zones.next(zones));
	}

	public getZones() {
		return this.http.get<Zone[]>('api/zones');
	}

	public getZoneById(id: string): Observable<Zone> {
		return this.http.get<Zone>(`api/zones/${id}`);
	}

	public addZone(zone: Zone) {
		return this.http.post<Zone>(`api/zones`, zone)
			.pipe(tap(() => this.loadZones()));
	}

	public saveZone(zone: Zone) {
		return this.http.put<Zone>(`api/zones/${zone.id}`, zone)
			.pipe(tap(() => this.loadZones()));
	}

	public deleteZone(zone: Zone) {
		return this.http.delete(`/api/zones/${zone.id}`)
			.pipe(tap(() => this.loadZones()));
	}

	public test(name: string) {
		return this.http.get(`/api/command/${name}`, { responseType: 'text' });
	}
}
