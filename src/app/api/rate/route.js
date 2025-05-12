export async function POST(request) {
  const { message, score } = await request.json();
  console.log("FEEDBACK", score, message); // appears in Vercel logs
  return new Response("ok");
}