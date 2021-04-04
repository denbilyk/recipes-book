export class User {

  constructor(public email: string,
              public id: string,
              private _token: string,
              private _tokenExparationData: Date) {
  }

  get token(): string | null {
    if (!this._tokenExparationData || new Date() > this._tokenExparationData) {
      return null;
    }
    return this._token;
  }
}
