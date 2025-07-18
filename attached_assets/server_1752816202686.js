
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/run/:script', (req, res) => {
  const script = req.params.script;
  const basePath = path.join(__dirname, 'scripts');
  const extensions = ['.bat', '.reg', '.exe'];
  let scriptPath = '';
  let command = '';

  for (const ext of extensions) {
    const possiblePath = path.join(basePath, script + ext);
    if (fs.existsSync(possiblePath)) {
      scriptPath = possiblePath;
      if (ext === '.bat') command = `cmd /c "${scriptPath}"`;
      else if (ext === '.reg') command = `regedit /s "${scriptPath}"`;
      else if (ext === '.exe') command = `start "" "${scriptPath}"`;
      break;
    }
  }

  if (!scriptPath) return res.status(404).send(`❌ Script ${script} não encontrado.`);
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`❌ Erro: ${error.message}`);
    res.send(`✅ Script ${script} executado com sucesso!`);
  });
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
