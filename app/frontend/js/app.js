/**
 * Created by Nathan on 8/27/2016.
 */
var app = angular.module('tinyUrl', ['ui.router', 'chart.js', 'ngResource', 'ui.bootstrap', 'ngAnimate']);


app.config(function ($stateProvider, $urlRouterProvider) {

    //match all default case, will go to '#/'
    $urlRouterProvider.otherwise('/');

    //match '#/'
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                '': {
                    templateUrl: '/view/home.html',
                    controller: 'homeController as $ctrl',
                },
                'nav@home': {
                    templateUrl: '/view/nav/guestNav.html',
                    controller: 'guestNavController as $ctrl'
                },
                'main@home': {
                    templateUrl: '/view/main/guestMain.html',
                    controller: 'guestMainController'
                }
            },
            allowAfterLogin: false,
            allowAnonymous: true
        })
        .state('home.user', {
            url: 'user',
            views: {
                'nav@home': {
                    templateUrl: '/view/nav/userNav.html',
                    controller: 'userNavController as $ctrl'
                },
                'main@home': {
                    templateUrl: '/view/main/userMain.html',
                    controller: 'userMainController'
                }
            },
            allowAfterLogin: true,
            allowAnonymous: false
        })
        .state('home.urlInfo', {
            url: 'urlInfo/:shortUrl',
            views: {
                'main@home': {
                    templateUrl: '/view/url/urlInfo.html',
                    controller: 'urlInfoController'
                }
            },
            allowAfterLogin: false,
            allowAnonymous: true

        })
})
    .run(function ($rootScope, $state, authService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if (!authService.isAuthenticated()) {
                if (!next.allowAnonymous) {
                    event.preventDefault();
                    $state.go('home');
                }
            } else {
                authService.validate();
                if (!next.allowAfterLogin) {
                    event.preventDefault();
                    $state.go('home.user');
                }
            }
        });
    });
