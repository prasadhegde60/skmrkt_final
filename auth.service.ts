import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, from } from 'rxjs';
import { map , tap, take, switchMap} from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Plugins } from '@capacitor/core';
import { RouterLink } from '@angular/router';
import { UserProfileData } from '../user-page/user-profile-data';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered: boolean;
}

interface userProfile {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  role: String

  get userIsAuthenticated(){
    return this._user.asObservable().pipe(map(user=>{
      if(user){
        return !!user.token;
      }
      else{
        return false;
      }
    } 
    ));
  }

  get userToken(){
    return this._user.asObservable().pipe(map(user=>{
      if(user){
        return user.token;
      }
      else{
        return null;
      }
    } 
    ));
  }

  get userRole(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.userRole;
      }
      else{
        return null;
      }
    }))
  }

  get emailId(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.email;
      }
      else{
        return null;
      }
    }))
  }

  get roleIndex(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.roleIndex;
      }
      else{
        return null;
      }
    }))
  }

  get expiresIn(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.tokenDuration;
      }
      else{
        return null;
      }
    }))
  }

  get localId(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.id;
      }
      else{
        return null;
      }
    }))
  }


  constructor(
    private http: HttpClient
  ) { }



  login(email: String, password: String){
    console.log("Inside Login Method")
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
        environment.firebaseAPIKey
      }`,
      { email: email, password: password, returnSecureToken: true }
      ) 
  }

  signup(email: String, password: String){
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.firebaseAPIKey
        }`,
        { email: email, password: password, returnSecureToken: true }
      )
  }

  resetPassword(email: String){
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${
          environment.firebaseAPIKey
        }`,
        { email: email, requestType: "PASSWORD_RESET" }
      )
  }

  getUserRoleProfile(localId: String, email: String, idToken: String, expiresIn: String){
    return this.http.get<{[key: string]: userProfile}>(`https://stock-market-9e74c.firebaseio.com/user-profile.json`)
    .pipe(tap(resData => {
      for( const key in resData){
        if(resData.hasOwnProperty(key)){
          if(resData[key].email == email){
            const role = resData[key].role;
            const roleIndex = key;
            this.setUserData(localId, email, idToken, expiresIn, role, roleIndex);
          }
        }
      }
    }
    ));
  }

  setUserRoleProfile(localId: String, email: String, idToken:String, expiresIn: String, userRole: String){
    return this.createUserProfileEntryInDB(email, userRole, idToken).pipe(tap(resData =>{
      this.getUserRoleProfile(localId, email, idToken, expiresIn).subscribe();
    })); 
  }

  updateUserRoleProfile(email: String, role:String, roleIndex: String){
    return this.http.patch(`https://stock-market-9e74c.firebaseio.com/user-profile/${roleIndex}.json?auth=${this._user.value.token}`, 
      {"email": email, "role": role}
    )
  }

  public createUserProfileEntryInDB(email: String, role: String, idToken: String){
    return this.http.post(`https://stock-market-9e74c.firebaseio.com/user-profile.json?auth=${idToken}`, 
      { email: email, role: role} 
    ); 
  }

  public setUserData(localId: String, email: String, idToken: String, expiresIn: String, role: String, roleIndex: String){
    const expirationTime = new Date(new Date().getTime() + (+expiresIn * 1000));
    const user = new User(
      localId, 
      email, 
      idToken, 
      expirationTime,
      role,
      roleIndex
    );
    
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(localId, idToken, expirationTime.toISOString(), email, role, roleIndex);
  }

  logout(){
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  

  private updateUserData(emailId: String, userRole: String){
    console.log("Inside update User Data", emailId, userRole);
    
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
          role: String;
          roleIndex: String;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime,
          parsedData.role,
          parsedData.roleIndex
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number){
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration)
  }

  private storeAuthData(userId: String, token: String, tokenExpirationDate: String, email: String, role: String, roleIndex: String){
    const data = JSON.stringify({
      userId: userId, 
      token: token, 
      tokenExpirationDate: tokenExpirationDate,
      email: email,
      role: role,
      roleIndex: roleIndex
    });
    Plugins.Storage.set({key: 'authData', value: data});
    console.log("Storing auth data complete");
  }

  ngOnDestroy(){
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
