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

}
