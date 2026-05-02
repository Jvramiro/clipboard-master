import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  
  private apiUrl = `http://${window.location.hostname}:3000`;

  constructor(private http: HttpClient) {}

  listenForUpdates(onUpdate: () => void): EventSource {
    const source = new EventSource(`${this.apiUrl}/clipboard/events`);
    source.onmessage = () => onUpdate();
    return source;
  }

  getClipboard(){
    return this.http.get<{ text: string }>(`${this.apiUrl}/clipboard`);
  }

  sendClipboard(text: string){
    return this.http.post(`${this.apiUrl}/clipboard`, { text });
  }

  getFileInfo(){
    return this.http.get<{ originalName: string }>(`${this.apiUrl}/file/info`);
  }

  getFileUrl(){
    return `${this.apiUrl}/file/download`;
  }

  sendFile(file: File){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean, originalName: string }>(`${this.apiUrl}/file`, formData);
  }

}