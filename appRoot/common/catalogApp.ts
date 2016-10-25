declare var moment:any;
declare var Table2Excel:any;

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


}