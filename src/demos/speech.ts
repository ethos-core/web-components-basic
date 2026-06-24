interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

export function setupSpeech() {
    const badge = document.getElementById('badge-speech')!;
    const output = document.getElementById('output-speech')!;
    const btnStart = document.getElementById('btn-speech-start') as HTMLButtonElement;
    const btnStop = document.getElementById('btn-speech-stop') as HTMLButtonElement;

    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        output.textContent = 'Web Speech API is not supported in this browser.';
        btnStart.disabled = true;
        return;
    }

    badge.textContent = 'Supported';
    badge.classList.add('supported');

    let recognition: any = null;
    const transcripts: string[] = [];

    const commands: Record<string, () => void> = {
        'dark mode': () => {
            document.body.classList.toggle('dark');
            output.textContent += '\n🌙 Dark mode toggled';
            },
        'scroll top': () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            output.textContent += '\n⬆️ Scrolled to top';
        },
    };

    btnStart.addEventListener('click', () => {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
    
        recognition.onstart = () => {
            output.textContent = '🎤 Listening... speak now';
            btnStart.disabled = true;
            btnStop.disabled = false;
        };
    
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript.trim();
    
          if (lastResult.isFinal) {
            transcripts.push(transcript);
            output.textContent = `Recognition result:\n${transcripts.join('\n')}`;
    
            Object.entries(commands).forEach(([keyword, action]) => {
              if (transcript.includes(keyword)) action();
            });
          } else {
            output.textContent =
              `Recognition result:\n${transcripts.join('\n')}` +
              `\n(Recognizing) ${transcript}`;
          }
        };
    
        recognition.onerror = (event: any) => {
            output.textContent = `❌ Recognition error: ${event.error}`;
            btnStart.disabled = false;
            btnStop.disabled = true;
        };
    
        recognition.onend = () => {
            btnStart.disabled = false;
            btnStop.disabled = true;
        };
    
        recognition.start();
    });
    
    btnStop.addEventListener('click', () => {
        recognition?.stop();
    });    
}
