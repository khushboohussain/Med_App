import { Injectable, NgZone } from '@angular/core';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public company: {
    latitude: number
    longitude: number
  };
  addressAutocompleteItems: any;
  addressAutocomplete: any;
  latitude;
  longitude;

  geo: any;
  service = new google.maps.places.AutocompleteService();

  constructor(private ngzone: NgZone) { }

  addressChooseItem(item: any) {
    // this.modalCtrl.dismiss(item);
    this.geo = item;
    this.addressGeoCode(this.geo); // convert Address to lat and long
  }

  // convert Address string to lat and long
addressGeoCode(address: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (results.length > 0) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        this.company = {
          latitude: this.latitude,
          longitude: this.longitude
        };
      }

      // console.log('pickup : ', this.company);
    });
  }

  addressUpdateSearch() {
    if (this.addressAutocomplete.query === '') {
      this.addressAutocompleteItems = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({
      input: this.addressAutocomplete.query,
      componentRestrictions: {
        country: 'de'
      }
    }, (predictions, status) => {
      me.addressAutocompleteItems = [];

      me.ngzone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.addressAutocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

}
