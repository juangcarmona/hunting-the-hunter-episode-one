import { kv } from "@vercel/kv";
import { getPlaiceholder } from "plaiceholder";

export async function POST(request: Request) {
    const { url } = await request.json();

    const chachedPlaceholder = await kv.get("blur:" + url);

    if (chachedPlaceholder) {
        return new Response(JSON.stringify({ data: chachedPlaceholder }), {
            status: 200,
        });
    }

    const buffer = await fetch(url).then(async (res) =>
        Buffer.from(await res.arrayBuffer()),
    );

    const { base64 } = await getPlaiceholder(buffer);

    await kv.set("blur:" + url, base64);

    return new Response(JSON.stringify({ data: base64 }), {
        status: 200,
    });
}
