# Foodiary 🍅 🍒 🍊

It is a plugin for [Obsidian](https://obsidian.md) designed to help you monitor nutritios of food you eat.

## 🙂 How to use it?

### Create products folder

First of all, you should specify the "Product folder" setting in plugin's settings. It refers to a folder in your fault supposed to contain nutrition data for the food you eat.  

Here is [an example](sample/Products) of the folder. Please note:

1. Each file refers to a product.
2. The name of each file is how you are going to refer it in your notes.
3. There are four properties: calories number, protein number, fats number and carbs number. All values must be indicated per 100 grams.

### Insert code block in daily notes

You maintain daily notes, I guess. Every day, you can add a `foodiary` code block (you can do this using "Insert food diary" command or manually). 

In the block, you can list all the food you consume during the day. For instance:

````
```foodiary
Eggs: 100
Apples: 200
```
````

The plugin takes the code block and shows total nutrition for each product you have consumed during the day, and total nutrition values for all the products.