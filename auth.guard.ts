import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

import { take, tap, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  userRole: String = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("Inside can Activate")
    this.authService.userRole.subscribe(userRole => {
      if(userRole){
        console.log("Here goes user role",this.userRole)
        this.userRole = userRole;
      }
      
    });
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        console.log("Inside switch map")
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          console.log("control comes here line 29")
          if(state.url === "/home/trade-calls" && this.userRole === "Standard"){
            this.router.navigateByUrl("/user-page");
          }
          else{
            if(route.data.roles && route.data.roles.indexOf(this.userRole) === -1){
              console.log("INSIDE lin 35 IF")
              this.router.navigate(['/']);
            }
            else{
              console.log("INSIDE lin 39 else")
              return of(isAuthenticated);
            }
          }         
          
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
        else{
          console.log("Inside authrnticated line 51")
        }
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean{
    this.authService.userRole.subscribe(userRole => {
      this.userRole = userRole;
    });
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          if(route.data.roles && route.data.roles.indexOf(this.userRole) === -1){
            this.router.navigate(['/']);
          }
          else{
            return of(isAuthenticated);
          }
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
        else{
          console.log("Inside authrnticated line 80")
        }
      })
    );
  }

  
}
