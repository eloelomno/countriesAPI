import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.css']
})
export class IndicatorsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }
  
  indicators = [];
  displayedColumns: string[] = ['name', 'source', 'sourceNote'];
  dataSource = new MatTableDataSource<any>(this.indicators);
  indicatorUrl = 'https://api.worldbank.org/v2/indicator';
  topicUrl = 'https://api.worldbank.org/v2/topic';
  indicatorByTopicUrl = "http://api.worldbank.org/v2/indicator?topic=";
  currentPage = 0;
  pageSize = 0;
  itemCount = 0;
  topics: any = [];
  topicFilter = '';
  color = '#007eff29';
  fontSize = "1.2em";

  onPaginateChange(event?:PageEvent) {
    let url = `${this.indicatorUrl}?page=${event ? event.pageIndex + 1 : this.currentPage+1}&format=json`;
    this.http.get<any>(url).subscribe(
      (result) => {
        this.itemCount = result[0].total;
        this.currentPage = result[0].page - 1;
        this.indicators = result[1];
        this.dataSource = new MatTableDataSource<any>(this.indicators);
      }
    );
  }


  onTopicDetailsClicked() {
    this.dialog.open(IndicatorTopicDetailsDialog, {
      data: {
        element: this.topicFilter
      },
    });
  }
  
  onTopicChange(element: any) {
    let url = `${this.indicatorByTopicUrl}${element.value}&format=json`;
    this.http.get<any>(url).subscribe(
      (result) => {
        this.topicFilter = element.value;
        this.itemCount = result[0].total;
        console.log(this.itemCount = result[0].total);
        this.currentPage = result[0].page - 1;
        this.indicators = result[1];
        this.dataSource = new MatTableDataSource<any>(result[1]);
      }
    );
  }

  getAllTopics() {
    let url = `${this.topicUrl}?format=json`;
    this.http.get<any>(url).subscribe(
      (result) => {
        this.topics = result[1];
      }
    );
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.onPaginateChange();
    this.getAllTopics();
  }

}

@Component({
  selector: 'indicator-topic-details-dialog',
  templateUrl: 'indicator-topic-details-dialog.html',
  styleUrls: ['indicator-topic-details-dialog.component.css']
})
export class IndicatorTopicDetailsDialog implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

  topicName = '';
  url = `http://api.worldbank.org/v2/topic/${this.data.element}?format=json`;
  topics: any = [];
  topicDetails = '';
  
  getTopicDetails() {
    this.http.get<any>(this.url).subscribe(
      (result) => {
        this.topics = result[1];
        this.topicName = result[1][0].value;
      }
    );
  }
  
  ngOnInit() {
    this.getTopicDetails();
  }
}
