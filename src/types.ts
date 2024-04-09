export interface Product {
    title: string;
    titles: Array<string>;
    value: NutritionalValue
}

export interface NutritionalValue {
    calories: number;
    protein: number;
    fat: number;  
    carbs: number;    
}

export interface IncomeItem {    
    product: Product;
    weight: number;
    title: string;
    value: NutritionalValue;
}

export interface Income {
    total: NutritionalValue;
    items: Array<IncomeItem>;    
    unknownProducts: Array<String>;
}

export interface LogLine {
    title: string;
    weight: number;
}