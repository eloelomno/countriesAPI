import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MapLocationDialog } from './location-dialog/location-dialog.component';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }
  
  countries = [];
  displayedColumns: string[] = ['name', 'iso2Code', 'location'];
  dataSource = new MatTableDataSource<any>(this.countries);
  baseUrl = 'https://api.worldbank.org/v2/country';
  currentPage = 0;
  pageSize = 0;
  itemCount = 0;
  color = '#007eff29';
  fontSize = "1.2em";

  onPaginateChange(event?:PageEvent) {
    let url = `${this.baseUrl}?page=${event ? event.pageIndex + 1 : this.currentPage+1}&format=json`;
    this.http.get<any>(url).subscribe(
      (result) => {
        this.itemCount = result[0].total;
        this.currentPage = result[0].page - 1;
        this.countries = result[1];
        this.dataSource = new MatTableDataSource<any>(this.countries);
      }
    );
  }

  onLocationClicked(element: any) {
    this.dialog.open(MapLocationDialog, {
      data: {
        element: element
      },
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.onPaginateChange();
  }
  
}


