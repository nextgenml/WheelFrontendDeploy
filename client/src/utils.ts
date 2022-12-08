
export function stringToDate(date_str: string) {
    let date = new Date();
    let date_str_arr: string[] = date_str.split('/');
    date.setDate(parseInt(date_str_arr[0]));
    date.setMonth(parseInt(date_str_arr[1])-1)
    date.setFullYear(parseInt(date_str_arr[2]))

    return date;
}


export function getFormattedHash(hash:string) {
    return  hash.slice(0,5) + "..."+hash.substring(hash.length - 5)
}


export function DateToString(date: Date) {
    let d = date.getDate();
    let d_str = d.toString();
    if (d < 9) {
        d_str = '0' + d.toString()
    }
    return `${d_str}/${date.getMonth() + 1}/${date.getFullYear()}`;
}