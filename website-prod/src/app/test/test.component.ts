import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';

interface Result {
	timestamp: Date;
	message: string;
	error: boolean;
	command: string;
}

@Component({
	selector: 'pi-test',
	templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

	results: Array<Result> = [];
	error = false;

	constructor(private apiService: APIService) { }

	public ngOnInit() { }

	public reset() {
		this.results = [];
	}

	public execute(name: string) {
		this.error = false;
		this.apiService.test(name)
			.subscribe(
				result => {
					console.info(result);
					this.results.unshift({
						command: name,
						timestamp: new Date(),
						message: result.toString(),
						error: false,
					});
				},
				error => {
					this.error = true;
					console.warn(error);
					this.results.unshift({
						command: name,
						timestamp: new Date(),
						message: `Error: ${error.error}`,
						error: true,
					});
				},
			);
	}
}
