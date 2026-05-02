import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, signal } from '@angular/core';
import { ClipboardService } from './services/clipboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy{
  inputText = '';
  serverText = '';
  private eventSource!: EventSource;

  constructor(private clipboardService: ClipboardService, private cdr: ChangeDetectorRef) {
    this.loadData();
    this.eventSource = this.clipboardService.listenForUpdates(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.eventSource.close();
  }

  loadData(){
    this.clipboardService.get().subscribe((data) => {
      this.serverText = data?.text ?? '';
      this.cdr.detectChanges();
    });
  }

  async pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.clipboardService.save(text).subscribe(() => {
        this.loadData();
      });
    }
    catch { }
  }

  copyClipboard() {
    this.clipboardService.get().subscribe(async (data) => {
      if(data?.text){
        await navigator.clipboard.writeText(data.text);
        this.loadData();
      }
    });
  }

  sendText() {
    if (!this.inputText.trim())
      return;

    this.clipboardService.save(this.inputText).subscribe(() => {
      this.serverText = this.inputText;
      this.inputText = '';
      this.loadData();
    });
  }

}
