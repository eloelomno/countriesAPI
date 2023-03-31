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