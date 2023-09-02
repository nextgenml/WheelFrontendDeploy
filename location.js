fetch("https://api.ipify.org?format=json")
  .then(function (response) {
    return response.json();
  })
  .then(function (payload) {
    console.log(payload);
  });
