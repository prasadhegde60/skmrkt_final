import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {
  emailId: String = null;
  role: String = null;
  isPremium: boolean = false;
  isAdmin: boolean = false;
  isStandard: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log("INside NG ON init of user page");
    this.authService.emailId.subscribe(emailId => {
      if(emailId){
        this.emailId = emailId;
      }
    })
    this.authService.userRole.subscribe(userRole => {
      if (userRole){
        this.role = userRole;
        console.log("User Role:", userRole)
        if(userRole === "Admin"){
          console.log("Setting admin flag");
          this.isAdmin = true;
          this.isPremium = false;
          this.isStandard = false;
        }
        else if(userRole === "Premium"){
          console.log("Setting premium flag");
          this.isPremium = true;
          this.isAdmin = false;
          this.isStandard = false;
        }
        else{
          console.log("Setting standard flag");
          this.isStandard = true;
          this.isPremium = false;
          this.isAdmin = false;
        }
      }
    });
  }

  // maybe i will have to add IONview will enter
  ionViewWillEnter(){
    this.authService.userRole.subscribe(userRole => {
      if (userRole){
        this.role = userRole;
        console.log("User Role:", userRole)
        if(userRole === "Admin"){
          console.log("Setting admin flag");
          this.isAdmin = true;
          this.isPremium = false;
          this.isStandard = false;
        }
        else if(userRole === "Premium"){
          console.log("Setting premium flag");
          this.isPremium = true;
          this.isAdmin = false;
          this.isStandard = false;
        }
        else{
          console.log("Setting standard flag");
          this.isStandard = true;
          this.isPremium = false;
          this.isAdmin = false;
        }
      }
    });
  }

  onUpgradeToPremium(){
    if(this.isStandard){
      this.router.navigateByUrl("/user-page/payments-page");
    }
  }

}
