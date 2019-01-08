var dbPromised = idb.open('news-reader', 1, upgradeDb => {
  var articleObjectStore = upgradeDb.createObjectStore('articles', {
    keyPath: 'ID'
  });
  articleObjectStore.createIndex('post_title', 'post_title', { unique: false});
});

var saveForLater = article => {
  dbPromised.then(db => {
    var tx = db.transaction('articles', 'readwrite');
    var store = tx.objectStore('articles');
    console.log(article);
    store.add(article.result)
    return tx.complete;
  })
  .then(() => {
    console.log('Artikel berhasil disimpan');
  });
}

var getAll = () => {
  return new Promise((resolve, reject) => {
    dbPromised.then(db => {
      var tx = db.transaction('articles', 'readonly');
      var store = tx.objectStore('articles');
      return store.getAll();
    }).then(articles => {
      resolve(articles)
    })
  })
}