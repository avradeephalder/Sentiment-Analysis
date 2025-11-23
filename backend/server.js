import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('📝 Received text:', text);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Text must be less than 500 characters'
      });
    }

    console.log('🐍 Calling Python script...');
    const startTime = Date.now();

    const options = {
      mode: 'json',
      pythonPath: path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe'),
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, 'ml_model'),
      args: [text],
      timeout: 30000
    };

    console.log('🔧 Python path:', options.pythonPath);

    let shell = new PythonShell('predict.py', options);
    let output = [];

    shell.on('message', (message) => {
      console.log('📨 Python message:', message);
      output.push(message);
    });

    shell.on('stderr', (stderr) => {
      console.error('⚠️ Python stderr:', stderr);
    });

    shell.end((err, code, signal) => {
      const endTime = Date.now();
      console.log(`⏱️ Python took ${endTime - startTime}ms`);

      if (err) {
        console.error('❌ Python Error:', err);
        return res.status(500).json({
          success: false,
          error: 'Prediction failed',
          details: err.message
        });
      }

      if (output.length === 0) {
        console.error('❌ No output from Python');
        return res.status(500).json({
          success: false,
          error: 'No response from Python script'
        });
      }

      console.log('✅ Python response:', output[0]);

      const result = output[0];
      
      res.json({
        success: true,
        data: {
          sentiment: result.sentiment,
          confidence: result.confidence,
          text: text
        }
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for ${process.env.FRONTEND_URL}`);
});
