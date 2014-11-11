﻿var main = (function () {
    'use strict';

    var _showData = function () {
        _findByServer();
    };

    var _showRepos = function (repos) {
        var repoList = document.querySelector(".repos");

        repos.forEach(function (repo) {
            var repoElement = document.createElement('li'),
                linkRepo = document.createElement('a');

            linkRepo.appendChild(document.createTextNode(repo.name));
            linkRepo.href = repo.html_url;
            linkRepo.target = '_blank';

            repoElement.appendChild(linkRepo);
            repoElement.appendChild(document.createTextNode(' - ' + repo.description));

            repoList.appendChild(repoElement);
        });
    };

    var _findByServer = function () {
        if (window.Worker) {
            var worker = new Worker('javascript/worker/worker.js'),
                page = 1,
                per_page = 3,
                time = 2000;

            worker.addEventListener('message', function (e) {
                var repos = e.data;

                if (e.data.length > 0) {
                    _showRepos(repos);
                    page = page + 1;
                    setTimeout(function () {
                        worker.postMessage({ 'page': page, 'per_page': per_page });
                    }, time);
                    
                }
                else {
                    _showRepos(repos);
                    worker.terminate();
                }

            }, false);

            worker.postMessage({'page':page, 'per_page': per_page});
        }
    };

    var _load = function () {
        _showData();
    };

    return {
        load: _load
    };
})();

main.load();