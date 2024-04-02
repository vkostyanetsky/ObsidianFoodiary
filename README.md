# Obsidian Foodiary 📑 🥪 🍎

It is a plugin for [Obsidian](https://obsidian.md) designed to help you monitor the nutritional value of the food you eat.

## 🙂 How to use it?

### Create the products folder

First, you should specify the "Product folder" in the plugin's settings ("Products" by default). It refers to a folder in your vault that is supposed to contain nutrition data for the food you eat.  

Here is [an example](sample/Products) of the folder in the [sample vault](sample). Please note:

1. Each file refers to a product. The name of it is how you are going to refer it in your notes. You can also use the standard "aliases" property: for instance, you are able to create a note named "Apple", and then set the aliases: "Apples", "Red apples", etc. Take a look at example in the sample vault by the link above.
3. Each file has four properties: `calories`, `protein`, `fat` and `carbs`. All of them are supposed to contain nutritional values for the represented product and must be indicated per 100 grams.

Please note that you can rename those properties in the plugin's settings.

### Use code block in daily notes

You make daily notes, I guess. So, every day, you add a `foodiary` code block to enlist the food you eat. You can do it manually or via the "Insert food diary" command.

Here is [an example](sample/Daily%20Notes) in the [sample vault](sample).

For instance, you ate 300 grams of apples and 85 grams of donuts. So, you add this:

````
```foodiary
Apples 150+150
Donuts 85
```
````

As a result, the code block shows you something like this:

| Product | Calories | Protein | Fat | Carbs |
| ------- | -------- | ------- | --- | ----- |
| Donuts  | 252      | 5       | 12  | 33    |
| Apples  | 141      | 2       | 2   | 30    |
| TOTAL   | 393      | 7       | 14  | 63    |

So the plugin takes the food you refer to in the code block, finds it in the products catalog, and then shows total nutrition for each product you have consumed during the day.