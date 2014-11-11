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
            var request = window.indexedDB.open("github", 1);

            request.onerror = function (event) {
                console.log('Error when open IndexedDB.');
                state = 'close';
            }

            request.onsuccess = function (event) {
                db = event.target.result;
                state = 'open';
            }
        }
    };

    return {
        init: _init,
        isOpen: _isOpen
    };

})();

localDB.init();