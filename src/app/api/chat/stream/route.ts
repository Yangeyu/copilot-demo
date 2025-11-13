const mockReadableStream = () => {
  const msgArr = [
    JSON.stringify({ role: 'user', content: 'hello' }),
    JSON.stringify({ role: 'assistant', content: 'world' }),
    JSON.stringify({ role: 'user', content: 'hello' }),];
  return new ReadableStream({
    async start(ctrl) {
      for (const msg of msgArr) {
        ctrl.enqueue(new TextEncoder().encode(msg));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟消息间隔(1000);
      }
    }
  });
};
export function POST(request: Request) {
  const stream = mockReadableStream();
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });

}
