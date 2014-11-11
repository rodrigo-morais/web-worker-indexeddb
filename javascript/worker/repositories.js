importScripts('jquery.hive.pollen.js');

var repositories = (function () {

    'use strict';

    var _find = function (data) {
        var page = data.page,
        per_page = data.per_page;

        var url = 'https://api.github.com/users/rodrigo-morais/repos?page=' + page + '&per_page=' + per_page;

        $.ajax.get({
            url: url,
            dataType: 'json',
            success: function (repos) {
                var repositories = [],
                    repository = {};

                repos.forEach(function (repo) {
                    repository = {
                        id: repo.id,
                        name: repo.name,
                        created_at: repo.created_at,
                        description: repo.description,
                        url: repo.html_url,
                        language: repo.language,
                        pushed_at: repo.pushed_at,
                        updated_at: repo.updated_at
                    };
                    repositories.push(repository);
                });

                self.postMessage(repositories);
            }
        });
    };

    var _findAndVerify = function () { }

    return {
        find: _find,
        findAndVerify: _findAndVerify
    };
})();