romd = window.romd || {cmd: []};
(function (c, cb) {
  var d = document, s = d.createElement('script'), x, t, q = [];
  s.type = 'text/javascript';
  s.async = 1;
  s.src = 'https://cdn-c.skcrtxr.com/wrapper/js/dynamic-engine.js?v=s-fab2a100-1d16-42a8-a24a-efff345ba4dd';
  for (x in c) q.push(x + '=' + c[x].join(','));
  s.src += q.join('&');
  t = document.getElementsByTagName('head')[0];
  t.insertBefore(s, t.firstChild);
  if (cb) {
    cb.call();
  }
})({}, function () {
  romd.cmd.push(function () {
    romd.display([{"selector":".roxot-dynamic.Leaderboard-gam","rerunTimeLimit":500,"infinityScroll":true,"placementId":"589ff922-3a26-4056-954c-8c16669a14ad"},{"selector":".roxot-dynamic.qna-infeed-rectangle-1-gam","rerunTimeLimit":500,"infinityScroll":true,"placementId":"bd966de1-2647-466b-b4a9-6d177ac91029"},{"selector":".roxot-dynamic.qna-side-rectangle-1-gam","rerunTimeLimit":500,"infinityScroll":true,"placementId":"ab7f725f-ca2d-4806-bed2-a7f7eca5714a"},{"selector":".roxot-dynamic.Right_rectangle_bottom-gam","rerunTimeLimit":500,"infinityScroll":true,"placementId":"efdd69db-4c58-404f-b819-b00eae18fbc6"},{"selector":".roxot-dynamic.Right_rectangle_top-gam","rerunTimeLimit":500,"infinityScroll":true,"placementId":"ab37e679-2584-403f-9155-63c1f1277d68"}]);
  });
});