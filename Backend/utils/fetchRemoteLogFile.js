export default function fetchRemoteLogFile(config) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) return reject(err);
          sftp.readFile(config.logFilePath, (err, data) => {
            if (err) return reject(err);
            conn.end();
            resolve(data.toString());
          });
        });
      })
      .connect({
        host: config.host,
        port: config.port,
        username: config.username,
        privateKey: fs.readFileSync(config.privateKeyPath),
      });
  });
}