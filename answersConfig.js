function request(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(xhr.status)
        }
      }
    }
    xhr.ontimeout = function () {
      reject('timeout')
    }
    xhr.open('get', url, true)
    xhr.send();
  })
}

async function getAuthInfo() {
  return await request('/auth').then(function (result) {
    return JSON.parse(result)
  })
}

function getCookie(name) {
  function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
  let match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function setCookie(name, value) {
  // Encode value in order to escape semicolons, commas, and whitespace
  document.cookie = name + "=" + encodeURIComponent(value) + ";";
}

function format_time(s) {
  const dtFormat = new Intl.DateTimeFormat('en-US',options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'America/Los_Angeles'
  });
  return dtFormat.format(new Date(s * 1e3));
}

function setAuthInfoDiv(token, expiresAt) {
  document.getElementById("authinfo").innerHTML =
    "<p style=\"font-size: 20px;\">The current token is: </p>\n" +
    "<p id=\"token\" style=\"width: 100%\">" +  token + "</p>\n" +
    "<p style=\"font-size: 20px;\">This token will expire at " + format_time(expiresAt) + "</p>"
}

window.initAnswers = function () {
  const redirectUrl = "results"

  let expiresAt = getCookie("expires_at")
  let token = getCookie("token")

  if (Number(expiresAt) < Math.floor(Date.now() / 1000) || token == null) {
    let authInfo = getAuthInfo();

    authInfo.then(function (result) {
      // Get API Key
      token = result['token']
      expiresAt = result['expires_at']

      setCookie("token", token)
      setCookie("expires_at", expiresAt)

      ANSWERS.init({
        apiKey: "sandbox-".concat(token),
        experienceKey: "jwt_answers_experience",
        experienceVersion: "STAGING",
        locale: "en", // e.g. en
        businessId: "2547941",
        debug: true,
        onReady: function() {
          this.addComponent("SearchBar", {
            container: ".search-bar-container-3",
            name: "search-bar",
            placeholderText: "Search...",
            redirectUrl
          });
        }
      });
    });
  } else {
    ANSWERS.init({
      apiKey: "sandbox-".concat(token),
      experienceKey: "jwt_answers_experience",
      experienceVersion: "STAGING",
      locale: "en", // e.g. en
      businessId: "2547941",
      debug: true,
      onReady: function() {
        this.addComponent("SearchBar", {
          container: ".search-bar-container-3",
          name: "search-bar",
          placeholderText: "Search...",
          redirectUrl
        });
      }
    });
  }

  // Set JWT and Expires At
  setAuthInfoDiv(token, expiresAt)
}

window.initAnswersWithResults = function() {
  let expiresAt = getCookie("expires_at")
  let token = getCookie("token")
  if (Number(expiresAt) < Math.floor(Date.now() / 1000) || token == null) {

    let authInfo = getAuthInfo();

    authInfo.then(function (result){
      // Get API Key
      token = result['token']
      expiresAt = result['expires_at']

      setCookie("token", token)
      setCookie("expires_at", expiresAt)

      ANSWERS.init({
        apiKey: "sandbox-".concat(token),
        experienceKey: "jwt_answers_experience",
        experienceVersion: "STAGING",
        locale: "en", // e.g. en
        businessId: "2547941",
        debug: true,
        onReady: function() {
          this.addComponent("SearchBar", {
            container: ".search-bar-container-3",
            name: "search-bar",
            placeholderText: "Search...",
          });

          this.addComponent('UniversalResults', {
            container: ".universal-results-container",
            name: "universal-results-container",
            config: {
              faqs: {
                card: {
                  dataMappings: item => ({
                    title: item.name,
                    details: item.answer,
                    target: '_blank'
                  })
                },
                viewMore: false,
              },
              products: {
                card: {
                  dataMappings: item => ({
                    title: item.name,
                    details: item.richTextDescription,
                    image: 'https://19yw4b240vb03ws8qm25h366-wpengine.netdna-ssl.com/wp-content/uploads/Why-Cant-I-Just-Send-JWTs-Without-OAuth-JWT.png',
                    target: '_blank'
                  })
                },
                viewMore: false,
              },
            },
          });

          this.addComponent('DirectAnswer', {
            container: ".direct-answer-container",
            name: "direct-answer-container",
          });
        }
      });
    });
  } else {
    ANSWERS.init({
      apiKey: "sandbox-".concat(token),
      experienceKey: "jwt_answers_experience",
      experienceVersion: "STAGING",
      locale: "en", // e.g. en
      businessId: "2547941",
      debug: true,
      onReady: function() {
        this.addComponent("SearchBar", {
          container: ".search-bar-container-3",
          name: "search-bar",
          placeholderText: "Search...",
        });

        this.addComponent('UniversalResults', {
          container: ".universal-results-container",
          name: "universal-results-container",
          config: {
            faqs: {
              card: {
                dataMappings: item => ({
                  title: item.name,
                  details: item.answer,
                  target: '_blank'
                })
              },
              viewMore: false,
            },
            products: {
              card: {
                dataMappings: item => ({
                  title: item.name,
                  details: item.richTextDescription,
                  image: 'https://19yw4b240vb03ws8qm25h366-wpengine.netdna-ssl.com/wp-content/uploads/Why-Cant-I-Just-Send-JWTs-Without-OAuth-JWT.png',
                  target: '_blank'
                })
              },
              viewMore: false,
            },
          },
        });

        this.addComponent('DirectAnswer', {
          container: ".direct-answer-container",
          name: "direct-answer-container",
        });
      }
    });
  }
  setAuthInfoDiv(token, expiresAt)
}
