import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  icon:boolean=true;
  type:string='password';
  login={
    username:"",
    password:""
  }

  constructor(public menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  viewPassword(){
    if(this.icon){
      console.log("view password");
      this.icon=false;
      this.type="text";
    }else{
      console.log("not view password");
      this.icon=true;
      this.type="password";
    }
  }

}
