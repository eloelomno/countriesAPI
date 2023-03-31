import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as Leaflet from 'leaflet';

@Component({
    selector: 'location-dialog',
    templateUrl: 'location-dialog.html',
    styleUrls: ['location-dialog.component.css']
  })
  export class MapLocationDialog implements OnInit {
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}
  
    countryName = this.data.element.name;
    lat = this.data.element.latitude;
    lng = this.data.element.longitude;
    options = {
      layers: getLayers(),
      zoom: 10,
      center: new Leaflet.LatLng(this.lat, this.lng)
    };
    
    ngOnInit() {
    }
}

export const getLayers = (): Leaflet.Layer[] => {
    return [
        new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
        } as Leaflet.TileLayerOptions),
    ] as Leaflet.Layer[];
};