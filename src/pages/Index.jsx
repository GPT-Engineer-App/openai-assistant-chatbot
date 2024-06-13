import React, { useState } from 'react';
import { Box, Button, Container, Input, Text, VStack } from '@chakra-ui/react';

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch('https://api.openai.com/v1/assistants/code-interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage = { sender: 'assistant', text: data.message };
      setMessages([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          {messages.map((msg, index) => (
            <Box key={index} alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'} mb={2}>
              <Text bg={msg.sender === 'user' ? 'blue.100' : 'gray.100'} p={2} borderRadius="md">
                {msg.text}
              </Text>
            </Box>
          ))}
        </Box>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} colorScheme="blue">
          Send
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;