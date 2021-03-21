import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PaisSmall, Pais } from '../interface/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private baseUrl : string = 'https://restcountries.eu/rest/v2'; 

  private _regiones : string [] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http :HttpClient) { }


  getPaisesPorRegion(region : string) : Observable<PaisSmall[]>{
    const url : string = `${this.baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall[]>(url)
  }

  getPaisPorCodigo(codigo : string) :  Observable<Pais | null>{
    if(!codigo){
      return of(null);
    }
    const url = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url)
  }


  getPaisPorCodigoSmall(codigo : string) :  Observable<PaisSmall>{

    const url = `${this.baseUrl}/alpha/${codigo}?fields=alpha3code;name`;
    return this.http.get<PaisSmall>(url)
  }

  getPaisesPorCodigos (borders: string[]): Observable<PaisSmall[]>{
    if (!borders) {
        return of([]);
    }

    const peticiones : Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion)
    });

    return combineLatest(peticiones)
  }
}
