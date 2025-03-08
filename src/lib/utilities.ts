export async function streamJson(stream: ReadableStream<Uint8Array> | null) {
	if (stream == null) return { done: false, data: null };
	const decoder = new TextDecoder('utf-8');
	const b = await stream.getReader().read();
	const json = JSON.parse(decoder.decode(b.value));
	return { done: b.done, data: json };
}
