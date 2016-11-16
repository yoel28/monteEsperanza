declare var moment:any;
declare var Table2Excel:any;
declare var humanizeDuration:any;

export class CatalogApp {

    //lista de rangos disponibles
    public static get itemsDate(): any
    {
        return [
            {'id':'1','text':'Hoy'},
            {'id':'2','text':'Semana actual'},
            {'id':'3','text':'Mes actual'},
            {'id':'4','text':'Mes anterior'},
            {'id':'5','text':'Últimos 3 meses'},
            {'id':'6','text':'Año actual'},
        ];
    }

    //calcular rango de fechas dependiendo del id de itemsDate()
    public static getDateRange(itemDate:string):any
    {
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let range:any={'start':null,'end':null};
        switch (itemDate)
        {
            case "1" : //hoy
                range.start = moment().format('DD-MM-YYYY');
                range.end   = moment().add(1,'day').format('DD-MM-YYYY');
                break;
            case "2" ://Semana Actual
                range.start = moment().startOf('week').format('DD-MM-YYYY');
                range.end   = moment().endOf('week').format('DD-MM-YYYY');
                break;
            case "3" ://mes actual
                range.start = moment().startOf('month').format('DD-MM-YYYY');
                range.end   = moment().endOf('month').format('DD-MM-YYYY');
                break;
            case "4" ://mes anterior
                range.start = moment().subtract(1, 'month').startOf('month').format('DD-MM-YYYY');
                range.end   = moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY');
                break;
            case "5" ://ultimos 3 meses
                range.start = moment().subtract(3, 'month').startOf('month').format('DD-MM-YYYY');
                range.end   = moment().endOf('month').format('DD-MM-YYYY');
                break;
            case "6" ://ano actual
                range.start = moment().startOf('year').format('DD-MM-YYYY');
                range.end   = moment().endOf('year').format('DD-MM-YYYY');
                break;
        }
        return range;
    }

    public static exportExcel(title:string,idClass?:string):any
    {
        let table2excel = new Table2Excel({
            'defaultFileName': title,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v:cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll("table."+ ( idClass || 'export')));
    }

    public static get formatDateDDMMYYYY():any
    {
        return {'format':"DD-MM-YYYY","minDate":"01-01-2016"};
    }

    public static get msg():any
    {
        let msg:any = {};

        msg.error="El campo contiene errores";
        msg.required="Este campo es obligatorio";
        msg.noAuthorized="No posee permisos para esta accion";
        msg.object="La referencia no esta registrada";
        msg.email="Correo electronico invalido";
        msg.notFound="No se encontraron resultados";
        msg.warningTitle="Advertencia";
        msg.warningBody="El cambio de estas configuraciones avanzadas puede ser perjudicial para la estabilidad, la seguridad y el rendimiento de esta aplicación. Sólo se debe continuar si está seguro de lo que hace.";
        msg.warningButtonExit="Salir";
        msg.warningButtonYes="Sí, estoy seguro";

        return msg;

    }

    public static dateHmanizer = humanizeDuration.humanizer({
        language: 'shortEs',
        round: true,
        languages: {
            shortEs: {
                y: function () {
                    return 'y'
                },
                mo: function () {
                    return 'm'
                },
                w: function () {
                    return 'Sem'
                },
                d: function () {
                    return 'd'
                },
                h: function () {
                    return 'hr'
                },
                m: function () {
                    return 'min'
                },
                s: function () {
                    return 'seg'
                },
                ms: function () {
                    return 'ms'
                },
            }
        }
    });

    public static get formatDatePickerDDMMYYYY():any{
        return {
            'format': 'dd/mm/yyyy',
            'startDate':'01/01/2016',
            'startView': 2,
            'minViewMode': 0,
            'maxViewMode': 2,
            'forceParse': false,
            'language': "es",
            'todayBtn': "linked",
            'autoclose': true,
            'todayHighlight': true,
            'return': 'DD/MM/YYYY'
        }
    }

    //recibe un numerico en milisegundos
    public static formatTime (time:number){
        if (time < 1800000)//menor a 30min
            return  this.dateHmanizer(time, {units: ['m', 's']});
        if (time < 3600000) //menor a 1hora
            return this.dateHmanizer(time, {units: ['m']});
        return this.dateHmanizer(time, {units: ['h', 'm']});
    }
}