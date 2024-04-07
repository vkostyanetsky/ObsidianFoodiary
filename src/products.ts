import {
    TFile,
    parseYaml,    
} from 'obsidian';

import {
    Product
} from './types'

import Foodiary from './main';

export default class FoodiaryProducts {

    public static async products(plugin: Foodiary) {        

        let products = new Array<Product>;
        
        const files = plugin.app.vault.getMarkdownFiles()
        
        for (let i = 0; i < files.length; i++) {

            let file = files[i]

            if (file instanceof TFile && file.path.startsWith(plugin.settings.productsFolder)) {
                await this.addProduct(plugin, products, file)
            }
        }        

        return products;
    }    

    private static async addProduct(plugin: Foodiary, products: Array<Product>, file: TFile) {
        
        let productProperties = await this.productProperties(plugin, file)
        
        if (productProperties != undefined) {

            let titles = [file.basename.toLowerCase()]

            if (productProperties.aliases !== undefined) {
                productProperties.aliases.forEach((element: string) => {
                    titles.push(element.toLowerCase())
                });
            }
            
            let product = {
                title: file.basename,
                titles: titles,
                value: {
                    calories: productProperties[plugin.settings.propertyCalories],
                    protein:  productProperties[plugin.settings.propertyProtein],
                    fat:      productProperties[plugin.settings.propertyFat],
                    carbs:    productProperties[plugin.settings.propertyCarbs],
                }
            }

            await this.checkProperty(product.value.calories, plugin.settings.propertyCalories, file)
            await this.checkProperty(product.value.protein, plugin.settings.propertyProtein, file)
            await this.checkProperty(product.value.fat, plugin.settings.propertyFat, file)
            await this.checkProperty(product.value.carbs, plugin.settings.propertyCarbs, file)

            products.push(product)
        }            
    
    }
    
    private static async checkProperty(propertyValue: any, propertyName: string, file: TFile) {
        if (typeof propertyValue !== "number") {
            throw Error(`type of "${propertyName}" property in "${file.name}" note is not number`)
        }
    }    

    private static async productProperties(plugin: Foodiary, file: TFile) {
     
        return plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    }

}