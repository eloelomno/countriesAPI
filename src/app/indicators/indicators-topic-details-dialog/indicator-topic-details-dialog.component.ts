import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'indicator-topic-details-dialog',
    templateUrl: 'indicator-topic-details-dialog.html',
    styleUrls: ['indicator-topic-details-dialog.component.css']
    })
    export class IndicatorTopicDetailsDialog implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

    topicName = this.data.sourceName;
    topicDetails = this.data.sourceNote;

    ngOnInit() {
    }
}