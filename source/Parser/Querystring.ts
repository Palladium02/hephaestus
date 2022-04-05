const parseQuerystring = (
  url: string
): { _url: string; query: { [key: string]: string } } => {
  let query = {};
  let [_url, querystring] = url.split("?");

  if (!querystring) {
    return { _url, query };
  }

  query = Object.fromEntries(
    querystring.split("&").map((pair) => pair.split("="))
  );

  return { _url, query };
};

export { parseQuerystring };
