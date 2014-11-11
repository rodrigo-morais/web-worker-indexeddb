var localDB = (function () {
    var db,
        state = 'close',
        containsData = false;

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

                _count().then(function (count) {
                    if (count === 0) {
                        containsData = false;
                    }
                    else {
                        containsData = true;
                    }
                });
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
            //console.log('Repository "' + repository.name + '" added in local database.');
        };

        request.onerror = function (event) {
            //console.log('Error when added repository "' + repository.name + '" in local database.');
        };
    };

    var _count = function () {
        var transaction = db.transaction(['repositories']),
            store = transaction.objectStore('repositories'),
            count = store.count(),
            deferred = Q.defer();

        count.onsuccess = function (event) {
            deferred.resolve(count.result);
        };

        count.onerror = function (event) {
            deferred.resolve(0);
        };

        return deferred.promise;
    };

    var _hasData = function () {
        return containsData;
    };

    return {
        init: _init,
        isOpen: _isOpen,
        insert: _insert,
        hasData: _hasData
    };

})();

localDB.init();