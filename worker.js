export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("PLUS90 API IS ONLINE", {
        headers: cors
      });
    }

    if (!env.API_FOOTBALL_KEY) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500, headers: cors }
      );
    }

    if (url.pathname !== "/fixtures") {
      return Response.json(
        { error: "Not found" },
        { status: 404, headers: cors }
      );
    }

    const date = url.searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json(
        { error: "Use date=YYYY-MM-DD" },
        { status: 400, headers: cors }
      );
    }

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      {
        headers: {
          "x-apisports-key": env.API_FOOTBALL_KEY
        }
      }
    );

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        ...cors,
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }
};
