/*
Here we can store all urls that are using by JS. It need be manually change
if we change sites links in system. We saved it in global namespace, so can be
used anywhere in js code.
Hrefs shouldn't have '/' symbol at end.
*/

this.urls = {
  orbis: {
    gateways: '/admin/orbis/gateways',
    map: '/admin/orbis/map'
  },
  api: {
    errors: '/api/errors/external'
  }
};
