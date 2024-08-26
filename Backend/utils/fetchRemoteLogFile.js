import { Client } from 'ssh2';
import fs from 'fs';

export default function fetchRemoteLogFile(config) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        console.log('SSH connection established');
        conn.sftp((err, sftp) => {
          if (err) {
            console.error('SFTP error:', err);
            return reject(err);
          }
          sftp.readFile(config.logFilePath, (err, data) => {
            if (err) {
              console.error('File read error:', err);
              return reject(err);
            }
            conn.end();
            resolve(data.toString());
          });
        });
      })
      .on('error', (err) => {
        console.error('SSH connection error:', err);
        reject(err);
      })
      .connect({
        host: config.host,
        port: config.port,
        username: config.logusername,
        privateKey: fs.readFileSync(config.privateKeyPath),
      });
  });
}