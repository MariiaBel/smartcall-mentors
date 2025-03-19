import { MultiselectOption } from '@/app/types';


export function uniqueOptions(arr: any[], key: string, separator: string) {
    let options: string[] = [];
    arr.forEach((item) => {
        if (item[key]) {
            const stacks = item[key].split(separator).map((item: string) => item.trim());
            options.push(...stacks);
        }
    });
    options = Array.from(new Set(options));
    return Array.from(new Set(options))

}

export function getValues(options: MultiselectOption[]): string {
    return options.reduce((acc, option) => acc ? `${acc},${option.value}` : option.value, '')
}