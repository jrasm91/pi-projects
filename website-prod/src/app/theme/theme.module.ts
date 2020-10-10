import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	NbAlertModule,
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbListModule,
	NbMenuModule,
	NbSelectModule,
	NbSidebarModule,
	NbSpinnerModule,
	NbThemeModule,
	NbToggleModule,
	NbTooltipModule,
} from '@nebular/theme';
import { CORPORATE_THEME } from './theme.corporate';
import { COSMIC_THEME } from './theme.cosmic';
import { DARK_THEME } from './theme.dark';
import { DEFAULT_THEME } from './theme.default';

const NB_MODULES = [
	NbCardModule,
	NbLayoutModule,
	NbMenuModule,
	NbSidebarModule,
	NbSpinnerModule,
	NbButtonModule,
	NbSelectModule,
	NbListModule,
	NbIconModule,
	NbCheckboxModule,
	NbTooltipModule,
	NbToggleModule,
	NbAlertModule,

	// NbDatepickerModule,
	// NbUserModule,
	// NbActionsModule,
	NbInputModule,
	// NbRadioModule,
	// NbStepperModule,
	// NbAccordionModule,
];

@NgModule({
	imports: [CommonModule, RouterModule, ...NB_MODULES],
	exports: [CommonModule, ...NB_MODULES],
	declarations: [],
})
export class ThemeModule {
	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: ThemeModule,
			providers: [
				...NbThemeModule.forRoot({ name: DARK_THEME.name },
					[DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
				).providers,
			],
		};
	}
}
