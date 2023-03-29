import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'openai';
import { CreateChatCompletionResponse, OpenAIApi } from 'openai/dist/api';
import { Chat } from './chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private OPENAI_API_KEY = '';
  private configuration: Configuration | null = null;
  private openAPI: OpenAIApi | null = null;

  private chats: Chat[] = [
    {
      text: 'Hello ! how can I assist you ?',
      isAssistant: true,
    }
  ];

  constructor(private http: HttpClient) {
    this.configuration = new Configuration({
      apiKey: this.OPENAI_API_KEY,
    });
    this.openAPI = new OpenAIApi(this.configuration);
  }

  getChats(): Chat[] {
    return this.chats;
  }

  addChat(chat: Chat): void {
    this.chats.push(chat);
  }

  clearChat() {
    this.chats = [];
  }

  async searchQuery(query: string) {
    const response = await this.openAPI?.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Who won the world series in 2020?' },
        {
          role: 'assistant',
          content: 'The Los Angeles Dodgers won the World Series in 2020.',
        },
        { role: 'user', content: 'Where was it played?' },
        { role: 'user', content: query },
      ],
    });
    if (response?.data) {
      const responseData: CreateChatCompletionResponse = response.data;
      if (
        responseData &&
        responseData.choices &&
        responseData.choices.length > 0
      ) {
        const chat: Chat = {
          isAssistant: true,
          text: responseData.choices[0].message?.content!,
        };
        this.chats.push(chat);
      }
    }
  }
}
