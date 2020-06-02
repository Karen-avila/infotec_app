import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@services/user/authentication.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(route: ActivatedRoute, private authenticationService: AuthenticationService, private router: Router, private menu: MenuController) {
    route.params.subscribe(val => {
      if (this.authenticationService.isAuthenticated()) {
        this.authenticationService.logout();
        this.menu.enable(false);
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit() {

  }
}
