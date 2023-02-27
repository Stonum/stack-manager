import net from 'net';

const srv = net.createServer((sock) => { sock.end('Hello world\n'); });

export function checkPort(port: number): boolean {
  try {
    srv.listen(port, () => { });
    srv.close();
    return true;
  } catch (e: AnyException) {
    return false;
  }
}