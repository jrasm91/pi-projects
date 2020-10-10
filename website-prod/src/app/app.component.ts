import { Component, OnInit } from '@angular/core';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { menu } from './menu';
import { APIService } from './api.service';

@Component({
	selector: 'pi-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	menu: NbMenuItem[] = menu;

	constructor(
		private iconLibraries: NbIconLibraries,
		private apiService: APIService,
	) {
		this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });
		this.iconLibraries.setDefaultPack('font-awesome');
	}

	public ngOnInit() {
		this.apiService.init();
	}
}
