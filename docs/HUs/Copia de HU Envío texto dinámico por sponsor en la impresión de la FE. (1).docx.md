

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Envío texto dinámico por sponsor en la impresión de la FE. |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora de Implementación / PO Proyecto CA BRASILIA. |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Enviar el texto parametrizado en SIPA a MS de FE de Stratio para que aparezca en la impresión de la factura entregada al asegurado. |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Entregar la FE al asegurado con la información correcta del sponsor por el cual adquirió el seguro. |

3. **DETALLE DEL DESARROLLO SOLICITADO**   
   1. Parametrizar texto dinámico por sponsor para envío al proceso de facturación electrónica en Stratio.  
   2. Para el sponsor Rappi, el texto dinámico debe ser el siguiente: *Esta factura ha sido emitida de acuerdo con el pago realizado para su póliza, po medio de su intermediario de seguros RAPPI*.  
   3. Se debe enviar al MS de Stratio el texto parametrizado y solicitado en el punto 3.1. 

   

4. **ACLARACIONES**   
   1. Para definir la estructura del consumo, se debe consultar con líder técnico para coordinar con Stratio.  
   2. La generación de la FE se probará en las HU de cada uno de los sponsors.   
   3. En el alcance de la presente HU se debe probar el flujo de FE para el sponsor Rappi. Su emisión es por API y su recaudo es a través de carga universal.  
   4. SOFKA genera documentos con las claridades técnicas entregadas por SBS.  
   5. Se adjunta estructura Rappi para la prueba.

   

5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
   1. No quedan temas pendientes.

   

6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
   1. Para pruebas: HU Stratio (PO confirma nombre).

    

7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación del desarrollo | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Dado que es un ajuste transversal y el sponsor que actualmente genera FE es Rappi, se debe garantizar que el documento generado para Rappi evidencie el texto mencionado en el punto 3.2.  | X | X |
|  |  |  |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Los actuales del sistema. | X | X |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | ----- | ----- |
|  |     X |     |

| LINK DE LA GRABACIÓN |  [Resumen: REFINAMIENTO \- CÉLULA SOFKAmartes, 20 enero | Reunión | Microsoft Teams](https://teams.microsoft.com/l/meetingrecap?driveId=b%21Ij1lKl3FE0ieQAZassDsnoZEFUT8Ij5BoEcKWHFR5YnFFbefL8jjRodPorFNRAg7&driveItemId=01T6WMCDEZ65BBJWFMQVBY4EVPH4TLKQ7V&sitePath=https%3A%2F%2Fsbseguros-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fluisa_rojas_sbseguros_co%2FIQCZ90IU2KyFQ44Srz8mtUP1AS0tgrprj5PRiOjhYzAkQxY&fileUrl=https%3A%2F%2Fsbseguros-my.sharepoint.com%2Fpersonal%2Fluisa_rojas_sbseguros_co%2FDocuments%2FRecordings%2FREFINAMIENTO%2520-%2520C%25C3%2589LULA%2520SOFKA-20260120_110633-Grabaci%25C3%25B3n%2520de%2520la%2520reuni%25C3%25B3n.mp4%3Fweb%3D1&iCalUid=040000008200E00074C5B7101A82E00807EA01140085464C881DDC01000000000000000010000000B59F4024EB1C934DB138EA339D982F78&masterICalUid=040000008200E00074C5B7101A82E008000000000085464C881DDC01000000000000000010000000B59F4024EB1C934DB138EA339D982F78&threadId=19%3Ameeting_M2ZhZGRlMjUtNzFkYy00ZDAzLWI2YWEtNGY2MmQzNWVjYTlh%40thread.v2&organizerId=00447f18-b0da-49df-be95-71af95e8cdb4&tenantId=51d5d77c-4cfa-44aa-988f-d5f189274da5&callId=0ff5b4ff-8306-4086-b90c-795de7049964&threadType=Meeting&meetingType=Recurring&subType=RecapSharingLink_RecapCore) |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | Enero 20 de 2026\. |
| :---- | :---- |

