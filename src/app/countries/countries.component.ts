import { Component, ViewChild, Inject, OnInit, Input, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as Leaflet from 'leaflet';

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
  countriesUrl = 'https://api.worldbank.org/v2/country';
  currentPage = 0;
  pageSize = 0;
  itemCount = 0;

  onPaginateChange(event?:PageEvent) {
    let url = `${this.countriesUrl}?page=${event ? event.pageIndex + 1 : this.currentPage+1}&format=json`;
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

@Component({
  selector: 'location-dialog',
  templateUrl: 'location-dialog.html',
  styleUrls: ['location-dialog.component.css']
})
export class MapLocationDialog implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

  countryName = this.data.element.name;
  url = `http://api.worldbank.org/v2/country/${this.data.element.iso2Code}?format=json`;
  lat = this.data.element.latitude;
  lng = this.data.element.longitude;
  options = {
    layers: getLayers(),
    zoom: 10,
    center: new Leaflet.LatLng(this.lat, this.lng)
  };
  
  getLocationInfo() {
    this.http.get<any>(this.url).subscribe(
      (result) => {
        this.lat = result[1][0].latitude;
        this.lng = result[1][0].longitude;
      }
    );
  }
  
  ngOnInit() {
    this.getLocationInfo();
  }
}

export const getLayers = (): Leaflet.Layer[] => {
  return [
    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    } as Leaflet.TileLayerOptions),
  ] as Leaflet.Layer[];
};


