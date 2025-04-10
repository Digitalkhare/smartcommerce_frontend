export const escapeAmpInTextParam = (url) => {
  try {
    // Only target the `text=` param and escape `&` after that
    return url.replace(/(text=[^&]*)&/g, (match) => {
      return match.replace(/&/g, "%26");
    });
  } catch (err) {
    console.warn("Error escaping ampersand:", err);
    return url;
  }
};
