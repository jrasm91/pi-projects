import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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

	constructor(
		private api: APIService,
	) { }

	public ngOnInit() {
		this.refresh();
	}

	public refresh() {
		this.tempLoading = true;
		this.api.getPoolTemp()
			.pipe(finalize(() => this.tempLoading = false))
			.subscribe(response => {
				this.poolTemp = response.temperature;
				this.lastUpdated = response.date;
			});
	}

	isLoading = false;
	options = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['X-1']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: 'X-1',
				type: 'line',
				stack: 'counts',
				label: {
					normal: {
						show: true,
						position: 'top'
					}
				},
				areaStyle: { normal: {} },
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};

}
