import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ModelToFormData } from '../core/helper/modelToFormData';
import { ApiService } from '../core/services/api.service';
import { SignalRService } from '../core/services/signalr.service';
import { pairwise, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public fg: FormGroup;
  public encodingInProgress = false;
  private hubConnectionBuilder!: HubConnection;

  private prevTextVal: string;
  private currentTextVal: string;

  constructor(
    private signalrService: SignalRService,
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){
    this.prevTextVal = ''
    this.fg = new FormGroup({
      text: new FormControl(''),
      encodedText: new FormControl('')
    })

    this.text.valueChanges.pipe(pairwise()).subscribe(([prev, current]) => {
      this.prevTextVal = prev
      this.currentTextVal = current

      if(current === '') {
        this.encodingInProgress = false;
        this.encodedText.setValue('')
        this.fg.updateValueAndValidity()
        return;
      }
      if(this.encodedText.value !== '') {
        this.process();
      }
    })

    this.encodedText.valueChanges.pipe(pairwise()).subscribe(([prev, current]) => {
      if(prev !=  current) {
        this.prevTextVal = this.currentTextVal
      }
    })
  }

  get text(): FormControl {
    return this.fg.controls['text'] as FormControl
  }

  get encodedText(): FormControl {
    return this.fg.controls['encodedText'] as FormControl
  }

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.getEncodedText();
  }

  process() {
    this.encodingInProgress = true;

    const fd = ModelToFormData.build(this.fg.getRawValue());
    this.api.post(`EncoderHub/EncodeText`, fd)
    .subscribe(() => {
      this.encodedText.setValue(this.signalrService.encodedText)
      this.fg.updateValueAndValidity()  
    })
  }

  cancelProcess() {
    this.text.setValue(this.prevTextVal)
    this.process()
    this.encodingInProgress = false;
  }
}
