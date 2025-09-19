import fs from 'fs';
import os from 'os';

export const verpattern = /.+(\\\d\d\.\d\d.+?(\\|$))/i;

export const StackBackendType = {
  stack: 0,
  apphost: 1
};

export function getGatewayFileName(path: string) {
  return (
    fs
      .readdirSync(path, { withFileTypes: true })
      .filter((e) => e.isFile() && /^stackgateway-.*\.jar$/.test(e.name))
      .map((e) => e.name)
      .pop() || 'stackgateway-0.0.3.jar'
  );
}

export function getAllowedOrigins(ports: number[]) {
  const result = [] as string[];

  const push = (host: string) =>
    ports.forEach((port: number) => {
      result.push(`http://${host}:${port}`);
    });

  push('localhost');
  push(os.hostname());
  getIpAddresses().forEach((el: any) => push(el.address)); 
  return result;
}

export function getIpAddresses(): string[] {
   const addr: string[] = [];
   Object.values(os.networkInterfaces()).forEach((ni: any) => {
      ni.filter((el: any) => el.family === 'IPv4').forEach((el: any) => addr.push(String(el.address)));
   });
   return addr;
}