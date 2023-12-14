import {User} from "~/interface";

export function fullName(user: User) {
  if (user.first_name || user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }
  return user.username
}


export function formatDate(str: number | string) {
  const date = new Date(str)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

export function formatNumber(num: number) {
  return num ?
    num.toLocaleString()
      .replaceAll(".", "_")
      .replaceAll(",", ".")
      .replaceAll("_", ",")
    : 0
}


export function string_to_slug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}
