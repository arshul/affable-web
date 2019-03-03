import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'influencer-data',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class InfluencerData implements OnInit {
  title = 'Affable Frontend Engineer Task';
  influencers: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            allInfluencers(first:10 orderBy:followerCount_ASC){
              id
              username
              followerCount
              picture
              biography
              fullName
            }

            }
        `,
      })
      .valueChanges.subscribe(result => {
       
          this.influencers = result.data && (result.data as any).allInfluencers;
          this.loading = result.loading;
          this.error = (result as any).error;
        
      });
  }
  abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}
}