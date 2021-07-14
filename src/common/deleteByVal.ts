export default function deleteByVal(val: any, iterable: Map<any, any> | object): void {
    if(iterable instanceof Map) {
        deleteFromMapByVal(val, iterable);
    } else if (typeof iterable === 'object') {
        deleteFromObjByVal(val, iterable);
    }
}

function deleteFromMapByVal(val: any, iterable: Map<any,any>): void {
    iterable.forEach((element: any, key: any) => {
        if (element === val) {
            iterable.delete(key)
        }
    });
}

function deleteFromObjByVal(val: any, obj: object): void {
    for (const key in obj) {
        if (obj[key as keyof typeof obj] === val) {
            delete obj[key as keyof typeof obj];
        }
    }
}