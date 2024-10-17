/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import MistralClient from '@mistralai/mistralai';
import { Box, Button } from '@mui/material';
import ExpandableMarkdown from '../../../../components/ExpandableMarkdown';

const AI_ENABLED = true;
const AI_TYPE = 'mistralai';
const AI_ENDPOINT = 'http://127.0.0.1:8000';
const AI_TOKEN = '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';
const AI_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

const CLIENT = new MistralClient(AI_TOKEN, AI_ENDPOINT, 5, 240);

const AITextBox = () => {
  const queryFrontMistralAi = async (question: string) => {
    if (!CLIENT) {
      console.log('Incorrect AI configuration', { enabled: AI_ENABLED, type: AI_TYPE, endpoint: AI_ENDPOINT, model: AI_MODEL });
    }
    try {
      console.log('[AI] Querying MistralAI with prompt', { question });
      console.log(CLIENT);
      const response = (CLIENT as MistralClient)?.chatStream({
        model: AI_MODEL,
        messages: [{ role: 'user', content: question }],
        maxTokens: 100,
      });
      let content = '';
      if (response) {
        console.log('Got response');
        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of response) {
          console.log('got chunk');
          if (chunk.choices[0].delta.content !== undefined) {
            const streamText = chunk.choices[0].delta.content;
            content += streamText;
          }
        }
        return content;
      }
      console.log('[AI] No response from MistralAI: ', { question });
      return 'No response from MistralAI';
    } catch (err) {
      console.log('[AI] Cannot query MistralAI: ', { error: err });
      console.log(err);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `An error occurred: ${err.toString()}`;
    }
  };

  const [text, setText] = useState('');
  const question = 'Tell me why you are not working correctly right now in less than 50 words.';

  const handleOnClick = async () => {
    setText('Loading...');
    setText(await queryFrontMistralAi(question));
  };

  return (
    <Box>
      <Button
        onClick={handleOnClick}
        variant='outlined'
      >
        Generate AI Text
      </Button>
      <ExpandableMarkdown source={text} limit={300} />
    </Box>
  );
};

export default AITextBox;
