import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pl_scorer';
  @ViewChild('buttonsContainer',{static:true}) buttonsContainer!:ElementRef;
  
  constructor(private renderer:Renderer2) { }


  AddScore(playerName: string) {
    // Prompt user for the player's score
    var playerScore = parseInt(prompt('Enter score for ' + playerName + ':')!);
    
    if (playerScore > 0 && playerScore < 100) {
      var currentScores = JSON.parse(localStorage.getItem(playerName)!);
      if (! currentScores) {
        currentScores = [];
      }
      currentScores.push(playerScore!);
      
      // Create entry in local storage
      localStorage.setItem(playerName, JSON.stringify(currentScores));
    } else {
      alert('Score must be between 1 and 99.');
    }
  }
  
  
  Remove() {      
    // Clear buttons
    Array.from(this.buttonsContainer.nativeElement.children).forEach(child => {
      this.renderer.removeChild(this.buttonsContainer.nativeElement, child);
    });
    
    // Clear browser local storage
    localStorage.clear();
    
  }
  
  
  loadPrevious() {
    // On startup, make buttons for anyone in browser local storage
    for (let i = 0; i < localStorage.length; i++) { 
      const playerName: string = localStorage.key(i)!;
      const button = this.renderer.createElement('button');
      this.renderer.appendChild(button, this.renderer.createText(playerName));
      this.renderer.listen(button,'click',() => this.AddScore(playerName));
      this.renderer.appendChild(this.buttonsContainer.nativeElement,button);
    } 
  
  }
  
  
  saveFile() {
    var lines = []
    for (let i = 0; i < localStorage.length; i++) { 
      var resultString = localStorage.getItem(localStorage.key(i)!);
      var line:string = localStorage.key(i)! + "," + resultString!.substring(1, resultString!.length-1) + '\n';
      lines.push(line);
    }
    let file = new Blob(lines, { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'putting-results.csv')
  }
  
  
  addPlayer() {
    // Prompt user for the name of the player
    var playerName = prompt("Enter new player's name:");
    
    if (playerName) {
      if (localStorage.getItem(playerName)!) {
        alert('Names cannot be duplicated.');
      } else {
      const button = this.renderer.createElement('button');
      //this.renderer.setStyle(button,'background',color);
      this.renderer.appendChild(button, this.renderer.createText(playerName));
      this.renderer.listen(button,'click',() => this.AddScore(playerName!));
      this.renderer.appendChild(this.buttonsContainer.nativeElement,button);
      
      // Create entry in local storage
      localStorage.setItem(playerName, JSON.stringify([]));
      }
    }
  }
     
    
}


