import net from 'net';

const srv = net.createServer((sock) => { sock.end('Hello world\n'); });

export function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    srv.listen(port, () => {
      srv.close(() => {
        resolve(true);
      });
    });
    srv.once('error', () => {
      resolve(false);
    });
  });
}