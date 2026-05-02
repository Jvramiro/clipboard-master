import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ClipboardService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  save(text: string){
    return this.http.post(`${this.apiUrl}/clipboard`, { text });
  }

  get(){
    return this.http.get<{ text: string }>(`${this.apiUrl}/clipboard`);
  }

}