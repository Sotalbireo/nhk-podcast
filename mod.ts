import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {
  const resp = await fetch(
    "https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml",
    { headers: { accept: "application/xml" } },
  );

  const mp3url = await resp.text().then((text) => {
    console.log(text.match(/<item>\s+<title>(.*?)<\/title>/)?.[1]);
    return text.match(/<enclosure url=\"(.*?)\"/)?.[1];
  });
  console.log(mp3url);

  if (mp3url) {
    const mp3 = await fetch(mp3url, { headers: { accept: "audio/mp3" } });

    return new Response(mp3.body, {
      status: mp3.status,
      headers: { "content-type": "audio/mp3", "Cache-Control": "max-age=1800" },
    });
  }

  return new Response(null);
}

serve(handler);
