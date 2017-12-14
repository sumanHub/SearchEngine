import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  branch;
  allbranch;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.getallclubs().subscribe((branch) => {
      this.allbranch = branch;
    })
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((branch) => {
        this.branch =branch;
      })
    })
  }

  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.branch = this.branch;
    }
  }

  firequery(start, end) {
    return this.afs.collection('epl', ref => ref.limit(4).orderBy('branch').startAt(start).endAt(end)).valueChanges();
  }

  getallclubs() {
    return this.afs.collection('epl', ref => ref.orderBy('branch')).valueChanges();
  }


}
