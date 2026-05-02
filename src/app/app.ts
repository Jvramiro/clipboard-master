import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClipboardService } from './services/clipboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  statusMessage = '';

  constructor(private clipboardService: ClipboardService) {}

  async pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.clipboardService.save(text).subscribe(() => {
        this.statusMessage = 'Clipboard saved';
      });
    }
    catch {
      this.statusMessage = 'Clipboard not saved';
    }
  }

  copyClipboard() {
    this.clipboardService.get().subscribe(async (data) => {
      if(data?.text){
        await navigator.clipboard.writeText(data.text);
      }
      else{
        this.statusMessage = 'There is no available data'
      }
    })
  }
}
