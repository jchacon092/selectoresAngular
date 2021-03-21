import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall, Pais } from '../../interface/paises.interface';
import {switchMap, tap}  from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  
  miFormulario : FormGroup = this.fb.group({
    region: ['',Validators.required],
    pais : ['', Validators.required],
    frontera : ['', Validators.required]
  })

  regiones : string[] = [];
  paises : PaisSmall[] = [];
  fronteras : PaisSmall[] = [];

  cargando : boolean = false;
 

  constructor(private fb : FormBuilder,
              private paisesService : PaisesServiceService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //cuand cambia region
 /*    this.miFormulario.get('region')?.valueChanges.subscribe(region =>{
      console.log(region)

      this.paisesService.getPaisesPorRegion(region)
        .subscribe(paises => {
          console.log(paises)
          this.paises = paises;
        })
    }) */

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),switchMap(region => this.paisesService.getPaisesPorRegion(region)))
    .subscribe( paises => {
      console.log(paises);
      this.paises = paises;
      this.cargando = false;
    })


    
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_) => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');

      }),
      switchMap(codigo=>this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
    .subscribe( paises =>{
      this.fronteras = paises;
      this.cargando = false;
    })


  }

  guardar(){
    console.log(this.miFormulario.value)
  }

}
