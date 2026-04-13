

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Emisión de pólizas por medio de API en SIPA Banca para LULO BANK (sin recaudo automático). |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora de Implementación / PO Proyecto BRASILIA. |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Emitir pólizas de las ventas recibidas por API con vigencia MENSUAL en SIPA Banca para el Sponsor LULO |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Activar la emisión por API de las pólizas entregadas por LULO con el fin de administrar el negocio por SIPA Banca. |

3. **DETALLE DEL DESARROLLO SOLICITADO** (A continuación, se describen los pasos que se deben seguir para implementar los ajustes)  
     
   1. Activar la emisión por API de las pólizas que LULO reporte por medio del consumo del *API de Emisión* bajo la **carátula LU00001 correspondiente al Sponsor y Tomador LULO BANK**, cuyas pólizas tienen vigencia abierta.   
   2. Se modifique el control para el recaudo automático en la emisión validando en la tabla *producto\_plan* nueva columna (recaudo\_automatico) y no a nivel de sponsor *tp\_controles\_sponsor*.  
   3. Nota técnica: Nota Técnica: Se debe utilizar para esta validación los artefactos de SimpleProductPlan  
   4. Modificar Handler del recaudo en la emisión.  
   5. Validar los sponsors que tienen recaudo automático, y hay que crear un script para marcar los productos que pertenecen a ese sponsor con el nuevo campo en *producto\_plan* en *“true”*  
* Bancamia.  
* Mibanco.  
* Kredit.  
* Solux.  
* Brasilia.  
* UNITRASNCO.  
* Empresa Arauca.  
* Bancolombia.  
  6. Ajuste en tarifación por suma asegurada dependiendo del periodo cobro (Se recibe suma asegurada cuota mensual). Modelo HU OMEGA-9246, creación campo en producto\_plan (lógica en fun\_tarificador\_vida).   
  7. Agregar sponsor LULO BANK en el perfilamiento administrador para poder visualizarlo en la malla de consulta de SIPA Banca.  
  8. Se debe validar y/o ajustar el proceso de emisión para productos con tarifación por tasa, en donde el cálculo de la prima se prorratee de  acuerdo a la vigencia abierta (fun\_tarificador\_vida)

4. **ACLARACIONES** (A continuación, detalle aspectos relacionados con el alcance de la historia de usuario u otro tipo de aclaraciones)  
   1. Para el Sponsor LULO se realizará la emisión sin validación de listas.  
   2. Especificamente la caratula mencionada en esta HU \<LU00001\> **NO** se debe activar recaudo automático.   
   3. Debe contar con las funcionalidades de emisión por API, consulta de pólizas y descargas del certificado póliza cómo funciona actualmente.  
   4. La emisión del Sponsor LULO si genera envío de notificación al asegurado (welcome kit) que se desarrollará y probará en otra HU.   
   5. En la prueba de esta HU no contempla envío Welcome Kit, el pdf se deberá descargar desde la malla de consulta.

   

   

5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
   1. Confirmación de punto de desarrollo 3.6.

6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
   1. Para pruebas: HU 1678 Parametrización Desempleo MENSUAL.

7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterios de aceptación del desarrollo | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Dada la emisión por medio de API, se debe evidenciar la emisión de la póliza de acuerdo con la información que sea reportada por LULO. | X | X |
| La emisión de la póliza debe verse reflejada en la malla de consulta de SIPA Banca.  | X | X |
| Que continúe activo el recaudo automático para los sponsors mencionados en el punto 3.5. Prueba de regresión por sponsor. | X | X |
| Validar que en la tabla póliza\_cabecera se almacene el valor asegurado de la vigencia completa en:  \*syli.poliza\_cabecera.suma\_asegurada\_moneda\_local\*syli.poliza\_cabecera.suma\_asegurada\_moneda\_emision . (este criterio se debe validar si se realiza el ajuste mencionado en el punto 3.6) | X | X |
| Validar emisión del producto en PDF de acuerdo al Deck, a nivel de prima,  coberturas y sumas aseguradas. | X | X |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| No tiene criterios específicos, se deben mantener los actuales utilizados por la compañía | X | X |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | ----- | ----- |
|  |     X |     |

| LINK DE LA GRABACIÓN |   |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | Febrero 10 de 2026 |
| :---- | :---- |

