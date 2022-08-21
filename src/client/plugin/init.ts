export const authorizePath = '/-/ui/login';
export const loginHref = authorizePath;
export const logoutHref = '/';

/**
 * See https://verdaccio.org/docs/en/packages
 */
export const authenticatedUserGroups = ['$all', '@all', '$authenticated', '@authenticated', 'all'];

import {clearCredentials, Credentials, isLoggedIn, saveCredentials, validateCredentials} from './credentials';
import {interruptClick, parseCookies, retry} from './lib';

/**
 * Change the current URL to only the current pathname and reload.
 * We don't use `location.href` because we want the query params
 * to be excluded from the history.
 */
function reloadToPathname() {
  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure';
  document.cookie = 'ui-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure';
  document.cookie = 'npm-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure';
  history.replaceState(null, '', location.pathname);
  location.reload();
}

function saveAndRemoveCookies() {
  if (isLoggedIn()) {
    return;
  }

  const credentials: Credentials = parseCookies() as any;
  if (!validateCredentials(credentials)) {
    return;
  }

  saveCredentials(credentials);
  reloadToPathname();
}

//
// Shared API
//

export interface InitOptions {
  loginButton: string;
  logoutButton: string;
  updateUsageInfo: () => void;
}

//
// By default the login button opens a form that asks the user to submit credentials.
// We replace this behaviour and instead redirect to the route that handles OAuth.
//

export function init(options: InitOptions) {
  saveAndRemoveCookies();

  const {loginButton, logoutButton, updateUsageInfo} = options;

  interruptClick(loginButton, () => {
    location.href = loginHref;
  });

  interruptClick(logoutButton, () => {
    clearCredentials();
    if (location.pathname == '/') location.reload();
    else location.href = logoutHref;
  });

  document.addEventListener('click', () => retry(updateUsageInfo));
  retry(updateUsageInfo);
}
