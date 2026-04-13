

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | HU Creación Sponsor LULO BANK en SIPA Banca |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Directora Implementación CA / PO Proyecto LULO |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Registrar el Sponsor LULO BANK S.A. en SBS-api-file-processing y Sipa-Banca |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Contar con la correcta relación del presente sponsor, en las futuras parametrizaciones de producto y generación de reportes. |

3. **DETALLE DEL DESARROLLO SOLICITADO** (A continuación, se describen los pasos que se deben seguir para implementar los ajustes)

**Creación de Sponsor**

	Se requiere la creación del siguiente Sponsor en la tabla TP\_Sponsor

- Razón Social: LULO BANK S.A.  
- Nit: 901.383.474-9  
- Teléfono 1: 6175000  
- Dirección: Carrera 7 N. 71-52 Piso 19 Torre B. Bogotá, Cundinamarca, Colombia.  
- Correo: [contacto@lulobank.com](mailto:contacto@lulobank.com) 

La creación del Sponsor deberá ser para SBS-api-file-processing y Sipa-Banca

4. **ACLARACIONES** (A continuación, detalle aspectos relacionados con el alcance de la historia de usuario u otro tipo de aclaraciones)  
* En la tabla TP\_Sponsor   
* Solicitar a Líder Técnico el campo “key\_sponsor”  
* limite\_asegurado: vacio. No se valida cúmulo en venta nueva.  
* Notificación de No inclusión por la edad en el momento de la apertura del seguro (falle el proceso de validación en el proceso digital del sponsor): En la parametrización del sponsor el *“flag: validacion\_edades\_correo” \= true.*  
* Validar con Impuestos si se salta el impuesto para San Andrés teniendo en cuenta que es un proceso de venta digital: *“Se valida y confirma que se debe aplicar el impuesto a todas las ventas recibidas.”*  
* ¿API solicita o no el número identificador de la póliza en LULO? Queda en false. Si van a manejar código único debo confirmarlo:” *Si, LULO maneja código único para la póliza que se deriva del número del crédito. En la revisión técnica que tendremos en el transcurso de la semana del 9 al 13 de febrero abordaremos este tema.”*

5. **TEMAS PENDIENTES** (Mencione si se encuentran entregables pendientes para el desarrollo de esta historia de usuario)  
* Creación del correo electrónico en SBS: [envioslulo@sbseguros.co](mailto:envioslulo@sbseguros.co) – Operaciones.

6. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO** (nombre, a continuación, las historias de usuario que deben desarrollarse antes para poder hacer esta)  
* No aplica

7. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación del desarrollo | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Se debe evidenciar en la tabla TP\_Sponsor el registro del Sponsor LULO BANK S.A. con los datos de Razón Social, NIT, Teléfono y Dirección. | X | X |

8. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN** (Características que un producto debe cumplir en términos de seguridad de la información)

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| No tiene criterios específicos, se deben mantener los actuales utilizados por la compañía. | X | X |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | :---: | ----- |
|  | X |  |

| LINK DE LA GRABACIÓN |  |
| :---- | :---- |

| FECHA DE REFINAMIENTO: | Enero 30 de 2025\. |
| :---- | :---- |

