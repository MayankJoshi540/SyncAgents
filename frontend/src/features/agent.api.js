const MSG_PREFIX = 'syncagents_messages_';

export const sendPrompt = async (formData) => {
  const conversationId = formData.get('conversationId');
  const prompt = formData.get('prompt');
  const agent = formData.get('agent');
  const file = formData.get('file');

  // Simulate networking delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let answer = `I've received your prompt: "${prompt}". Since the microservice backend is currently being set up, I am responding in interactive mock mode. How can I assist you further?`;
  let artifacts = null;
  let images = null;

  const lowerPrompt = prompt.toLowerCase();

  if (agent === 'coding' || lowerPrompt.includes('code') || lowerPrompt.includes('react') || lowerPrompt.includes('html') || lowerPrompt.includes('clock') || lowerPrompt.includes('calculator') || lowerPrompt.includes('ui') || lowerPrompt.includes('dashboard')) {
    answer = `Here is a custom web utility component built specifically for you. You can see it live in the Artifacts preview pane on the right!`;
    
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
    </style>
</head>
<body>
    <div class="bg-slate-800/80 border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center backdrop-blur-md">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">SyncAgents Interactive</h2>
        <p class="text-slate-400 text-sm mb-6">Real-time local sandbox execution environment</p>
        <div class="text-5xl font-mono tracking-wider text-blue-400 mb-6" id="display">00:00:00</div>
        <div class="flex justify-center gap-4">
            <button onclick="toggle()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all" id="btn-toggle">Start</button>
            <button onclick="reset()" class="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all">Reset</button>
        </div>
    </div>

    <script>
        let seconds = 0, timer = null;
        function updateDisplay() {
            let h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            let m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            let s = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('display').innerText = \`\${h}:\${m}:\${s}\`;
        }
        function toggle() {
            if (timer) {
                clearInterval(timer);
                timer = null;
                document.getElementById('btn-toggle').innerText = 'Start';
                document.getElementById('btn-toggle').className = 'bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all';
            } else {
                timer = setInterval(() => { seconds++; updateDisplay(); }, 1000);
                document.getElementById('btn-toggle').innerText = 'Pause';
                document.getElementById('btn-toggle').className = 'bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all';
            }
        }
        function reset() {
            clearInterval(timer);
            timer = null;
            seconds = 0;
            updateDisplay();
            document.getElementById('btn-toggle').innerText = 'Start';
            document.getElementById('btn-toggle').className = 'bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all';
        }
    </script>
</body>
</html>
    `.trim();

    if (lowerPrompt.includes('calculator')) {
      htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white flex items-center justify-center h-screen">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl w-72">
        <input type="text" id="result" readonly class="w-full bg-slate-950 text-right text-3xl font-mono p-4 rounded-2xl mb-4 border border-slate-800 text-blue-400 focus:outline-none" value="0">
        <div class="grid grid-cols-4 gap-2">
            <button onclick="clearScreen()" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold">C</button>
            <button onclick="press('/')" class="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">/</button>
            <button onclick="press('*')" class="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">*</button>
            <button onclick="press('-')" class="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">-</button>
            
            <button onclick="press('7')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">7</button>
            <button onclick="press('8')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">8</button>
            <button onclick="press('9')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">9</button>
            <button onclick="press('+')" class="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold row-span-2">+</button>
            
            <button onclick="press('4')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">4</button>
            <button onclick="press('5')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">5</button>
            <button onclick="press('6')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">6</button>
            
            <button onclick="press('1')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">1</button>
            <button onclick="press('2')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">2</button>
            <button onclick="press('3')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">3</button>
            <button onclick="calculate()" class="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold">=</button>
            
            <button onclick="press('0')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl col-span-2">0</button>
            <button onclick="press('.')" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl">.</button>
        </div>
    </div>
    <script>
        const res = document.getElementById('result');
        function press(val) { if(res.value === '0') res.value = ''; res.value += val; }
        function clearScreen() { res.value = '0'; }
        function calculate() { try { res.value = eval(res.value); } catch { res.value = 'Error'; } }
    </script>
</body>
</html>
      `.trim();
    }

    artifacts = [{
      _id: Math.random().toString(36).substr(2, 9),
      title: lowerPrompt.includes('calculator') ? 'Calculator Tool' : 'Stopwatch Component',
      files: [{ name: "index.html", content: htmlContent }]
    }];
  } else if (agent === 'image' || lowerPrompt.includes('image') || lowerPrompt.includes('draw') || lowerPrompt.includes('generate')) {
    answer = `Here is the image generated based on your description: "${prompt}"`;
    images = ['https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 1000)];
  } else if (agent === 'pdf' || lowerPrompt.includes('pdf') || lowerPrompt.includes('document')) {
    answer = `I have compiled the requested information into a PDF document. You can download it directly.`;
  } else if (agent === 'ppt' || lowerPrompt.includes('ppt') || lowerPrompt.includes('presentation') || lowerPrompt.includes('slides')) {
    answer = `Here is your dynamic PowerPoint deck representing: "${prompt}".`;
  }

  // Retrieve past messages and append
  const key = MSG_PREFIX + conversationId;
  const oldData = localStorage.getItem(key);
  const messages = oldData ? JSON.parse(oldData) : [];

  // Append user message
  messages.push({ role: 'user', content: prompt });

  // Append assistant message
  const assistantMsg = { role: 'assistant', content: answer, images, artifacts };
  messages.push(assistantMsg);

  // Save back to localStorage
  localStorage.setItem(key, JSON.stringify(messages));

  return assistantMsg;
};
