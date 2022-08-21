import qs from 'qs';

/**
 * Returns `?a=b&c` as `{ a: b, c: true }`.
 */
export function parseCookies() {
  let cookies: {key: string; val: string}[] = document.cookie
    .split('; ')
    .filter(el => el != '')
    .map(el => {
      return {key: el.split('=')[0], val: el.split('=')[1]};
    });
  return {
    username: cookies.some(el => el.key == 'username') ? decodeURI(cookies.find(el => el.key == 'username').val) : null,
    uiToken: cookies.some(el => el.key == 'ui-token') ? cookies.find(el => el.key == 'ui-token').val : null,
    npmToken: cookies.some(el => el.key == 'npm-token') ? cookies.find(el => el.key == 'npm-token').val : null,
  };
}

export function retry(action: () => void) {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => action(), 100 * i);
  }
}

function pathContainsElement(selector: string, e: any): boolean {
  const path = e.path || e.composedPath?.();
  const element = document.querySelector(selector)!;

  return path.includes(element);
}

export function interruptClick(selector: string, callback: () => void) {
  const handleClick = (e: MouseEvent) => {
    if (pathContainsElement(selector, e)) {
      e.preventDefault();
      e.stopPropagation();
      callback();
    }
  };
  const capture = true;
  document.addEventListener('click', handleClick, capture);
}
