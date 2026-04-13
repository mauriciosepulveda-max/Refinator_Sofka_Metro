

| NOMBRE DE HISTORIA DE USUARIO (Nombre que dé una noción general de lo que se quiere desarrollar) | Activación Carga Universal Recaudos Lulo Bank |
| :---- | :---- |

2. **REQUERIMIENTO** (Las historias de usuario suelen expresarse con una frase simple con la siguiente estructura: “Como \[perfil\], \[quiero\] \[para\].” Desglosemos esta estructura:

| Yo Como (“Como” \[perfil\]”: ¿para quién desarrollamos esto? No solo buscamos un cargo, buscamos el perfil de la persona.) | Operaciones Canales Alternativos SBS |
| :---- | :---- |
| **Quiero** (aquí describimos su intención) | Crear la “Carga universal de recaudos” en el módulo carga universal |
| **Para (Propósito / Beneficio)** (¿cómo encaja su deseo inmediato de hacer algo en la perspectiva general? ¿Cuál es el beneficio general que intentan lograr? ¿Cuál es el gran problema que debe resolverse?) | Que por medio de la estructura ya parametrizada para el Sponsor Rappi se puedan ingestar los recaudos de diferentes Sponsor como Lulo. |

3. **DETALLE DEL DESARROLLO SOLICITADO**  
     
   1. **Relacionar Lulo en lista Sponsor**

   

   En el módulo de carga universal se debe relacionar en la lista de sponsor a Lulo Bank, para que al ser seleccionado permita ingestar diferentes tipos de carga posibles según su parametrización.

![Interfaz de usuario gráfica, AplicaciónEl contenido generado por IA puede ser incorrecto.][image1]

2. **Creación carga Universal de recaudos**

   

   En el módulo de carga universal, se debe crear la carga “Carga Universal Recaudo”, y habilitarse para el sponsor Lulo Bank.

![Interfaz de usuario gráfica, AplicaciónEl contenido generado por IA puede ser incorrecto.][image2]

3. **Procesamiento Recaudos – Carga universal de recaudos**

   

   La estructura con la que se deben procesar los recaudos es la misma estructura que ya se encuentra parametrizada en SIPA Banca para ingestar al momento los recaudos del sponsor Rappi, siendo la siguiente estructura:

   

   ![][image3]

   Los campos obligatorios necesarios para permitir el procesamiento del archivo, son los de las siguientes columnas: 

   

* Columna K: CODIGO UNICO DE POLIZA  
* Columa L: UID  
* Columna AD: FECHA DE RECAUDO  
* Columna AE: VALOR PAGADO  
* Columna X: INICIO VIGENCIA POLIZA   
* Columna AG: MONTO PRIMA 


  Las demás columnas si se cargan en blanco o viajan vacías, no deberían impedir el procesamiento de los recaudos. 


  Cuando se cargue el archivo de ingesta de recaudos con solo las columnas obligatorias o con todas las columas o con ciertas columnas adicionales a las obligatorias, los datos ingestados deben ser almacenados siguiendo la lógica de la HU \- OMEGA-6084 “Almacenamiento datos Históricos sobre Ingesta Recaudos”.


  **Nota:** La prima reportada en la ingesta deberá aplicarse a la cuota pendiente más antigüa por recaudar según plan de pagos y el valor reportado en la ingesta corresponde al recaudo total es decir con IVA incluido. 


  4. **Control recaudos procesados**


     1. **Recaudo exacto**


  Sí al momento de ingestar los recaudos de Lulo Bank, el recaudo ingestado vs la prima de la cuota calculada en el momento de la emisión por SIPA coinciden en valor o presenta una diferencia negativa no mayor a \-$50, estos registros deberán procesarse de forma correcta en SIPA Banca, sin generar registro en el log de errores. 


     2. **Recaudo con diferencia Negativa.**


  Sí al momento que se este procesando la ingesta, el recaudo de una póliza presenta una diferencia negativa superior a \-$50 con respecto a la prima de la cuota a recaudar (valida contra la cuota a recaudar y no sobre el saldo). SIPA Banca deberá rechazar el registro y no permitir la ingesta, reportandolo en el log de erorres, como se indica en el punto 3.6.1. 


     3. **Recaudo con diferencia Positiva.**


  En caso dado que se presente una diferencia positiva en la prima recaudada, posterior a aplicarse el recaudo, este valor debe seguir aplicandose a la siguiente o las siguientes cuotas que se encuentren pendientes por recaudar. 

  **NOTA:** Para la carga universal de recaudos de Lulo Bank, SIPA Banca deberá procesar los registros que se encuentren correctos (3.4.1. y 3.4.3) y rechazar (3.4.2) y reportar en el log de errores, los registros que presentan algún error marcando el registro como tipo ERROR como se indica en el punto 3.6.1.

     4. **Diferencia de recaudo en la última cuota del aniversario**


  En caso que se presente una diferencia positiva no mayor a $50 sobre la última cuota del aniversario vigente, SIPA Banca deberá permitir la ingesta del recaudo, si la diferencia es positiva mayor a $50 deberá rechazar el recaudo y reportarlo en el log de errores.  como se indica en el punto 3.6.2. 

**![][image4]**

5. **Descripción de los rechazos log errores “Recaudos Lulo Bank”**

El recaudo será aplicado a cada cuota según la vigencia del plan de cada póliza, donde en este caso es de vigencia abierta.

1. **Recaudo rechazado con diferencia negativa.** 

Para las pólizas de Lulo Bank con recaudo rechazado por diferencia negativa, se deberá reportar el error de la siguiente forma:

- El recaudo para la póliza \[póliza tercero\] del  Aniversario \[Número aniversario de la vigencia\] correspondiente a la cuota \[Número de cuota rechazada\] con fecha de vencimiento \[Fecha recaudo según plan de pagos\] presento diferencia de \[Ubicar diferencia calculada en $\]

**Ejemplo:** El recaudo para la póliza 449184 del Aniversario 1 correspondiente a la cuota 2 con fecha de vencimiento 22/12/2025 presento diferencia de \-$500

2. **Recaudo rechazado con diferencia positiva.** 

   

   Para las pólizas con recaudo rechazado con diferencia positiva mayor a $50 en la última cuota del aniversario actual, se deberá reportar el error de la siguiente forma:

   

- El recaudo para la póliza \[póliza tercero\] del  Aniversario \[Número aniversario de la vigencia\] correspondiente a la cuota \[Número de cuota rechazada\] con fecha de vencimiento \[Fecha recaudo según plan de pagos\] presento diferencia de \[Ubicar diferencia calculada en $\] vs el saldo pendiente por recaudar.

  **Ejemplo:** El recaudo para la póliza 449184 del Aniversario 1 correspondiente a la cuota 12 con fecha de vencimiento 22/12/2025 presento diferencia de $500

  **Adjunto Ejemplo**

  ![][image5]

**NOTA:** En el Log se debe evidenciar la cantidad de registros cargados, cargados con éxito y procesados con error.

3.5.	Creación de Tipo Ingesta **“Carga Universal Recaudos”**, asociar en tipo\_ingesta\_sponsor **Lulo**, y  marcar como proceso independiente, marcar como id\_cola 1, parametrizar validar\_duplicidad\_archivo en true;

6. Configurar ingesta\_paso con los datos del recaudo de las columnas obligatorias.

   7. Se debe realizar un envió de correo que confirme el fin del proceso de procesamiento por colas, se debe colocar en el asunto del correo el prefijo (PRE) para cuando el ambiente no sea productivo.

      1. Se debe enviar al correo del usuario que este cargando el recaudo.  
      2. Se debe enviar en copia oculta al correo de operaciones [**operacionescanalesalternativos@sbseguros.co**](mailto:operacionescanalesalternativos@sbseguros.co) 

**Asunto:** Cargue Recaudos \[Sponsor\] \_ \[ddmmaaaa\] \-Ambiente. (PRE)

**Cuerpo del Correo:**

Estimado,

Ya se encuentra disponible el log de recaudos, puede ingresar a SIPA para descargarlo con el id de carga \[id\_Carga\]

Cordialmente,

SBS Seguros Colombia S.A. \- Compañía de Seguros

*Esta dirección de correo electrónico es únicamente para envíos automáticos de información y no está habilitado para recibir respuestas o consultas. Le solicitamos incluir esta cuenta en su lista de contactos para que no sea marcada como “Correo no deseado” y siga recibiendo la información.*

8. **Evidencia recaudos en malla**

Para la visualización en la malla de SIPA Banca de los recaudos procesados desde el módulo de carga universal, sponsor “Lulo” \- “Carga Universal Recaudos” deben heredar la lógica actual que cuenta SIPA Banca, donde estos recaudos puedan evidenciarse en el módulo de consulta en la sección “Aniversarios y Novedades”, al seleccionar el botón “Ver Recaudos” en la columna Opciones.

**Ejemplo visualización:**

9. **Reporte único procesamiento**

Los archivos de carga universal “Carga Recaudos Lulo”, deben ser de único procesamiento, es decir, no se podrá permitir la carga de un archivo bajo el mismo nombre más de una vez.

2. **ACLARACIONES**  
     
   1. Los recaudos aplicados para el Sponsor Lulo Bank deben relacionarse en el Reporte Recaudos, siguiendo la lógica establecida del reporte.  
   2. Esta HU aplica solo para carátula con recaudo mensual y no para carátulas con recaudo de prima única, sin embargo, dentro del desarrollo no quedará ningún control que restrinja la carga de recaudos por producto.   
   3. Los recaudos NO aplicados para el Sponsor Lulo Bank deben relacionarse en el Reporte Lógica de Moras, siguiendo la lógica establecida del reporte.  
   4. Los recaudos aplicados para el Sponsor Lulo deben relacionarse en el Reporte de Facturación, siguiendo la lógica establecida del reporte.  
   5. Los archivos que se ingesten en la carga “Carga Recuados Lulo” deben ser de único procesamiento.  
   6. Los log de errores deberán mantener la estructura actual.  
   7. Los controles del punto 3.4. ya se encuentran desarrollados bajo la HU OMEGA-9787  
   8. No se procesaran recaudos negativos. 

   

3. **TEMAS PENDIENTES**  
     
   1. Modificación mockup punto 3.2. Hecho

   

4. **DEPENDENCIAS DE OTRAS HISTORIAS DE USUARIO**  
     
   1. OMEGA-9787\[Infraestructura\] Parametrización Estructura Carga Universal (Recaudos). 

   

5. **CRITERIOS DE ACEPTACIÓN** (Características que un producto debe cumplir en orden de corroborar que fue desarrollado según las expectativas de los interesados)

| Criterio de aceptación | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | :---: | :---: |
| Se debe evidenciar en el módulo de carga universal se debe mostrar a “Lulo Bank” como sponsor seleccionable.  |  |  |
| Se debe evidenciar el nombre de la carga “Carga Recaudos Lulo” |  |  |
| La estructura de datos adjunta debe estar completamente parametrizada y debe permitir la ingesta de recaudos en el sistema de todos los registros que cumplan con las condiciones de los puntos 3.5.1. y 3.5.3. |  |  |
| La estructura de datos debe ser almacenada en el sistema siguiendo las reglas de homologación especificadas (Punto 3.3). |  |  |
| SIPA deberá validar la prima ingestada vs la prima calculada para cada cuota en el plan de pagos de cada póliza y evidenciar si el recaudo ingestado es igual al valor de la cuota calculada o presenta una diferencia negativa menor o igual a \-$50, o una diferencia positiva (Punto 3.5.1. – 3.5.3.) y aplicar el recaudo. |  |  |
| SIPA deberá validar la prima ingestada vs la prima calculada para cada cuota en el plan de pagos de cada póliza y si el recaudo ingestado presenta una diferencia negativa superior a $50, (Punto 3.5.2.) no se deberá aplicar el recaudo |  |  |
| Si un recaudo es rechazado porque la prima ingestada es inferior a la parametrizada, se deberá reportar en el log de errores |  |  |
| Los recaudos cargados exitosamente deben estar disponibles en el módulo de consulta en la sección “Aniversarios y Novedades”, inmediatamente después de la ingesta de recaudos. |  |  |
| En caso de presentarse un error en la estructura de la ingesta se debe generar el Pop Up informando el error en la estructura. |  |  |
| Los archivos de carga universal “Carga Recaudos Lulo”, deben ser de único procesamiento. |  |  |
| Los recaudos aplicados para Lulo Bank, se deberán evidenciar en el reporte de Recaudos. |  |  |
| Los recaudos aplicados para Lulo Bank, se deberán evidenciar en el reporte de Facturación. |  |  |
| Las pólizas a las cuales no se les haya generado aplicación de recaudos se deberán evidenciar en el reporte de moras. |  |  |
| Generar pruebas de regresión de Recaudos Finandina  |  |  |

   

6. **CRITERIOS DE ACEPTACIÓN DE SEGURIDAD DE INFORMACIÓN**

| Criterio de aceptación de seguridad de información | Confirmación entendimiento DEV | Confirmación entendimiento QA |
| ----- | ----- | ----- |
|  |  |  |

| VIABILIDAD TÉCNICA (Visto bueno por parte del líder técnico, confirmando la viabilidad técnica del desarrollo solicitado) | SI | NO |
| :---- | ----- | ----- |
|  |    X |     |

| LINK DE LA GRABACIÓN |  |
| :---- | :---- |

| FECHA DE REFINAMIENTO: |  12/02/2026 |
| :---- | :---- |

