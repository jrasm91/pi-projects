import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { filter, finalize, map, mergeMap } from 'rxjs/operators';
import { Zone } from '../../../../../common';
import { APIService } from '../../api.service';
import { EditZoneModalComponent } from '../../modals/edit-zone-modal/edit-zone-modal.component';

@Component({
	selector: 'pi-zone-detail',
	templateUrl: './zone-detail.component.html',
})
export class ZoneDetailComponent implements OnInit {
	zone: Zone;
	deleteLoading = false;
	updateLoading = false;

	constructor(
		private route: ActivatedRoute,
		private apiService: APIService,
		private notificationService: NbToastrService,
		private modalService: NbDialogService,
		private router: Router,
	) { }

	public ngOnInit() {
		this.zone = this.route.snapshot.data.zone;
	}

	public delete() {
		this.deleteLoading = true;
		this.apiService.deleteZone(this.zone)
			.pipe(finalize(() => this.deleteLoading = false))
			.subscribe(
				() => {
					this.notificationService.warning(`Zone Id: ${this.zone.id}`, `Deleted ${this.zone.name}`, { icon: 'trash-alt' });
					this.router.navigate(['zones']);
				},
				error => this.notificationService.danger(error.error, 'Something went wrong'),
			);
	}

	public edit(errorMessage?: string) {
		this.modalService.open(EditZoneModalComponent, {
			context: {
				zone: this.zone,
				errorMessage,
			},
		}).onClose
			.pipe(
				filter(zone => !!zone),
				mergeMap((zone: Zone) => {
					this.updateLoading = true;
					Object.assign(this.zone, zone);
					return this.apiService.saveZone(zone)
						.pipe(
							finalize(() => this.updateLoading = false),
							map(() => zone),
						);
				}),
			)
			.subscribe(
				zone => this.notificationService.info(`Zone Id: ${zone.id}`, `Updated ${zone.name}`),
				error => this.edit(error.error),
			);
	}
}
