

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Parametrización Producto DESEMPLEO MENSUAL para LULO BANK |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora de Implementación / PO Canales LULO BANK. |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Se requiere parametrización en SIPA de las caratulas del producto **Desempleo Mensual**, según las características plasmadas en el Deck ola 1 de LULO BANK. |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Iniciar la parametrización de producto para LULO BANK con el fin de activar la venta de productos por parte del sponsor. |

3. **DETALLE DEL DESARROLLO SOLICITADO** (A continuación, se describen los pasos que se deben seguir para implementar los ajustes)  
   1. Se requiere parametrizar el producto de Desempleo para LULO con sus respectivas condiciones según Deck.   
   2. Se debe tener en cuenta que cada producto/caratula tiene su condicionado aplicable el cual se encuentra especificado en el Deck de parametrización.  
   3. La información para parametrizar estos productos se encuentra como documento adjunto a esta HU, denominado *“20260120 Deck OLA 1 LULO\_MVillalba\_LCastelbanco”* que fue revisado en el refinamiento.  
   4. Los textos PDF aplicables a cada producto/caratula los encuentran en el documento adjunto a esta HU denominado *“Textos Producto Desempleo LULO 2025”*  
   5. Caratulas SISE (Póliza matriz):

| CARATULA LULO | RAMO COMERCIAL SBS | POLIZA SISE SBS | Periodo de facturación | Vigencia Desde | Vigencia hasta |
| :---: | :---: | :---: | :---: | :---: | :---: |
| LU00001 | 134 | 1000245 | Mensual | 01/03/2026 | 01/03/2027 |

   

   

   

   6. Con el fin de no mostrar el valor asegurado en la malla de consulta, para esto, marcar estos 2 productos en “false” (tabla producto\_plan) en las columnas  
* sin\_bsg  
* ver\_sum\_asegurada


4. **ACLARACIONES** (A continuación, detalle aspectos relacionados con el alcance de la historia de usuario u otro tipo de aclaraciones)  
* Se requiere que este producto cuente con las mismas funcionalidades que hoy en día cuenta el portafolio cargado en SIPA. (carga, consultas, reportes, descargas, envíos etc.)  
  * Reporte consolidado.  
  * Descarga de PDF.  
  * Envío de Welcome Kit.  
* Para la creación de cada caratula se debe tener en cuenta las diferentes características por producto. (Ramos comercial SBS, números caratulas, condicionados, planes, coberturas, sumas aseguradas, etc.) según Deck.  
* Se debe parametrizar tipo tasa porcentaje.  
* Para la parametrización se aclara que el tomador y pagador es LULO BANK.  
* Las ventas de este producto serán las reportadas por el sponsor por medio del consumo del API de Emisión sin validación de listas.  
* El nombre del condicionado mencionado en los textos es dinámico, depende de la parametrización del condicionado en el producto.  
* Estas caratulas van a generar notificación de bienvenida al asegurado: se probará en la HU de Notificación de bienvenida al cliente, en el alcance de esta HU no se contempla.  
* Coberturas: En la impresión del PDF debe conservar el orden de las coberturas establecido en el deck del producto.  
* Se debe validar para la aplicación del IVA, que el código del ramo técnico se encuentre en la tabla tp\_ramo\_impuesto  
* Este producto no debe disparar proceso de facturación electrónica: *“false”*  
* En esta HU no se validará el cargue de recaudos.  
* Posterior a esta HU, se levantará HU para que los reportes no muestren el valor asegurado.

5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
* Los textos serán entregados por la línea de negocio.


6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
   * Para poder probar el flujo, dependemos de la HU de Emisión para LULO.  
       
7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación de seguridad de información.  | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| El PDF que se descarga debe tener las coberturas relacionadas en el Deck adjunto a esta HU. | X | X |
| El PDF que se descarga debe tener las sumas aseguradas según cobertura relacionadas en el Deck adjunto a esta HU. | X | X |
| El PDF que se descarga debe tener los textos indicados para cada uno de los planes de esta caratula relacionados en el documento mencionado en el punto 3.4. | X | X |
| El nombre del clausulado visualizado en los textos del PDF de póliza debe ser paramétrico, e imprimir el nombre especificado en el deck para cada uno de los planes. | X | X |
| El PDF que se descarga debe tener los clausulados indicados para cada caratula en el Deck adjunto a esta HU. | X | X |
| La generación de la prima en el PDF debe estar de acuerdo con los valores suministrados en el Deck. | X | X |
| Se debe realizar el proceso de envío de correo de notificación al cliente con sus respectivos adjuntos cómo funciona para el programa hoy en día en venta nueva. | X | X |
| Se debe probar la emisión de pólizas para cada uno de los periodos de póliza core definidos en la HU. Se solicita adjuntar los PDF de Prueba en la HU y compartir con PO. | X | X |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información. | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| No tiene criterios específicos, se deben mantener los actuales utilizados por la compañía. | X |  |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | :---: | :---: |
|  | X |  |

| LINK DE LA GRABACIÓN |  |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | Enero 30 de 2026\. Febrero 03 de 2026\. Febrero 10 de 2026\. |
| :---- | :---- |

