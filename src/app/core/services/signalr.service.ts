import { Injectable } from "@angular/core";
import { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder } from "@microsoft/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";

@Injectable({
    providedIn: 'root'
})

export class SignalRService {
    private hubConnection: HubConnection
    public encodedText: any;

    public startConnection() {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('https:localhost:7004/encoded-text')
        .configureLogging(LogLevel.Information).build();

        this.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }

    getEncodedText() {
        let res = ''
        this.hubConnection.on('SendEncodedTextAsync', result => {
            this.encodedText = result;
        })
        
    }
}