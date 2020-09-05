export class User {
    constructor(
        public id: String, 
        public email: String,
        private _token: String,
        private _tokenExpirationDate: Date,
        public userRole: String,
        public roleIndex: String
    ){}
    
    get token(){
        if (!this._tokenExpirationDate || this._tokenExpirationDate<= new Date()){
            return null;
        }
        return this._token;
    }

    get tokenDuration(){
        if (!this.token){
            return 0;
        }
        return this._tokenExpirationDate.getTime() - new Date().getTime();
    }

}