

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Generación de la Facturación Electrónica para los asegurados de EMPRESA ARAUCA. |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora de Implementación / PO Proyecto CA BRASILIA. |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Se genere la facturación electrónica a los asegurados del Programa BRASILIA. |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Cumplir con la normativa de entregar la factura a los clientes que adquieren el seguro por medio de los canales del sponsor. |

3. **DETALLE DEL DESARROLLO SOLICITADO**   
   1. Disparar la Facturación Electrónica **al asegurado** en el momento que se genera la emisión por API sin validación de listas y, en consecuencia, la creación del recaudo.

   

   2. Se debe incluir el sponsor en el reporte de Facturación Electrónica que actualmente existe en SIPA, manteniendo la lógica de este. A continuación, se detallan las pantallas de SIPA donde se obtiene el reporte:

   ![][image1]

   ![][image2]

   ![][image3]

   3. El texto dinámico de la FE para este sponsor debe ser: *Esta factura ha sido emitida de acuerdo con el pago realizado para la póliza adquirida por medio de los canales de EMPRESA ARAUCA S.A.* 

   ![][image4]

   

   

4. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
   1. Revisión en conjunto con Stratio del ajuste que se debe realizar por dicha célula para poder entregar la factura al cliente. Reunión 13 de enero en la tarde.   
   2. Dylan Poveda nos apoya validando sí el proceso de FE desarrollado en Everest contempla envío en el proceso automático el 1 de cada mes, de recaudos que fallaron envío a FE. De lo contrario se debe validar con el equipo de operaciones una HU transversal para realizar reintento de envío de recaudo a FE por cualquier fallo.

   

5. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
   1. HU Envío texto dinámico por sponsor en la impresión de la FE.  
   2. HU 1337 Emisión de pólizas por medio de API en SIPA Banca con vigencia por horas y recaudo automático Sponsor BRASILIA. – Dependencia de **finalización desarrollo.**  
   3. Para poder probar, es necesario contar con la marcación de las pólizas matrices en Stratio para que el asegurado reciba la factura y no se genere el tomador. (Área de Impuestos SBS).   
   4. 

   

6. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación del desarrollo | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Con el fin de generar la FE a los asegurados, se debe garantizar la entrega de la factura a cada uno de los clientes de acuerdo con la información del proceso de emisión-recaudo. | X | X |
| En el documento de FE se debe evidenciar el texto adicional parametrizado para este sponsor, de acuerdo con el punto 3.3. | X | X |
| En la malla de consulta de SIPA se debe visualizar el sponsor para la descarga del reporte. | X | X |
| El reporte debe contener la información de FE generada para el sponsor.  | X | X |
| Que en la tabla *sbs.facturacion\_polizas\_sipa\_banca fpsb* se visualice el registro de la facturación electrónica | X | X |
| Cualquier falla que se presente en el proceso de Facturación Electrónica no debe impedir la emisión de la póliza. | X | X |

7. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Los actuales del sistema. | X | X |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | ----- | ----- |
|  |     X |     |

