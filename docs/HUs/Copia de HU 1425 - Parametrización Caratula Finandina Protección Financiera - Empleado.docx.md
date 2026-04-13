

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Configuración Parametrización de pólizas Protección Financiera para empleados 1000241 y 1000242 de Finandina.  |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Canales Alternativos- Financial / director de Implementación |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Quiero contar con la parametrización de producto (planes) de protección Financiera voluntario 1000241 y 1000242\.  |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Vender pólizas de Vida grupo voluntario con tasa más competitiva y masificar el negocio. |

3. **DETALLE DEL DESARROLLO SOLICITADO** (A continuación, se describen los pasos que se deben seguir para implementar los ajustes)

1. Se requiere parametrizar las Caratulas de Protección Financiera para Empleados con sus respectivas condiciones según DECK

2. Se debe tener en cuenta que cada caratula tiene su condicionado aplicable el cual se encuentra especificado en el Deck de parametrización. 

3. Se requiere que este producto cuente con las funcionalidades de carga, consultas, reportes (vigentes) y descargas. (emisión mediante Carga, consultas, reportes de recaudos, facturación, el reporte consolidado, reporte de notificaciones enviadas por mail, reporte de moras, descargas, envío.)

4. La información para parametrizar estos productos se encuentra en SIPA en el siguiente enlace:

5. [Deck Ola 2 Finandina Desempleo 29122025.xlsx](https://sbseguros.sharepoint.com/:x:/r/Sites/Innovacion/sipa/Definiciones%20y%20requerimientos/1.%20Parametrizaci%C3%B3n%20de%20productos/FINANDINA/Deck%20Ola%202%20Finandina%20%20Desempleo%2029122025.xlsx?d=w9ad6a2bf3b8c428c873a53f9f9df0ca5&csf=1&web=1&e=qmGHYk)

6. Los textos PDF aplicables a cada producto/caratula son los indicados en la siguiente ruta

   [20250205\_TEXTOS Protección Financiera \- Empleados.docx](https://sbseguros.sharepoint.com/:w:/r/Sites/Innovacion/sipa/Definiciones%20y%20requerimientos/1.%20Parametrizaci%C3%B3n%20de%20productos/FINANDINA/Textos/20250205_TEXTOS%20Protecci%C3%B3n%20Financiera%20-%20Empleados.docx?d=w1ebd504bb1fa463f9795699cd5aff475&csf=1&web=1&e=tCf23L)

   

7. El valor asegurado será el valor de la cuota reportado por el Sponsor y este se mantendrá por la vigencia de la financiación, que será reportado por Finandina en el reporte mensual de facturación (ingesta)   
8. Para la Caratula 1000241 Protección Financiera – vehículo, el valor de prima se realizará por Tasa de acuerdo con el Deck, según el valor reportado por Finandina.   
9. Para la Caratula 1000242 Protección Financiera – TC, el valor de prima será fijo de acuerdo con Deck.  
10. Se debe usar el template de desempleo para ambas caratulas  
11. Confirmación póliza SISE. 

| POLIZA SISE | INICIO VIGENCIA | FIN DE VIGENCIA |
| :---: | :---: | :---: |
| 1000241 | 1/01/2026 | 1/01/2031 |
| 1000242 | 1/01/2026 | 1/01/2031 |

  


4. **ACLARACIONES** (A continuación, detalle aspectos relacionados con el alcance de la historia de usuario u otro tipo de aclaraciones)  
- El valor máximo asegurado en el programa para desempleo es de $300.000.000   
- Se solicitará la estructura de Carga universal para estas caratulas en otra HU   
- **TIPO DE PRORRATA:** Se deberá configurar el código \=1 (Año Calendario)  
  Diccionario de código \- Prorrata  
- 1= Año Calendario  
- 4= Mensual  
- 2= 360 días  
- 3= 365 días   
- Los textos a configurar son a nivel de caratula.  
- El reporte de asistencia y notificaciones de bienvenida se definirá en una nueva HU   
- La prima para el producto Protección Financiera – Vehículo vendrá calculada y reportada en la ingesta.


5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
     
6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
- Carga Universal de este producto  
7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| El PDF que se descarge debe tener las coberturas relacionadas en el DECK | X | X |
| El PDF que se descarge debe tener las sumas aseguradas según cobertura relacionadas en el DECK | X | X |
| El PDF que se descarge debe tener los textos indicados para esta caratula relacionados en los TEXTOS PDF | X | X |
| El PDF que se descarge debe tener los condicionados indicado para cada caratula en el Deck | X | X |
| SIPA BANCA deberá validar la edad de permanencia en el proceso de renovación según lo descrito en el Deck. | X | X |
| Las caratulas deberán contar con la validación de edades de ingreso y permanencia. | X | X |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | ----- | ----- |
| No tiene criterios especificas, se deben mantener los actuales utilizados por la compañia. |  |  |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | :---: | :---: |
|  |  |  |

| LINK DE LA GRABACIÓN | [Resumen: REFINAMIENTO \- CÉLULA SOFKAmartes, 6 enero | Reunión | Microsoft Teams](https://teams.microsoft.com/l/meetingrecap?driveId=b%21Ij1lKl3FE0ieQAZassDsnoZEFUT8Ij5BoEcKWHFR5YnFFbefL8jjRodPorFNRAg7&driveItemId=01T6WMCDEQAEGUOZCOL5CJP43WU6EFWICJ&sitePath=https%3A%2F%2Fsbseguros-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fluisa_rojas_sbseguros_co%2FIQCQAQ1HZE5fRJfzdqeIWyBJAcJmynhbx9b7xBWOOuSr8W0&fileUrl=https%3A%2F%2Fsbseguros-my.sharepoint.com%2Fpersonal%2Fluisa_rojas_sbseguros_co%2FDocuments%2FRecordings%2FREFINAMIENTO%2520-%2520C%25C3%2589LULA%2520SOFKA-20260106_111257-Grabaci%25C3%25B3n%2520de%2520la%2520reuni%25C3%25B3n.mp4%3Fweb%3D1&iCalUid=040000008200E00074C5B7101A82E00807EA01060085464C881DDC01000000000000000010000000B59F4024EB1C934DB138EA339D982F78&masterICalUid=040000008200E00074C5B7101A82E008000000000085464C881DDC01000000000000000010000000B59F4024EB1C934DB138EA339D982F78&threadId=19%3Ameeting_M2ZhZGRlMjUtNzFkYy00ZDAzLWI2YWEtNGY2MmQzNWVjYTlh%40thread.v2&organizerId=00447f18-b0da-49df-be95-71af95e8cdb4&tenantId=51d5d77c-4cfa-44aa-988f-d5f189274da5&callId=c08783ae-ecbd-47ad-a518-e080e1e0c539&threadType=Meeting&meetingType=Recurring&subType=RecapSharingLink_RecapCore) |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | 30/12/2025 |
| :---- | :---- |

