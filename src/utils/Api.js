export function addFiltersToQueryString(queryString = "", filters: any = {}) {
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      if (filters[key] !== undefined && filters[key] !== null) {
        if (queryString === "") {
          queryString += `${key}=${filters[key]}`;
        } else {
          queryString += `&${key}=${filters[key]}`;
        }
      }
    }
  }
  return queryString;
}
