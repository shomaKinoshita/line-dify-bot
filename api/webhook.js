export default async function handler(req, res) {
  try {
    const event = req.body?.events?.[0];

    if (!event) {
      return res.status(200).send("ok");
    }

    if (event.type !== "message" || event.message?.type !== "text") {
      return res.status(200).send("ok");
    }

    const userMessage = event.message.text;

    const DIFY_API_URL = "https://api.dify.ai/v1/chat-messages";
    const DIFY_API_KEY = "app-EpeyU2WqcswLSmvMhcjOHkob";
    const LINE_ACCESS_TOKEN = "29nsKzi0L/JftcJqsCrylW1xbVGW1g9+Vpyk4xTBesEYoGo4PozMIcyWtMI3icTLvM/rsFDEb5XFgsysuL3QTg2L+7eshNJenAw4w4fUNvTSrcH90QjZ8oLP6qTExfw/PkOJE0WxkZIyHX5v8X9qlAdB04t89/1O/w1cDnyilFU=";

    const difyResponse = await fetch(DIFY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: {},
        query: userMessage,
        user: `line-${event.source?.userId || "anonymous"}`,
        response_mode: "blocking"
      })
    });

    const difyData = await difyResponse.json();
    console.log("Dify response:", JSON.stringify(difyData));

    const aiMessage =
      difyData.answer ||
      difyData.message ||
      difyData.error ||
      "Dify側でエラーが発生しました";

    const lineResponse = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: String(aiMessage).slice(0, 1000)
          }
        ]
      })
    });

    const lineResultText = await lineResponse.text();
    console.log("LINE response:", lineResultText);

    return res.status(200).send("ok");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(200).send("ok");
  }
}

