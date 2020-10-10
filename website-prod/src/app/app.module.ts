import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NbDialogModule, NbMenuModule, NbSidebarModule, NbToastrModule } from '@nebular/theme';
import { AppComponent } from './app.component';
import { ToggleReadonlyComponent } from './components/toggle-readonly/toggle-readonly.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { EditZoneModalComponent } from './modals/edit-zone-modal/edit-zone-modal.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TestComponent } from './test/test.component';
import { ThemeModule } from './theme/theme.module';
import { TroubleshootComponent } from './troubleshoot/troubleshoot.component';
import { WeatherComponent } from './weather/weather.component';
import { ZoneCardComponent } from './zones/zone-card/zone-card.component';
import { ZoneCreateComponent } from './zones/zone-create/zone-create.component';
import { ZoneDetailComponent } from './zones/zone-detail/zone-detail.component';
import { ZoneResolve } from './zones/zone.resolve';
import { ZonesComponent } from './zones/zones/zones.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent,
	},
	{
		path: 'zones/:id/details',
		component: ZoneDetailComponent,
		resolve: { zone: ZoneResolve },
	},
	{
		path: 'zones',
		component: ZonesComponent,
		children: [
			{
				path: 'new',
				component: ZoneCreateComponent,
			},
		],
	},
	{
		path: 'schedule',
		component: ScheduleComponent,
	},
	{
		path: 'weather',
		component: WeatherComponent,
	},
	{
		path: 'troubleshoot',
		component: TroubleshootComponent,
	},
	{
		path: 'test',
		component: TestComponent,
	},
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

const config: ExtraOptions = {
	useHash: false,
	onSameUrlNavigation: 'reload',
};

const components = [
	AppComponent,
	ToggleReadonlyComponent,
	DashboardComponent,
	HeaderComponent,
	ZonesComponent,
	ZoneDetailComponent,
	ZoneCardComponent,
	ZoneCreateComponent,
	TroubleshootComponent,
	WeatherComponent,
	ScheduleComponent,
	TestComponent,
];

const modals = [
	EditZoneModalComponent,
];

@NgModule({
	declarations: [...components, ...modals],
	imports: [
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule.forRoot(routes, config),
		ThemeModule.forRoot(),

		NbSidebarModule.forRoot(),
		NbMenuModule.forRoot(),
		NbToastrModule.forRoot({ duration: 10000 }),
		NbDialogModule.forRoot(),
	],
	providers: [ZoneResolve],
	entryComponents: [...modals],
	bootstrap: [AppComponent],
})
export class AppModule { }
