import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Bot } from 'lucide-react';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      let botResponseText = 'I am a chatbot designed to help with 6th to 12th-grade topics. Ask me about Math, Science, History, or Literature!';

      const lowerCaseInput = input.toLowerCase();

      // General greetings
      if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        botResponseText = 'Hello there! How can I assist you with your studies today?';
      } else if (lowerCaseInput.includes('how are you')) {
        botResponseText = 'I am just a program, but I am ready to help you learn!';
      } else if (lowerCaseInput.includes('name')) {
        botResponseText = 'I don\'t have a name. You can call me your Study Buddy.';
      } else if (lowerCaseInput.includes('help')) {
        botResponseText = 'I can provide information on various subjects for grades 6-12. Try asking about specific topics!';
      }
      // Math topics
      else if (lowerCaseInput.includes('algebra')) {
        botResponseText = 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols. In elementary algebra, those symbols (like a, b, x, y) represent quantities without fixed values, known as variables.';
      } else if (lowerCaseInput.includes('geometry')) {
        botResponseText = 'Geometry is a branch of mathematics concerned with the properties and relations of points, lines, surfaces, solids, and higher dimensional analogs.';
      } else if (lowerCaseInput.includes('calculus')) {
        botResponseText = 'Calculus is the mathematical study of continuous change, in the same way that geometry is the study of shape and algebra is the study of generalizations of arithmetic operations.';
      }
      // Science topics
      else if (lowerCaseInput.includes('photosynthesis')) {
        botResponseText = 'Photosynthesis is the process used by plants, algae, and certain bacteria to turn sunlight into chemical energy.';
      } else if (lowerCaseInput.includes('gravity')) {
        botResponseText = 'Gravity is a fundamental force of nature that attracts any two objects with mass. On Earth, it causes objects to fall towards the ground.';
      } else if (lowerCaseInput.includes('periodic table')) {
        botResponseText = 'The periodic table is a tabular display of the chemical elements, which are arranged by atomic number, electron configuration, and recurring chemical properties.';
      }
      // History topics
      else if (lowerCaseInput.includes('world war 1') || lowerCaseInput.includes('ww1')) {
        botResponseText = 'World War I, also known as the Great War, was a global war that lasted from 1914 to 1918. It involved the Central Powers and the Allies.';
      } else if (lowerCaseInput.includes('ancient rome')) {
        botResponseText = 'Ancient Rome was an ancient Italic civilization that began in the 8th century BC. It grew from a small agricultural community to a vast empire.';
      }
      // Literature topics
      else if (lowerCaseInput.includes('shakespeare')) {
        botResponseText = 'William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world\'s greatest dramatist.';
      } else if (lowerCaseInput.includes('novel')) {
        botResponseText = 'A novel is a long prose narrative, which describes fictional characters and events, usually in the form of a sequential story.';
      }
      // Default response
      else {
        botResponseText = 'I am still learning! Can you ask me something about Math, Science, History, or Literature for grades 6-12?';
      }

      const botResponse = { text: botResponseText, sender: 'bot' };
      
      // Simulate a small delay for a more natural feel
      await new Promise(resolve => setTimeout(resolve, 500)); 

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage = { text: 'Sorry, I am having trouble responding.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Doubt Solver</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 p-2 overflow-y-auto h-64">
        {messages.map((msg, index) => (
          <div key={index} className={`my-1 p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chatbot;