
allow_request(_, request) if
  request.url.startsWith("/public");
