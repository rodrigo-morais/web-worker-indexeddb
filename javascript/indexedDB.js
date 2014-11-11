var localDB = (function () {
    var db,
        state = 'close';

    var _isOpen = function () {
        if (state === 'open') {
            return true;
        }
        else {
            return false;
        }
    }

    var _init = function () {
        if (window.indexedDB) {
            var request = window.indexedDB.open("github", 3);

            request.onerror = function (event) {
                console.log('Error when open IndexedDB.');
                state = 'close';
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                state = 'open';
            };

            request.onupgradeneeded = function (event) {
                var newVersion = event.target.result;

                if (!newVersion.objectStoreNames.contains('repositories')) {
                    newVersion.createObjectStore('repositories', { keyPath: 'id' });
                }
            };
        }
    };

    var _insert = function (repository) {
        var now = new Date(),
            transaction = db.transaction(['repositories'], 'readwrite'),
            store = transaction.objectStore('repositories'),
            request;

        repository.created_at = now;
        repository.updated_at = now;

        request = store.add(repository);

        request.onsuccess = function (event) {
            console.log('Repository "' + repository.name + '" added in local database.');
        };

        request.onerror = function (event) {
            console.log('Error when added repository "' + repository.name + '" in local database.');
        };
    };

    return {
        init: _init,
        isOpen: _isOpen,
        insert: _insert
    };

})();

localDB.init();