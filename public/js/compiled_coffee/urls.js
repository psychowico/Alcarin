/*
Here we can store all urls that are using by JS. It need be manually change
if we change sites links in system. We saved it in global namespace, so can be
used anywhere in js code.
Hrefs shouldn't have '/' symbol at end.
*/

this.urls = {
  game: {
    panel: '/game/panel',
    character: {
      events: '/game/char-events'
    }
  },
  orbis: {
    panel: '/admin/orbis/gateways-panel',
    gateways: '/admin/orbis/gateways',
    gatewaysgroups: '/admin/orbis/gateways-groups',
    map: '/admin/orbis/map'
  },
  api: {
    errors: '/api/errors/external'
  },
  dev: {
    action: '/dev'
  },
  translations: '/admin/translations'
};

/*
//@ sourceMappingURL=urls.js.map
*/
