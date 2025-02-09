import { 
    MarkdownPostProcessorContext,    
    MarkdownRenderer,
	TFile,
} from 'obsidian';

import { Parser } from 'expr-eval';

import { LogLine, NutritionalValue, Income } from '../types';

import FoodiaryProducts from '../products';

import Foodiary from '../main';

export default class FoodiaryCodeBlock {

    public static async renderDiary(plugin: Foodiary, src: string, body: HTMLElement, ctx: MarkdownPostProcessorContext) 
    {
        const income = await this.income(plugin, src)

        if (income.unknownProducts.length > 0) {

            const upLines = []

            upLines.push("> [!missing] Missing products")

            for (const item of income.unknownProducts) {
                upLines.push(`> - [[${plugin.settings.productsFolder}/${item.toString()}|${item.toString()}]]`)
            }
            
            MarkdownRenderer.render(plugin.app, upLines.join("\n"), body, "", plugin)
            body.createEl("br")
        }
        
        const table = body.createEl("table")

        let tr = table.createEl("tr")
        tr.createEl("th", {text: "Product"})
        tr.createEl("th", {text: "Calories"})
        tr.createEl("th", {text: "Protein"})
        tr.createEl("th", {text: "Fat"})
        tr.createEl("th", {text: "Carbs"})

        for (const item of income.items) {

            tr = table.createEl("tr")

            tr.createEl("td", {text: item.title})
            tr.createEl("td", {text: item.value.calories.toString()})
            tr.createEl("td", {text: item.value.protein.toString()})
            tr.createEl("td", {text: item.value.fat.toString()})
            tr.createEl("td", {text: item.value.carbs.toString()})
        }

        tr = table.createEl("tr")
        
        tr.createEl("td", {text: "TOTAL"})
        tr.createEl("td", {text: income.total.calories.toString()})
        tr.createEl("td", {text: income.total.protein.toString()})
        tr.createEl("td", {text: income.total.fat.toString()})
        tr.createEl("td", {text: income.total.carbs.toString()})        
        
        if (plugin.settings.propertyDailyCalorieGoal != "") {
            
            const currentFile = plugin.app.workspace.getActiveFile();
            if (!currentFile) {
                console.warn("No active file found.");
                return;
            }

            const frontmatter = await this.fileProperties(plugin, currentFile);
            if (!frontmatter) {
                console.warn("No frontmatter found in the current file.");
                return;
            }

            const goal = this.propertyValue(frontmatter[plugin.settings.propertyDailyCalorieGoal]);

            const remaining = (goal - income.total.calories)
   
            tr = table.createEl("tr")
            
            tr.createEl("td", {text: "REMAINING"})
            tr.createEl("td", {text: remaining.toString() + ' / ' + goal.toString() })

        }
        
    }

    private static propertyValue(propertyValue: number) {
        return typeof propertyValue == "number" ? propertyValue : 0;
    }       

    private static async fileProperties(plugin: Foodiary, file: TFile) {
        return plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    }

    private static async income(plugin: Foodiary, source: string) {
        const result: Income = {
            items: [],
            total: await this.getNutritionalValue(),
            unknownProducts: [],
        }
        
        const products = await FoodiaryProducts.products(plugin)
        
        const sourceLines = source.split('\n')

        for (const sourceLine of sourceLines) {

            const entry = await this.getLogEntry(sourceLine)

            // Empty row, I guess?
            
            if (! entry.title) {
                continue
            }

            const titleToSearch = entry.title.toLowerCase()

            const product = products.find(el => el.titles.find(el => el == titleToSearch))
                
            if (product === undefined) {			
                result.unknownProducts.push(entry.title)
                continue
            }

            const incomeTitle = plugin.settings.showProductFolderTitles ? product.title : entry.title;
            let incomeItem = plugin.settings.groupEntriesByTitles
                ? result.items.find(el => el.title == incomeTitle)
                : undefined;

            if (incomeItem == undefined) {
                result.items.push({                    
                    product: product,
                    weight: 0,                    
                    title: incomeTitle,
                    value: await this.getNutritionalValue(),
                })
                incomeItem = result.items[result.items.length - 1]
            }
                    
            incomeItem.weight += entry.weight
        }
        
        await this.calculateIncomeItemValues(result)
        await this.sortIncomeItemsByCalories(result)

        await this.calculateIncomeTotal(result)

        await this.processUnknownProducts(result)

        return result;
    }

    private static async calculateIncomeItemValues(income: Income) {
        for (const item of income.items) {
            item.value.calories = Math.ceil(item.product.value.calories * item.weight / 100)
            item.value.protein  = Math.ceil(item.product.value.protein  * item.weight / 100)
            item.value.fat      = Math.ceil(item.product.value.fat      * item.weight / 100)
            item.value.carbs    = Math.ceil(item.product.value.carbs    * item.weight / 100)
        }
    }

    private static async processUnknownProducts(income: Income) {        
        income.unknownProducts = Array.from(new Set(income.unknownProducts))
        income.unknownProducts.sort()        
    }

    private static async sortIncomeItemsByCalories(income: Income) {
        income.items.sort((l, r): number => {
            if (l.value.calories < r.value.calories) return 1;
            if (l.value.calories > r.value.calories) return -1;
            return 0;
        })        
    }

    private static async calculateIncomeTotal(income: Income) {
        for (const item of income.items) {
            this.addNutritionalValue(income.total, item.value)
        }
    }

    private static async addNutritionalValue(targetValue: NutritionalValue, sourceValue: NutritionalValue) {
        targetValue.calories += sourceValue.calories
        targetValue.protein += sourceValue.protein
        targetValue.fat += sourceValue.fat
        targetValue.carbs += sourceValue.carbs
    }

    private static async getNutritionalValue(): Promise<NutritionalValue> {
        return {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
        }
    }

    private static async getLogEntry(input: string): Promise<LogLine> {
        const result: LogLine = {
            title: "",
            weight: 0
        }
        
        input = input.trim()
        
        if (input != "") {
            const inputParts = input.split(" ")

            if (inputParts.length > 1) {
                const weightString = inputParts.pop()    

                if (weightString != undefined) {
                    try {            
                        result.weight = await Parser.parse(weightString).evaluate()
                    }
                    catch (error) {
                        throw new Error(`Unable to parse weight of food in "${input}."`)
                    }
                }                
            }

            result.title = inputParts.join(" ").trim()
        }

        return result;
    } 

}
