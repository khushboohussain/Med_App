import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.page.html',
  styleUrls: ['./qualification.page.scss'],
})
export class QualificationPage implements OnInit {

  qualification = [];
  newQualification = '';

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getPersonalQualification()
      .subscribe((res: any) => {
        this.qualification = res.data;
        console.log(this.qualification);
      });
  }

  moveUp(index) {
    [this.qualification[index - 1], this.qualification[index]] = [this.qualification[index], this.qualification[index - 1]];
  }

  moveDown(index) {
    [this.qualification[index + 1], this.qualification[index]] = [this.qualification[index], this.qualification[index + 1]];
  }

  delete(index) {
    this.qualification.splice(index, 1);
  }

  addQualification() {

    if (this.newQualification !== '') {
      this.qualification.push(this.capitalizeFirstLetter(this.newQualification));
      this.api.updatePersonalQualification({ data: this.qualification })
        .then(done => {
          this.newQualification = '';
        });
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }



  update() {
    this.api.updatePersonalQualification({ data: this.qualification })
      .then(done => {
        this.newQualification = '';
      });
  }

}
