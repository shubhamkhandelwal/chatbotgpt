import { Component, EventEmitter, OnInit } from '@angular/core';
import { Chat } from './chat';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  chatLoading: boolean = false;
  inputQuery: string = '';
  chats: Chat[] = [];
  constructor(private chatService: ChatService) {}
  
  ngOnInit(): void {
    this.chats = this.chatService.getChats();
  }

  sendQuery() {
    this.chatLoading = true;
    const chat: Chat  = {
      text: this.inputQuery,
      isAssistant: false
    }
    this.chatService.addChat(chat);
    this.chatService.searchQuery(this.inputQuery).then(response => {
      console.log(response);
      this.chatLoading = false;
    }).catch(error => {
      console.error(error)
      this.chatLoading = false;
    });
    this.inputQuery = '';
  }

  addInputQuery(event: Event) {
    this.inputQuery = (event.target as HTMLInputElement).value;
  }

  clearChat(): void {
    this.chatService.clearChat();
    this.chats = [];
  }
}
