

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Emisión de pólizas por medio de API en SIPA Banca y recaudo automático para LULO BANK. |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora de Implementación / PO Proyecto BRASILIA. |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Emitir pólizas de las ventas recibidas por API de PRIMA ÚNICA en SIPA Banca para el Sponsor LULO y activar el recaudo automático para la Caratula LU00002. |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Activar la emisión por API de las pólizas entregadas por LULO con el fin de administrar el negocio por SIPA Banca. |

3. **DETALLE DEL DESARROLLO SOLICITADO** (A continuación, se describen los pasos que se deben seguir para implementar los ajustes)  
     
   **Emisión de póliza**  
   1. Activar la emisión por API de las pólizas que LULO reporte por medio del consumo del *API de Emisión* bajo la **carátula LU00002 correspondiente al Sponsor y Tomador LULO BANK**, cuyas pólizas tienen vigencia abierta, es decir, que para este caso práctico las llamaremos PRIMA ÚNICA.   
   2. Debe contar con las funcionalidades de emisión por API, consulta de pólizas y descargas del certificado póliza cómo funciona actualmente.  
   3. Se deben tener en cuenta los puntos de desarrollo levantados en la HU SOF-1784.

   

   **Procesamiento recaudo automático**

* El recaudo será aplicado a cada cuota según la parametrización del plan de cada carátula, para este caso, es sólo 1 cuota ya que es pago único para el producto parametrizado para LULO bajo la caratula LU00002. Este recaudo se aplica siempre y cuando la póliza se encuentre emitida en la novedad “AP”.  
    
  4. Validar que si se presenta algún error en la emisión en el procesamiento del recaudo debe mapearse en el log de errores del API de emisión, la póliza debe ser emitida.

4. **ACLARACIONES** (A continuación, detalle aspectos relacionados con el alcance de la historia de usuario u otro tipo de aclaraciones)  
   1. Para el Sponsor LULO se realizará la emisión por API sin validación de listas.  
   2. Desde la emisión por API debe tomar el recaudo y con esta información hacer el calculo para que se evidencie en el reporte de facturación. HU EV 5614\.  
   3. Los recaudos de LULO deben descargarse en el reporte de recaudos que ya se encuentra creado en SIPA Banca. Teniendo en cuenta la HU Omega 5787\.  
   4. Esta funcionalidad se tiene en cuenta en este caso por ser un programa con pago único y recaudo anticipado, es decir, que las emisiones que se hagan en SIPA son registros de pólizas con primas ya recaudadas entregados por el sponsor.  
   5. El cálculo de la prima total (vigencia completa) calculado por el sistema en el momento de la emisión de las ventas nuevas para el sponsor LULO, dicho valor se deberá almacenar en la tabla *syli.poliza\_riesgo\_cuota\_recaudo\_ev* y afecta *syli.poliza\_riesgo\_cuota y syli.poliza\_riesgo\_cuota \_ev*   
   6. El proceso de recaudo automático no deberá generar registros en los siguientes log’s:   
- Log de errores procesamiento de recaudos.  
- Log de reporte de recaudos realizados.  
- Log de reporte de recaudos no recaudados.  
  7. En el reporte de moras se validará si se encuentran pólizas que presentron error en la aplicación del recaudo, es decir, si aparecen registros de pólizas en el reporte es porque se generó error.  
  8. Si se presenta error en el procesamiento del recaudo, se debe continuar con el proceso de emisión, no es bloqueante.  
  9. El alcance de esta HU no contempla errores que se puedan encontrar en los reportes de recaudos ni facturación.  
  10. El procesamiento de recaudo en la emisión se desarrolla como un paso/subpaso el cual se ejecute sí se encuentra activo el parámetro en el producto tabla *producto\_plan*.  
  11. Esta información de recaudos debe evidenciarse en la malla en la opción “Aniversarios”, tal como se encuentra la lógica actual en SIPA BANCA:

  ![TablaDescripción generada automáticamente con confianza media][image1]

  12. Para este caso, no se generará facturación electrónica al asegurado.


5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
   1. No quedan temas pendientes.

6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
   1. Para pruebas: HU SOF-1784.  
   2. Para pruebas: HU SOF-1745.

7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterios de aceptación del desarrollo | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Dada la emisión de las pólizas por medio de API se debe activar el recaudo automático específica y únicamente para la caratula LU00002 del sponsor Lulo Bank. | X | X |
| En las tablas y malla de consulta se evidencien los recaudos después de la emisión. | X | X |
| Se evidencien en los reportes mencionados los recaudos automáticos. | X | X |
| El proceso de emisión no debe enviar Facturación Electrónica: A nivel de base de datos *producto\_plan* y *póliza\_riesgo\_cuota\_recaudo\_ev* debería estar en “false”. | X | X |
| Los recaudos no procesados se deben visualizar en el reporte de moras.  | X | X |
| Validar emisión del producto en PDF de acuerdo con el Deck, a nivel de prima, coberturas y sumas aseguradas. | X | X |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| No tiene criterios específicos, se deben mantener los actuales utilizados por la compañía | X | X |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | ----- | ----- |
|  |     X |     |

| LINK DE LA GRABACIÓN |   |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | Febrero 12 de 2026\. |
| :---- | :---- |

[image1]: <data:image/png;base64,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>