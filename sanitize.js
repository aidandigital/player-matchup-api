// Text Sanitizer Function
module.exports = sanitize = (string) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
      "`": "&grave",
    };
    const strRgx = /[&<>"'`/]/gi;
    return string
      .toString()
      .trim()
      .replace(strRgx, (match) => map[match]);
}