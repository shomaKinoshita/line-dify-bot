export default async function handler(req, res) {

  const event = req.body.events?.[0];

  if (!event) {
    return res.status(200).send("ok");
  }

  const userMessage = event.message?.text;

  const difyResponse = await fetch("https://api.dify.ai/v1/chat-messages", {
    method: "POST",
    headers: {
      "Authorization": "Bearer NrxpXwM0YY8v78ZuAC4gZBI8AUqdEhuNeNa/n4zNsjBl7xJMFkkk7FoSVHMqtJtmvM/rsFDEb5XFgsysuL3QTg2L+7eshNJenAw4w4fUNvQqj8YVrKBylzCLnehsgQWlgM3KTufCbn6GZKdHgceqHQdB04t89/1O/w1cDnyilFU=",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: {},
      query: userMessage,
      user: "line-user",
      response_mode: "blocking"
    })
  });

  const data = await difyResponse.json();

  const aiMessage = data.answer || "エラーが発生しました";

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer NrxpXwM0YY8v78ZuAC4gZBI8AUqdEhuNeNa/n4zNsjBl7xJMFkkk7FoSVHMqtJtmvM/rsFDEb5XFgsysuL3QTg2L+7eshNJenAw4w4fUNvQqj8YVrKBylzCLnehsgQWlgM3KTufCbn6GZKdHgceqHQdB04t89/1O/w1cDnyilFU="
    },
    body: JSON.stringify({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: aiMessage
        }
      ]
    })
  });

  res.status(200).send("ok");
}
