class Auth {
  constructor() {
    this.authenticated = false;
    this.userInfo = {};
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }
}

export default new Auth();
