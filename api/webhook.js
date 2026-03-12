export default async function handler(req, res) {
  const body = req.body;

  console.log("LINE Event:", body);

  res.status(200).json({ message: "ok" });
}
