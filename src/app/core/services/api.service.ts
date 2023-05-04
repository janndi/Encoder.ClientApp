
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private httpClient: HttpClient;
  private headers: HttpHeaders;

  protected baseRoute: string;
  
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.headers = new HttpHeaders();

    if (environment.production) {
      this.baseRoute = 'api/';
    } else {
      this.baseRoute = 'https://localhost:7004/api/';
    }
  }

  get route() {
    return this.baseRoute;
  }

  get client() {
    return this.httpClient;
  }

  setHeader(key: string, value: string) {
    if (this.headers.has(key)) {
      this.headers = this.headers.set(key, value);
    } else {
      this.headers = this.headers.append(key, value);
    }
  }

  removeHeader(key: string) {
    this.headers = this.headers.delete(key);
  }

  get<T>(route: string, responseType: any = "json"): Observable<T> {
    return this.httpClient.get<T>(`${this.baseRoute}${route}`, {
      headers: this.headers,
      responseType: responseType
    });
  }

  post<Post>(route: string, payload: any = null, headers: HttpHeaders = null, responseType: any = "json"): Observable<Post> {
    let header = this.headers;

    if (headers != null) {
      headers.keys().forEach(key => {
        header = header.append(key, headers.get(key));
      });
    }

    return this.httpClient.post<Post>(`${this.baseRoute}${route}`, payload, {
      headers: header,
      responseType: responseType
    });
  }

  put<T>(route: string, payload: any = null, headers: HttpHeaders = null, responseType: any = "json"): Observable<T> {
    let header = this.headers;

    if (headers != null) {
      headers.keys().forEach(key => {
        header = header.append(key, headers.get(key));
      });
    }

    return this.httpClient.put<T>(`${this.baseRoute}${route}`, payload, {
      headers: header,
      responseType: responseType
    });
  }

  delete<T>(route: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseRoute}${route}`, {
      headers: this.headers
    });
  }
}
