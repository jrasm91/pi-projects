Vue.filter('time', function (date) {
  if (!date) {
    return 'never'
  }
  date = new Date(date)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

Vue.filter('heatingLabel', function (value) {
  if (value === true) {
    return 'ON'
  } else if (value === false) {
    return 'OFF'
  } else {
    return 'N/A'
  }
})

// Vue.filter('timeAgo', function (date) {
//   if (!date) {
//     return 'never';
//   }
//   return timeAgo(date);
// });
