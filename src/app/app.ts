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
  serverFileName = '';
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
    this.clipboardService.getClipboard().subscribe((data) => {
      this.serverText = data?.text ?? '';
      this.cdr.detectChanges();
    });

    this.clipboardService.getFileInfo().subscribe((data) => {
      this.serverFileName = data?.originalName ?? '';
      this.cdr.detectChanges();
    })
  }

  copyClipboard() {
    this.clipboardService.getClipboard().subscribe(async (data) => {
      if(data?.text){
        await navigator.clipboard.writeText(data.text);
        this.loadData();
      }
    });
  }

  async pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.clipboardService.sendClipboard(text).subscribe(() => {
        this.loadData();
      });
    }
    catch { }
  }

  sendTextToClipboard() {
    if (!this.inputText.trim())
      return;

    this.clipboardService.sendClipboard(this.inputText).subscribe(() => {
      this.serverText = this.inputText;
      this.inputText = '';
      this.loadData();
    });
  }

  uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event: any) => {
      const file: File = event.target.files[0];
      if (!file)
        return;

      this.clipboardService.sendFile(file).subscribe(() => {
        this.loadData();
      });
    }
    
    input.click();
  }

  downloadFile() {
    if (!this.serverFileName)
      return;

    window.open(this.clipboardService.getFileUrl(), '_blank');
  }

}
