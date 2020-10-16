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

	lastUpdated: Date;
	tempLoading = false;
	historyLoading = false;

	isLoading = false;
	updateOptions: any;
	options = {
		// title: {
		// 	text: 'Pool History',
		// 	textAlign: 'middle',
		// 	textStyle: {
		// 		fontWeight: 'bold',
		// 		fontSize: 36,
		// 		fontFamily: 'Open Sans, sans-serif',
		// 	},
		// 	top: 25,
		// 	left: '50%',
		// },
		legend: {
			data: ['Pool Temperature', 'Air Temperature'],
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
				name: 'pool-temp',
				type: 'line',
				showSymbol: false,
				data: [],
				animationDelay: (idx) => idx * 10,
			},
			{
				name: 'air-temp',
				type: 'line',
				showSymbol: false,
				data: [],
				animationDelay: (idx) => idx * 10,
			},
		],
		animationEasing: 'elasticOut',
		animationDelayUpdate: (idx) => idx * 5,
	};

	constructor(private api: APIService) { }

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
		combineLatest([this.api.getPoolHistory(), this.api.getAirHistory(), timer(500)])
			.pipe(finalize(() => this.historyLoading = false))
			.subscribe(([poolHistory, airHistory]) => {
				this.updateOptions = {
					series: [
						{ data: poolHistory.map(([temp, date]) => this.toTimeItem(temp, date)) },
						{ data: airHistory.map(([temp, date]) => this.toTimeItem(temp, date)) },
					],
				};
			});
	}

	private toTimeItem(temperature, dateString) {
		const date = new Date(dateString);
		return {
			name: date.toDateString(),
			value: [date.toISOString(), temperature],
		};
	}
}
