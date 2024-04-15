import {
    TFile,
} from 'obsidian';

import {
    Product
} from './types'

import Foodiary from './main';

export default class FoodiaryProducts {

    public static async products(plugin: Foodiary) {        

        const products = new Array<Product>;        

        const files = plugin.app.vault.getMarkdownFiles()
        
        for (let i = 0; i < files.length; i++) {

            const file = files[i]

            if (file instanceof TFile && file.path.startsWith(plugin.settings.productsFolder)) {
                await this.addProduct(plugin, products, file)
            }
        }        

        return products;
    }    

    private static async addProduct(plugin: Foodiary, products: Array<Product>, file: TFile) {
        
        const productProperties = await this.productProperties(plugin, file)
        
        if (productProperties != undefined) {

            const titles = [file.basename.toLowerCase()]

            if (productProperties.aliases != null) {
                productProperties.aliases.forEach((element: string) => {
                    titles.push(element.toLowerCase())
                });
            }
            
            const product = {
                title: file.basename,
                titles: titles,
                value: {
                    calories: this.propertyValue(productProperties[plugin.settings.propertyCalories]),
                    protein:  this.propertyValue(productProperties[plugin.settings.propertyProtein]),
                    fat:      this.propertyValue(productProperties[plugin.settings.propertyFat]),
                    carbs:    this.propertyValue(productProperties[plugin.settings.propertyCarbs]),
                }
            }

            products.push(product)
        }            
    
    }

    private static propertyValue(propertyValue: number) {
        return typeof propertyValue == "number" ? propertyValue : 0;
    }       

    private static async checkProperty(propertyValue: number, propertyName: string, file: TFile) {
        if (typeof propertyValue !== "number") {
            throw Error(`type of "${propertyName}" property in "${file.name}" note is not number`)
        }
    }    

    private static async productProperties(plugin: Foodiary, file: TFile) {
     
        return plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    }

}