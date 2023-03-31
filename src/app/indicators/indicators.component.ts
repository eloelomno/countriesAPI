import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { IndicatorTopicDetailsDialog } from './indicators-topic-details-dialog/indicator-topic-details-dialog.component';

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
  baseUrl = 'https://api.worldbank.org/v2/';
  currentPage = 0;
  pageSize = 0;
  itemCount = 0;
  topics: any = [];
  topicFilter = '';
  topicName = '';
  topicSourceNote = '';
  color = '#007eff29';
  fontSize = "1.2em";

  onPaginateChange(event?:PageEvent) {
    let url = '';
    if (this.topicFilter) {
      url = `${this.baseUrl}topic/${this.topicFilter}/indicator?page=${event ? event.pageIndex + 1 : this.currentPage+1}&format=json`;
    } else {
      url = `${this.baseUrl}indicator?page=${event ? event.pageIndex + 1 : this.currentPage+1}&format=json`;
    }
    
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
        filter: this.topicFilter,
        sourceName: this.topicName,
        sourceNote: this.topicSourceNote
      },
    });
  }
  
  onTopicChange(element: any) {
    let url = `${this.baseUrl}topic/${element.value.id}/indicator?format=json`;
    this.http.get<any>(url).subscribe(
      (result) => {
        this.topicFilter = element.value.id;
        this.topicName = element.value.value;
        this.topicSourceNote = element.value.sourceNote;
        this.itemCount = result[0].total;
        this.currentPage = result[0].page - 1;
        this.indicators = result[1];
        this.dataSource = new MatTableDataSource<any>(result[1]);
      }
    );
  }

  getAllTopics() {
    let url = `${this.baseUrl}topic?format=json`;
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
