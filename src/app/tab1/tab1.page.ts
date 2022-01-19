import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  list: Hotel[]=[];
  token='';
  nameDevice='mobile';
  constructor(private readonly http: HttpClient) {
  }
  ngOnInit(): void {
  }
  webSockets(): void{
    const ws = new WebSocket(`ws://localhost:8060/ws/${this.token}/${this.nameDevice}`);
    ws.onopen = (e)=> {
        console.log('[open] Conexión establecida');
    };
    ws.onmessage = (event) => {
      debugger
      console.log(event.data);
      this.list = JSON.parse(event.data) as Hotel[];
    };
  }
  async get(): Promise<void>{
    const data = {
      idTransaction: '1',
      parameters: {
          nombre: 'decameron',
          additionalProp2: '2',
          additionalProp3: '3'
      },
      notificationToken: this.nameDevice
    };
    this.http.post<string>('http://localhost:8061/api/busqueda/iniciar',data,this.createDefaultOptions())
    .subscribe((e)=>{
      console.log(e);
      this.token = e.toString();
      this.webSockets();
    });
  }
  public createDefaultOptions(): any {
        return {
            headers: new HttpHeaders({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            })
        };
    }
}
interface Hotel{
  nombre: string;
  descripcion: string;
  puntaje: number;
  latitud: number;
  longitud: number;
}