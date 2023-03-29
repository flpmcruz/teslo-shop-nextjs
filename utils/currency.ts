export const format = (value: number) => {

    //Crear formateador
    const formatter = new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    //Retornar el valor formateado
    return formatter.format(value);
};
