import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Zone } from '../../../../../common';
import { APIService } from '../../api.service';

@Component({
	selector: 'pi-zone-create',
	templateUrl: './zone-create.component.html',
})
export class ZoneCreateComponent implements OnInit, OnDestroy {
	private unsubscribe$ = new Subject();

	formGroup: FormGroup;
	loading = false;

	constructor(
		private fb: FormBuilder,
		private apiService: APIService,
		private notificationService: NbToastrService,
		private router: Router,
	) { }

	public ngOnInit() {
		this.formGroup = this.fb.group({
			id: ['', [Validators.required, Validators.minLength(1)]],
			name: ['', [Validators.required, Validators.minLength(1)]],
		});

		this.apiService.zones$
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(zones => {
				this.formGroup.controls.id.setValue((zones.length + 1).toString());
			});
	}

	public ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	public add() {
		if (!this.formGroup.valid) {
			return;
		}

		this.loading = true;
		const _zone = this.getZone();
		this.apiService.addZone(_zone)
			.pipe(finalize(() => this.loading = false))
			.subscribe(
				() => {
					this.notificationService.success(`Zone Id: ${_zone.id}`, `Added ${_zone.name}`, { icon: 'check' });
					this.router.navigate(['zones']);
				},
				(error) => this.notificationService.danger(error.error, 'Something went wrong'),
			);
	}

	private getZone(): Zone {
		return {
			name: this.formGroup.controls.name.value,
			id: this.formGroup.controls.id.value,
			running: false,
		};
	}
}
