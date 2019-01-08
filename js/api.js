var base_url = "https://readerapi.codepolitan.com/";

var status = response => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);

    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

var json = response => {
  return response.json();
}

var error = error => {
  console.log("Error: " + error);
}

var getArticles = () => {
  
  if('caches' in window) {
    caches.match(base_url + 'articles').then(response => {
      console.log(response);
      
      if(response) {
        response.json().then(data => {
          var articlesHTML = ""
          data.result.forEach(article => {
            articlesHTML += `
            <div class="card">
              <a href="./article.html?id=${article.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${article.thumbnail}"/>
                </div>
              </a>
              <div class="card-content">
                <span class="card-title truncate">${article.title}</span>
                <p>${article.description}</p>
              </div>
            </div>
          `
          });
          document.getElementById("articles").innerHTML = articlesHTML;
        })
      }
    });
  }

  fetch(base_url + "articles")
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var articlesHTML = "";
      data.result.forEach(function(article) {
        articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                  <p>${article.description}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

var getArticleById = () => {
  return new Promise((resolve, reject) => {
  var urlParams = new URLSearchParams(window.location.search)
  var idParam = urlParams.get('id');
  
  if('caches' in window) {
    caches.match(base_url + 'article/' + idParam).then(response => {
      if(response) {
        response.json().then(data => {
          var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;

        document.getElementById("body-content").innerHTML = articleHTML;

        resolve(data);
        })
      }
    })
  }
  

  fetch(base_url + "article/" + idParam)
    .then(status)
    .then(json)
    .then(data => {
      var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;

        document.getElementById('body-content').innerHTML = articleHTML;
        resolve(data)
    })
  })
}