/* eslint-disable no-unused-vars */
// biome-ignore lint/correctness/noUnusedVariables: CloudFront Functions invoke this global handler by name.
function handler(event) {
  var request = event.request;

  if (request.uri !== "/api/puzzles/random") {
    return request;
  }

  var id = Math.floor(Math.random() * __PUZZLE_COUNT__);
  request.uri = `/puzzles/${String(id).padStart(4, "0")}.json`;
  request.querystring = {};

  return request;
}
