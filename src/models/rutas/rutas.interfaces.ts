export interface intPutRuta {
    Colaborador:string,
    Descripcion:string,
    Casos:Array<string>,
    Insumos: Array<{
        Tipo:string,
        Observacion:string,
        Valor:number,
        Kilometro:number
    }>,
    FechaSalida:Date
}