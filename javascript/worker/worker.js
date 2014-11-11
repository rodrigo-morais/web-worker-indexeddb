importScripts('repositories.js');

$(function (data) {

    'use strict';

    var page = 0,
        per_page = 100,
        time = 2000;

    setInterval(function () {
        page = page + 1;

        repositories.find(page, per_page).then(function (repos) {
            if (repos.length === 0 || page >= 7) {
                self.close();
            }
            else {
                self.postMessage(repos);
            }
        });
    }, time);
    

});