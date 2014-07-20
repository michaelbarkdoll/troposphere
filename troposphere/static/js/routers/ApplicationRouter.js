define(function (require) {
    'use strict';

    var Marionette                   = require('marionette'),
        Root                         = require('components/Root.react'),
        React                        = require('react'),
        ApplicationListPage          = require('components/applications/ApplicationListPage.react'),
        ApplicationDetailsPage       = require('components/applications/ApplicationDetailsPage.react'),
        ApplicationSearchResultsPage = require('components/applications/ApplicationSearchResultsPage.react'),
        FavoritedApplicationsPage    = require('components/applications/FavoritedApplicationsPage.react'),
        MyApplicationsPage           = require('components/applications/MyApplicationsPage.react'),
        context                      = require('context'),
        Backbone                     = require('backbone');


    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'images': 'showApplications',
        'images/search/:query': 'showApplicationSearchResults',
        'images/favorites': 'showFavoritedApplications',
        'images/authored': 'showAuthoredApplications',
        'images/:id': 'showApplicationDetail'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      //
      // Route handlers
      //
      showApplications: function () {
        this.render(ApplicationListPage(), ["images"]);
      },

      showFavoritedApplications: function () {
        this.render(FavoritedApplicationsPage(), ["images","favorites"]);
      },

      showAuthoredApplications: function () {
        this.render(MyApplicationsPage(), ["images", "authored"]);
      },

      showApplicationDetail: function (appId) {
        var content = ApplicationDetailsPage({
          applicationId: appId
        });
        this.render(content, ["images"]);
      },

      showApplicationSearchResults: function (query) {
        var content = ApplicationSearchResultsPage({query: query});
        this.render(content, ["images", "search"]);
      }

    });

    return {
      start: function () {
        var controller = new Controller();
        var router = new Router({
          controller: controller
        });
      }
    }

  });