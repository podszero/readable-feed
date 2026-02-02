import { Feed } from "./types";

export function parseOPML(opmlContent: string): Feed[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlContent, "text/xml");
  
  const outlines = doc.querySelectorAll('outline[type="rss"]');
  const feeds: Feed[] = [];
  
  outlines.forEach((outline) => {
    const xmlUrl = outline.getAttribute("xmlUrl");
    const title = outline.getAttribute("title") || outline.getAttribute("text") || "Untitled Feed";
    const htmlUrl = outline.getAttribute("htmlUrl") || "";
    
    if (xmlUrl) {
      feeds.push({
        id: generateFeedId(xmlUrl),
        title,
        xmlUrl,
        htmlUrl,
        unreadCount: 0,
      });
    }
  });
  
  return feeds;
}

function generateFeedId(url: string): string {
  // Create a simple hash from the URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `feed_${Math.abs(hash).toString(16)}`;
}

// Embedded OPML data from the user's file
export const defaultOPML = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Blog Feeds</title>
  </head>
  <body>
    <outline text="Blogs" title="Blogs">
      <outline type="rss" text="simonwillison.net" title="simonwillison.net" xmlUrl="https://simonwillison.net/atom/everything/" htmlUrl="https://simonwillison.net"/>
      <outline type="rss" text="paulgraham.com" title="paulgraham.com" xmlUrl="http://www.aaronsw.com/2002/feeds/pgessays.rss" htmlUrl="https://paulgraham.com"/>
      <outline type="rss" text="overreacted.io" title="overreacted.io" xmlUrl="https://overreacted.io/rss.xml" htmlUrl="https://overreacted.io"/>
      <outline type="rss" text="krebsonsecurity.com" title="krebsonsecurity.com" xmlUrl="https://krebsonsecurity.com/feed/" htmlUrl="https://krebsonsecurity.com"/>
      <outline type="rss" text="daringfireball.net" title="daringfireball.net" xmlUrl="https://daringfireball.net/feeds/main" htmlUrl="https://daringfireball.net"/>
      <outline type="rss" text="pluralistic.net" title="pluralistic.net" xmlUrl="https://pluralistic.net/feed/" htmlUrl="https://pluralistic.net"/>
      <outline type="rss" text="troyhunt.com" title="troyhunt.com" xmlUrl="https://www.troyhunt.com/rss/" htmlUrl="https://troyhunt.com"/>
      <outline type="rss" text="xeiaso.net" title="xeiaso.net" xmlUrl="https://xeiaso.net/blog.rss" htmlUrl="https://xeiaso.net"/>
      <outline type="rss" text="gwern.net" title="gwern.net" xmlUrl="https://gwern.substack.com/feed" htmlUrl="https://gwern.net"/>
      <outline type="rss" text="lucumr.pocoo.org" title="lucumr.pocoo.org" xmlUrl="https://lucumr.pocoo.org/feed.atom" htmlUrl="https://lucumr.pocoo.org"/>
      <outline type="rss" text="rachelbythebay.com" title="rachelbythebay.com" xmlUrl="https://rachelbythebay.com/w/atom.xml" htmlUrl="https://rachelbythebay.com"/>
      <outline type="rss" text="dynomight.net" title="dynomight.net" xmlUrl="https://dynomight.net/feed.xml" htmlUrl="https://dynomight.net"/>
      <outline type="rss" text="matklad.github.io" title="matklad.github.io" xmlUrl="https://matklad.github.io/feed.xml" htmlUrl="https://matklad.github.io"/>
      <outline type="rss" text="blog.jim-nielsen.com" title="blog.jim-nielsen.com" xmlUrl="https://blog.jim-nielsen.com/feed.xml" htmlUrl="https://blog.jim-nielsen.com"/>
      <outline type="rss" text="computer.rip" title="computer.rip" xmlUrl="https://computer.rip/rss.xml" htmlUrl="https://computer.rip"/>
      <outline type="rss" text="eli.thegreenplace.net" title="eli.thegreenplace.net" xmlUrl="https://eli.thegreenplace.net/feeds/all.atom.xml" htmlUrl="https://eli.thegreenplace.net"/>
      <outline type="rss" text="susam.net" title="susam.net" xmlUrl="https://susam.net/feed.xml" htmlUrl="https://susam.net"/>
      <outline type="rss" text="johndcook.com" title="johndcook.com" xmlUrl="https://www.johndcook.com/blog/feed/" htmlUrl="https://johndcook.com"/>
      <outline type="rss" text="mitchellh.com" title="mitchellh.com" xmlUrl="https://mitchellh.com/feed.xml" htmlUrl="https://mitchellh.com"/>
      <outline type="rss" text="anildash.com" title="anildash.com" xmlUrl="https://anildash.com/feed.xml" htmlUrl="https://anildash.com"/>
    </outline>
  </body>
</opml>`;
