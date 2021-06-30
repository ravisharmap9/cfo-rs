const ACCESS_TOKEN = 'cfomain::access_token';
const USER_ID = "cfomain::user_Id";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  /* Autherization */
  setAccessToken(access_token) {
    localStorage.setItem(ACCESS_TOKEN, access_token);
  },
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },
  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN);
  },

  setUserID(user_Id) {
    localStorage.setItem(USER_ID, user_Id);
  },
  getUserID() {
    return localStorage.getItem(USER_ID);
  },
  removeUserID() {
    localStorage.removeItem(USER_ID);
  },

}
