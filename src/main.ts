import { 
    Plugin,
    MarkdownPostProcessorContext,
    MarkdownRenderer,
    Editor,
    MarkdownView,
    TFile,
    parseYaml
} from 'obsidian';

import { 
    FoodiarySettingTab,
    FoodiarySettings,
    DEFAULT_SETTINGS 
} from './settings';

interface Product {
    titles: Array<string>;
    value: NutritionalValue
}

interface NutritionalValue {
    calories: number;
    protein: number;
    fat: number;  
    carbs: number;    
}

interface IncomeItem {
    product: Product;
    weight: number;
    value: NutritionalValue;
}

interface Income {
    total: NutritionalValue;
    items: Array<IncomeItem>;    
    unknownProducts: Array<String>;
}

interface LogLine {
    title: string;
    weight: number;
}

export default class Foodiary extends Plugin {    
    settings: FoodiarySettings;

    async onload() {
        
        await this.loadSettings();

		this.addSettingTab(new FoodiarySettingTab(this.app, this));

		this.addCommand({
			id: 'insert-food-log',
			name: 'Insert food log',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection("```foodiary\n\n```");
			}
		});

        this.registerMarkdownCodeBlockProcessor("foodiary", async (src, el, ctx) => {
            
            try 
            {            
                const root = el.createEl("div");
                const body = root.createEl("div");

                await this.renderLog(src, body, ctx);
            }
            catch (error) 
            {
                el.createEl("h3", {text: `Failed to show log: ${error.message}`});
            }

        });
    }

    onunload() {        
    }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

    private async products2()
    {        
        let catalog = new Map<string, NutritionalValue>;

        const { vault } = this.app;

        const files = this.app.vault.getMarkdownFiles()
        
        for (let i = 0; i < files.length; i++) {

            if (files[i] instanceof TFile && files[i].path.startsWith(this.settings.productsFolder)) {
                let text = await vault.cachedRead(files[i])
                
                let regex = new RegExp("(?:---((?:.*?\r?\n?)*)---)+");
                let match = regex.exec(text);

                if (match !== null) {

                    let properties = parseYaml(match[1])

                    let item: NutritionalValue = {
                        calories: properties[this.settings.propertyCalories],
                        protein: properties[this.settings.propertyProtein],
                        fat: properties[this.settings.propertyFat],
                        carbs: properties[this.settings.propertyCarbs],
                    }

                    catalog.set(files[i].basename, item)
                }
            }            
        }        

        return catalog;
    }

    private async products(): Promise<Product[]>
    {        
        let result = new Array<Product>;

        const { vault } = this.app;

        const files = this.app.vault.getMarkdownFiles()
        
        for (let i = 0; i < files.length; i++) {

            if (files[i] instanceof TFile && files[i].path.startsWith(this.settings.productsFolder)) {
                let text = await vault.cachedRead(files[i])
                
                let regex = new RegExp("(?:---((?:.*?\r?\n?)*)---)+");
                let match = regex.exec(text);

                if (match !== null) {

                    let properties = parseYaml(match[1])

                    result.push({
                        titles: [files[i].basename],
                        value: {
                            calories: properties[this.settings.propertyCalories],
                            protein: properties[this.settings.propertyProtein],
                            fat: properties[this.settings.propertyFat],
                            carbs: properties[this.settings.propertyCarbs],
                        }
                    })
                }
            }            
        }        

        return result;
    }    

    private async getLogEntry(input: string): Promise<LogLine> {

        let result: LogLine = {
            title: "",
            weight: 0
        }

        input = input.trim()
        
        if (input != "") {

            let inputParts = input.split(" ")

            if (inputParts.length > 1) {

                let weightString = inputParts.pop()    

                if (weightString != undefined) {
                    result.weight = parseInt(weightString);
                }                
            }

            result.title = inputParts.join(" ").trim()
        }

        return result;
    } 

    private async sortIncomeItemsByCalories(income: Income) {
        income.items.sort((l, r): number => {
            if (l.value.calories < r.value.calories) return 1;
            if (l.value.calories > r.value.calories) return -1;
            return 0;
        })        
    }

    private async calculateIncomeTotal(income: Income) {

        for (let item of income.items) {
            this.addNutritionalValue(income.total, item.value)
        }
    }

    private async addNutritionalValue(targetValue: NutritionalValue, sourceValue: NutritionalValue) {
        targetValue.calories += sourceValue.calories
        targetValue.protein += sourceValue.protein
        targetValue.fat += sourceValue.fat
        targetValue.carbs += sourceValue.carbs
    }

    private async calculateIncomeItemValues(income: Income) {

        for (let item of income.items) {
            item.value.calories = Math.ceil(item.product.value.calories * item.weight / 100)
            item.value.protein  = Math.ceil(item.product.value.protein  * item.weight / 100)
            item.value.fat      = Math.ceil(item.product.value.fat      * item.weight / 100)
            item.value.carbs    = Math.ceil(item.product.value.carbs    * item.weight / 100)
        }
    }

    private async getNutritionalValue(): Promise<NutritionalValue> {
        return {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
        }
    }

    private async income(source: string) {

        let result: Income = {
            items: [],
            total: await this.getNutritionalValue(),
            unknownProducts: [],
        }

        let products = await this.products();        
                
		let sourceLines = source.split('\n')
		
		for (let sourceLine of sourceLines) {
			                
            let entry = await this.getLogEntry(sourceLine)

            if (! entry.title) {
                continue
            }
                
            let product = products.find(el => el.titles.find(el => el == entry.title))
                
            if (product === undefined) {			
                result.unknownProducts.push(entry.title)
                continue
            }

            let incomeItem = result.items.find(el => el.product.titles.find(el => el == entry.title))
            if (incomeItem == undefined) {
                result.items.push({
                    product: product,
                    weight: 0,
                    value: await this.getNutritionalValue(),
                })
                incomeItem = result.items[result.items.length - 1]
            }
                    
            incomeItem.weight += entry.weight
		}
        
        await this.calculateIncomeItemValues(result)
        await this.sortIncomeItemsByCalories(result)

        await this.calculateIncomeTotal(result)

        result.unknownProducts.sort()

        return result;
    }

    private async renderLog(src: string, body: HTMLElement, ctx: MarkdownPostProcessorContext) 
    {
        let income = await this.income(src)
        
        if (income.unknownProducts.length > 0) {

            let upLines = []

            upLines.push("> [!missing] Missing Products")

            for (let item of income.unknownProducts) {
                upLines.push(`> - [[${this.settings.productsFolder}/${item.toString()}|${item.toString()}]]`)
            }
            
            MarkdownRenderer.render(this.app, upLines.join("\n"), body, "", this)
            body.createEl("br")
        }


        let table = body.createEl("table")

        let tr = table.createEl("tr")
        tr.createEl("th", {text: "Product"})
        tr.createEl("th", {text: "Calories"})
        tr.createEl("th", {text: "Protein"})
        tr.createEl("th", {text: "Fat"})
        tr.createEl("th", {text: "Carbs"})

        for (let item of income.items) {

            tr = table.createEl("tr")

            tr.createEl("td", {text: item.product.titles[0]})
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
                
    }
    
}