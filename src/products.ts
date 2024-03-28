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

            products.push({
                titles: [file.basename],
                value: {
                    calories:   productProperties[plugin.settings.propertyCalories],
                    protein:    productProperties[plugin.settings.propertyProtein],
                    fat:        productProperties[plugin.settings.propertyFat],
                    carbs:      productProperties[plugin.settings.propertyCarbs],
                }
            })

        }            
    
    }    
    
    private static async productProperties(plugin: Foodiary, file: TFile) {
     
        return plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    }

}