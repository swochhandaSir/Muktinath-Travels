let dashboardAuthenticated = false;

export function isDashboardAuthenticated() {
  return dashboardAuthenticated;
}

export function setDashboardAuthenticated(value) {
  dashboardAuthenticated = Boolean(value);
}

export function clearDashboardAuthenticated() {
  setDashboardAuthenticated(false);
}
