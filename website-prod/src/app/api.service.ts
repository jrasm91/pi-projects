import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Zone } from './models';

interface SensorResponse {
	temperature: number;
	date: Date;
}

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

	public getPoolTemp() {
		return this.http.get<SensorResponse>('/api/sensors/live/pool')
			.pipe(tap(response => response.date = new Date(response.date)));
	}

	public getPoolHistory() {
		return this.http.get<[number, Date][]>('/api/sensors/history/pool')
			.pipe(tap(results => {
				results.forEach(result => {
					result[1] = new Date(result[1]);
				});
			}));
	}

	public getAirTemp() {
		return this.http.get<SensorResponse>('/api/sensors/live/air')
			.pipe(tap(response => response.date = new Date(response.date)));

	}

	public getAirHistory() {
		return this.http.get<[number, Date][]>('/api/sensors/history/air')
			.pipe(tap(results => {
				results.forEach(result => {
					result[1] = new Date(result[1]);
				});
			}));
	}

	public test(name: string) {
		return this.http.get(`/api/command/${name}`, { responseType: 'text' });
	}
}
