#!/bin/bash
#dev.aguaseo.com
url="https://dev.aguaseo.com:8080/api/permissions/";
token="50jislnq5vel576qcd4u9ba3063tq78g";

#url="http://vertedero.aguaseo.com:8080/api/permissions/";


#Modulos-------------------------------------------------------------------------------------------------------------------------------------
declare -A Modulos;
Modulos[0,0]="ZONE";	Modulos[0,1]="Zonas";			Modulos[0,2]="zone";

#PREFIX			Modulo			Controlador
#Modulos[0,0]="";	Modulos[0,1]="";	Modulos[0,2]="";
for (( i=0; i<=1; i++ ));
do
	echo -e "\n\n${Modulos[$i,0]}---${Modulos[$i,1]}---${Modulos[$i,2]}\n";
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_LIST','module':'${Modulos[$i,1]}','title':'Listar','controlador':'${Modulos[$i,2]}','accion':'index','detail':'Listar elementos'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_ADD','module':'${Modulos[$i,1]}','title':'Agregar','controlador':'${Modulos[$i,2]}','accion':'save','detail':'Guardar elemento'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_UPDATE','module':'${Modulos[$i,1]}','title':'Actualizar','controlador':'${Modulos[$i,2]}','accion':'update','detail':'Actualizar elemento'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_DELETE','module':'${Modulos[$i,1]}','title':'Eliminar','controlador':'${Modulos[$i,2]}','accion':'delete','detail':'Borrar elementos'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_FILTER','module':'${Modulos[$i,1]}','title':'Filtrar','controlador':'','accion':'','detail':'Filtrar elemento'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_LOCK','module':'${Modulos[$i,1]}','title':'Bloquear','controlador':'${Modulos[$i,2]}','accion':'lock','detail':'Bloquear elemento'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_SEARCH','module':'${Modulos[$i,1]}','title':'Buscar','controlador':'${Modulos[$i,2]}','accion':'search','detail':'Buscar elemento'}"  -k $url


	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_WARNING','module':'${Modulos[$i,1]}','title':'Advertencia','controlador':'${Modulos[$i,2]}','accion':'','detail':'Mensaje de advertencia'}"  -k $url

	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_AUDICT','module':'${Modulos[$i,1]}','title':'Auditar','controlador':'${Modulos[$i,2]}','accion':'','detail':'Auditar'}"  -k $url
done


#Menu------------------------------------------------------------------------------------------------------------------------------------------------------------------------
declare -A Menu;
Menu[0,0]="MEN_CHOFER";Menu[0,1]="Chofer";
Menu[1,0]="MEN_OP_AUD";Menu[1,1]="Auditoria de operaciones";
Menu[2,0]="MEN_ZONE";Menu[2,1]="Zonas";
Menu[3,0]="MEN_PLACE";Menu[3,1]="Lugares";


for (( i=0; i<=3; i++ ));
do
	echo -e "\n\n${Menu[$i,0]}---${Menu[$i,1]}\n";
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Menu[$i,0]}','module':'menu izquierda','title':'${Menu[$i,1]}','controlador':'','accion':'','detail':'Menu ${Menu[$i,1]}'}"  -k $url
done
