import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Zone } from '../../../../../common';

@Component({
	selector: 'pi-edit-zone-modal',
	templateUrl: './edit-zone-modal.component.html',
})
export class EditZoneModalComponent implements OnInit {
	@Input() zone: Zone;
	@Input() errorMessage: string;

	formGroup: FormGroup;

	constructor(
		private fb: FormBuilder,
		private ref: NbDialogRef<EditZoneModalComponent>,
	) { }

	public ngOnInit() {
		this.formGroup = this.fb.group({
			id: { value: this.zone.id, disabled: true },
			name: [this.zone.name, [Validators.required, Validators.minLength(1)]],
		});
	}

	public save() {
		if (!this.formGroup.valid) {
			return;
		}

		this.ref.close(this.getZone());
	}

	public cancel() {
		this.ref.close();
	}

	private getZone(): Zone {
		return {
			name: this.formGroup.controls.name.value,
			id: this.formGroup.controls.id.value,
		};
	}
}
