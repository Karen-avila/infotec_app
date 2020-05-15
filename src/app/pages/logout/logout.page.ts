import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@services/user/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(route: ActivatedRoute, private authenticationService: AuthenticationService, private router: Router) {
    route.params.subscribe(val => {
      if (this.authenticationService.isAuthenticated()) {
        this.authenticationService.logout();
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit() {

  }
}
