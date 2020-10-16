import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Zone } from './models';

interface SensorResponse {
	temperature: number;
	date: Date;
}

export interface CookingSensor {
	timestamps: {
		heating: Date;
		off: Date;
		warming: Date;
		ready: Date;
		cooking: Date;
		cooling: Date;
	};
	state: string;
	heating: boolean;
	temperature: number;
	lastUpdated: Date;
	settings: {
		duration: number;
		temperature: number;
		minTemperature: number;
	};
	history: [];
	_intervalId: null;
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
		return this.http.get<SensorResponse>('/api/pool/temperature')
			.pipe(tap(response => response.date = new Date(response.date)));
	}

	public getPoolHistory() {
		return this.http.get<[number, Date][]>('/api/pool/history')
			.pipe(tap(results => {
				results.forEach(result => {
					result[1] = new Date(result[1]);
				});
			}));
	}

	public getAirTemp() {
		return this.http.get<SensorResponse>('/api/air/temperature')
			.pipe(tap(response => response.date = new Date(response.date)));

	}

	public getAirHistory() {
		return this.http.get<[number, Date][]>('/api/air/history')
			.pipe(tap(results => {
				results.forEach(result => {
					result[1] = new Date(result[1]);
				});
			}));
	}

	public getSousVides() {
		return this.http.get<Array<CookingSensor>>('/api/sous-vide/sensors');
	}

	public test(name: string) {
		return this.http.get(`/api/command/${name}`, { responseType: 'text' });
	}
}
