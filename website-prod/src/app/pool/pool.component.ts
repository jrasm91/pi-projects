import { Component, OnInit } from '@angular/core';
import { combineLatest, timer } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { APIService } from '../api.service';

@Component({
	selector: 'pi-pool',
	templateUrl: './pool.component.html',
})
export class PoolComponent implements OnInit {

	poolTemp: number;
	poolHistory: any[] = [];

	lastUpdated: Date;
	tempLoading = false;
	historyLoading = false;

	constructor(
		private api: APIService,
	) { }

	public ngOnInit() {
		this.refreshTemp();
		this.refreshHistory();
	}

	public refreshTemp() {
		this.tempLoading = true;
		combineLatest([timer(500), this.api.getPoolTemp()])
			.pipe(
				map(([_, response]) => response),
				finalize(() => this.tempLoading = false),
			)
			.subscribe(response => {
				this.poolTemp = response.temperature;
				this.lastUpdated = response.date;
			});
	}

	public refreshHistory() {
		this.historyLoading = true;
		combineLatest([timer(500), this.api.getPoolHistory()])
			.pipe(
				map(([_, response]) => response),
				finalize(() => this.historyLoading = false),
			)
			.subscribe(response => {
				this.poolHistory = response;
				this.updateOptions = {
					series: [
						{
							data: response.map(([temperature, dateString]) => {
								const date = new Date(dateString);
								return {
									name: date.toDateString(),
									value: [date.toISOString(), temperature],
								};
							}),
						},
						{
							data: response.map(([temperature, dateString]) => {
								const date = new Date(dateString);
								return {
									name: date.toDateString(),
									value: [date.toISOString(), temperature - 10],
								};
							}),
						}],
				};
			});
	}

	isLoading = false;
	updateOptions: any;
	options = {
		legend: {
			data: ['Sensor 1', 'Sensor 2'],
			align: 'left',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { animation: false },
		},
		xAxis: {
			type: 'time',
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%'],
		},
		series: [
			{
				name: 'sensor1',
				type: 'line',
				showSymbol: false,
				data: [],
				animationDelay: (idx) => idx * 10,
			},
			{
				name: 'sensor2',
				type: 'line',
				showSymbol: false,
				data: [],
				animationDelay: (idx) => idx * 10,
			},
		],
		animationEasing: 'elasticOut',
		animationDelayUpdate: (idx) => idx * 5,
	};
}
